import ImageRepository from "../../src/repositories/ImageRepository";
import OrderRepository from "../../src/repositories/OrderRepository";
import { IImage, IOrder, OStatus, OType } from "../../src/utils/Interfaces";
import interceptor from "../interceptor";

describe("Testing orders functions", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const fakeOrder: IOrder = {
    title: "Tarea genérica",
    description: "Desarrollar un ensayo sobre x cosa",
    due_at: "2024-01-14",
    status: OStatus.pending,
    type: OType.tarea,
    price: 750,
    client_id: 1,
    tasks: [
      {
        title: "Task 1",
        due_at: "2024-01-07 07:30:45",
        order_id: 1,
      },
    ],
  };

  test("It should create order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .post("/api/orders")
      .send(fakeOrder)
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.description).toEqual(fakeOrder.description);
  });

  test("It should update order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .put("/api/orders/1")
      .send({ ...fakeOrder, price: 850 })
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.price).toEqual(850);
  });

  test("It should change order to completed", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .patch("/api/orders/1")
      .send({ status: "Completado" })
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.status).toEqual("Completado");
  });

  test("It should get orders", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/orders")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.count).toBeGreaterThan(0);
  });

  test("It should find order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/orders/1")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.id).toEqual(1);
  });
  test("It should delete order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .delete("/api/orders/1")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.id).toEqual(1);
  });

  test("It should add images to Order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const sizes = ["300", "400", "500", "600"];
    const images = sizes.map(
      (size): IImage => ({
        url: `https://placehold.co/${size}`,
        caption: `Image ${size}`,
      })
    );
    const response = await interceptor
      .getServer()
      .patch("/api/orders/2/images")
      .send({ images: images })
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.length).toEqual(4);
  });

  test("It should catch error 500 on add images to Order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const sizes = ["300", "400", "500", "600"];
    const images = sizes.map(
      (size): IImage => ({
        url: `https://placehold.co/${size}`,
        caption: `Image ${size}`,
      })
    );
    jest.spyOn(ImageRepository.prototype, "asignToOrder").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .patch("/api/orders/2/images")
      .send({ images: images })
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
  test("It should catch error 500 on create order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(OrderRepository.prototype, "create").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .post("/api/orders")
      .send(fakeOrder)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch error 500 on update order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(OrderRepository.prototype, "update").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .put("/api/orders/1")
      .send(fakeOrder)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch error 500 on change order status", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(OrderRepository.prototype, "update").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .patch("/api/orders/1")
      .send(fakeOrder)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch error 500 on get orders", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(OrderRepository.prototype, "getAll").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/orders")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch error 500 on find order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(OrderRepository.prototype, "findById").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/orders/1")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch error 500 on delete order", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(OrderRepository.prototype, "delete").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .delete("/api/orders/1")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
});

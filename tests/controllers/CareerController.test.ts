import CareerRepository from "../../src/repositories/CareerRepository";
import { CGrade, ICareer } from "../../src/utils/Interfaces";
import interceptor from "../interceptor";
describe("Testing career functions", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("It should create new Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const newCareer: ICareer = {
      name: "Ingeniería de Software",
      sigla: "ISW",
      grade: CGrade.grade,
    };
    const response = await interceptor
      .getServer()
      .post("/api/careers")
      .send(newCareer)
      .set("Authorization", token);

    expect(response.status).toEqual(201);
    expect(response.body.content.sigla).toEqual(newCareer.sigla);
  });

  test("It should catch 422 on create new Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const newCareer: ICareer = {
      name: "Licenciatura en Educación",
      sigla: "LEDU",
      grade: CGrade.grade,
    };
    const response = await interceptor
      .getServer()
      .post("/api/careers")
      .send(newCareer)
      .set("Authorization", token);

    expect(response.status).toEqual(422);
  });

  test("It should update existing Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const newCareer: ICareer = {
      name: "Licenciatura en Educación",
      sigla: "LEDU",
      grade: CGrade.grade,
    };
    const response = await interceptor
      .getServer()
      .put("/api/careers/1")
      .send(newCareer)
      .set("Authorization", token);

    expect(response.status).toEqual(201);
    expect(response.body.content.sigla).toEqual(newCareer.sigla);
  });

  test("It should retrieve all careers", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/careers")
      .set("Authorization", token);

    expect(response.status).toEqual(200);
    expect(response.body.content.count).toBeDefined();
  });

  test("It should find a career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/careers/1")
      .set("Authorization", token);

    expect(response.status).toEqual(200);
    expect(response.body.content.id).toEqual(1);
  });

  test("It should delete a career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .delete("/api/careers/1")
      .set("Authorization", token);

    expect(response.status).toEqual(200);
    expect(response.body.content.id).toEqual(1);
  });

  test("It should catch 500 on create new Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const newCareer: ICareer = {
      name: "Ingeniería en Sistemas",
      sigla: "INGS",
      grade: CGrade.grade,
    };
    jest.spyOn(CareerRepository.prototype, "create").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .post("/api/careers")
      .send(newCareer)
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });

  test("It should catch 500 on update Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const newCareer: ICareer = {
      name: "Ingeniería en Sistemas",
      sigla: "INGS",
      grade: CGrade.grade,
    };
    jest.spyOn(CareerRepository.prototype, "update").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .put("/api/careers/1")
      .send(newCareer)
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });

  test("It should catch 500 on get all Careers", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(CareerRepository.prototype, "getAll").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/careers")
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });
  test("It should catch 500 on get a Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(CareerRepository.prototype, "find").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/careers/1")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch 500 on delete Career", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(CareerRepository.prototype, "delete").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .delete("/api/careers/1")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
});

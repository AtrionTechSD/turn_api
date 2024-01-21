import ImageRepository from "../../src/repositories/ImageRepository";
import TaskRepository from "../../src/repositories/TaskRepository";
import { IImage, ITask } from "../../src/utils/Interfaces";
import interceptor from "../interceptor";
describe("Testing tasks functions", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("It should create a new Task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const task: ITask = {
      title: "First task for testing",
      due_at: "2024-01-13",
    };
    const response = await interceptor
      .getServer()
      .post("/api/tasks/3")
      .send(task)
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.order_id).toEqual(3);
  });

  test("It should get tasks", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/tasks/3?limit=1")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.id).toBeGreaterThan(0);
    expect(response.body.content.order).not.toBeNull();
  });

  test("It should update task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const task: ITask = {
      title: "Edited task",
      due_at: "2024-01-13",
    };
    const response = await interceptor
      .getServer()
      .put("/api/tasks/1")
      .send(task)
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.title).toEqual(task.title);
  });
  test("It should change status of task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .patch("/api/tasks/1")
      .send({ status: 1 })
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.status).toEqual(1);
  });
  test("It should delete task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .delete("/api/tasks/1")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.deletedAt).not.toBeNull();
  });

  test("It should add images to Task", async () => {
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
      .patch("/api/tasks/2/images")
      .send({ images: images })
      .set("Authorization", token);
    expect(response.status).toEqual(201);
    expect(response.body.content.length).toEqual(4);
  });

  test("It should catch error 500 on add images to Task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const sizes = ["300", "400", "500", "600"];
    const images = sizes.map(
      (size): IImage => ({
        url: `https://placehold.co/${size}`,
        caption: `Image ${size}`,
      })
    );
    jest.spyOn(ImageRepository.prototype, "asignToTask").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .patch("/api/tasks/2/images")
      .send({ images: images })
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
  test("It should catch 500  on create a new Task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const task: ITask = {
      title: "First task for testing",
      due_at: "2024-01-13",
    };

    jest.spyOn(TaskRepository.prototype, "create").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .post("/api/tasks/3")
      .send(task)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch 500  on update Task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const task: ITask = {
      title: "First task for testing",
      due_at: "2024-01-13",
    };

    jest.spyOn(TaskRepository.prototype, "update").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .put("/api/tasks/1")
      .send(task)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch 500  on change status Task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(TaskRepository.prototype, "update").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .patch("/api/tasks/1")
      .send({ status: 1 })
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
  test("It should catch 500  delete Task", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(TaskRepository.prototype, "delete").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .delete("/api/tasks/1")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
  test("It should catch 500 on get tasks", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(TaskRepository.prototype, "getAll").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/tasks/3?limit=1")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
});

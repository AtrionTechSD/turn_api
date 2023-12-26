import InstituteRepository from "../../src/repositories/InstituteRepository";
import { IInstitute } from "../../src/utils/Interfaces";
import interceptor from "../interceptor";

describe("Testing institute controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("It should create a new Institute", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeInsti: IInstitute = {
      name: "Universidad Nacional Adventista",
      sigla: "UNAD",
    };
    const response = await interceptor
      .getServer()
      .post("/api/institutes")
      .send(fakeInsti)
      .set("Authorization", token);
    expect(response.status).toEqual(201);
  });

  test("It should catch error for existing institute", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeInsti: IInstitute = {
      name: "Universidad Abierta Para Adultos",
      sigla: "UAPA",
    };
    const response = await interceptor
      .getServer()
      .post("/api/institutes")
      .send(fakeInsti)
      .set("Authorization", token);
    expect(response.status).toEqual(422);
  });

  test("It should catch error 500 on create institute", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeInsti: IInstitute = {
      name: "Universidad de la Tercera Edad",
      sigla: "UTE",
    };
    jest.spyOn(InstituteRepository.prototype, "create").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .post("/api/institutes")
      .send(fakeInsti)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should get all institutes", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/institutes")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.rows.length).toBeGreaterThan(0);
  });
  test("It should catch error on get institutes", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(InstituteRepository.prototype, "getAll").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/institutes")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
  test("It should get one institute", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/institutes/1")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.sigla).toEqual("UAPA");
  });
  test("It should catch error on get one institute", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(InstituteRepository.prototype, "findById").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/institutes/2")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });
});

import { AuthRepository } from "../../src/repositories/AuthRepository";
import interceptor from "../interceptor";

describe("Testing login functions", () => {
  const auth = {
    email: "admin@atriontechsd.com",
    password: "admin1234",
  };
  const authenticated = {
    id: 4,
    email: "user49@example.com",
    session_id: null,
  };
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("It should login auth", async () => {
    const response = await interceptor
      .getServer()
      .post("/api/auth/login")
      .send(auth);
    expect(response.status).toEqual(200);
    expect(response.body.content).toHaveProperty("token");
    expect(response.headers["set-cookie"].length).toEqual(2);
  });

  test("It must dectect invalid email", async () => {
    const response = await interceptor
      .getServer()
      .post("/api/auth/login")
      .send({ ...auth, email: "wrong@email.com" });
    expect(response.status).toEqual(401);
    expect(response.body.content).toContain("Correo");
  });
  test("It must dectect invalid password", async () => {
    const response = await interceptor
      .getServer()
      .post("/api/auth/login")
      .send({ ...auth, password: "wrongpassword" });
    expect(response.status).toEqual(401);
    expect(response.body.content).toContain("Contraseña");
  });

  test("It must dectect unverified auth", async () => {
    const response = await interceptor
      .getServer()
      .post("/api/auth/login")
      .send({ email: "client1@example.com", password: "client11234" });
    expect(response.status).toEqual(401);
    expect(response.body.content).toContain("Cuenta no verificada");
  });

  test("It must catch unknown errors", async () => {
    jest
      .spyOn(AuthRepository.prototype, "find")
      .mockRejectedValue({ message: "Error from mock" });
    const response = await interceptor
      .getServer()
      .post("/api/auth/login")
      .send({ email: "client1@example.com", password: "client11234" });
    expect(response.status).toEqual(500);
  });

  test("It must logout auth", async () => {
    const token = `Bearer ${interceptor.getAuthenticated(
      false,
      authenticated
    )}`;
    const response = await interceptor
      .getServer()
      .post("/api/auth/logout")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
  });

  test("It should catch error on logout all", async () => {
    jest
      .spyOn(AuthRepository.prototype, "update")
      .mockRejectedValue({ message: "Error from mock" });

    const token = `Bearer ${interceptor.getAuthenticated(
      false,
      authenticated
    )}`;
    const response = await interceptor
      .getServer()
      .post("/api/auth/logout/all")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It must logout all auth", async () => {
    const token = `Bearer ${interceptor.getAuthenticated(
      false,
      authenticated
    )}`;
    const response = await interceptor
      .getServer()
      .post("/api/auth/logout/all")
      .set("Authorization", token);

    expect(response.status).toEqual(200);
  });
});

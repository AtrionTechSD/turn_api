import { AuthController } from "../../src/controllers/AuthController";
import { AuthRepository } from "../../src/repositories/AuthRepository";
import inteceptor from "../interceptor";
import Auth from "../../src/models/Auth";
import AuthMailService from "../../src/services/AuthMailService";
import config from "../../app.config";
import jwt from "jsonwebtoken";
import { Router } from "express";

describe("Testing register functions", () => {
  jest.mock("../../src/repositories/AuthRepository");
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("AuthController must initialize", () => {
    const authController = new AuthController();
    expect(authController.prefix).toEqual("auth");
    expect(typeof authController.router).toBe(typeof Router);
  });

  test("It should call auth/register", async () => {
    const auth = new Auth();
    jest.spyOn(AuthRepository.prototype, "create").mockResolvedValue(auth);
    jest.spyOn(AuthRepository.prototype, "assingRole").mockResolvedValue({});
    const mailMock = jest
      .spyOn(AuthMailService.prototype, "sendConfirmation")
      .mockResolvedValue({});
    const falseAuth = {
      email: "other@atriontechsd.com",
      password: "password123",
    };
    let response = await inteceptor
      .getServer()
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(201);

    mailMock.mockReset();
    mailMock.mockRejectedValue({});
    response = await inteceptor
      .getServer()
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(500);
  });

  test("It should catch vaidation errors", async () => {
    const falseAuth = {
      email: "21255454@example.com",
      password: null,
    };
    let response = await inteceptor
      .getServer()
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(422);
  });

  test("It should catch existing email", async () => {
    const falseAuth = {
      email: "admin@atriontechsd.com",
      password: "1232546584",
    };
    let response = await inteceptor
      .getServer()
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(422);
  });

  test("It should catch error 500 ", async () => {
    const auth = new Auth();
    jest.spyOn(AuthRepository.prototype, "create").mockRejectedValue(auth);
    jest.spyOn(AuthRepository.prototype, "assingRole").mockResolvedValue({});
    const falseAuth = {
      email: "21255454@example.com",
      password: "password123",
    };
    let response = await inteceptor
      .getServer()
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(500);
  });

  test("It should  confirm email", async () => {
    const auth = {
      email: "client1@example.com",
    };
    const token = jwt.sign(auth, config.auth.secret);
    jest
      .spyOn(AuthRepository.prototype, "update")
      .mockResolvedValue(new Auth());
    const response = await inteceptor
      .getServer()
      .get(`/api/auth/confirm/${token}`);
    expect(response.status).toEqual(200);
  });

  test("It should fail to confirm email", async () => {
    const auth = {
      email: "12545@example.com",
    };
    const token = jwt.sign(auth, config.auth.secret);
    jest
      .spyOn(AuthRepository.prototype, "update")
      .mockResolvedValue(new Auth());
    let response = await inteceptor
      .getServer()
      .get(`/api/auth/confirm/${token}`);
    expect(response.status).toEqual(422);
    response = await inteceptor.getServer().get(`/api/auth/confirm/nada`);
    expect(response.status).toEqual(422);
  });
});

import { NextFunction, Request, Response, Router } from "express";
import request from "supertest";
import { AuthController } from "../../src/controllers/AuthController";
import { AuthRepository } from "../../src/repositories/AuthRepository";
import app from "../../App";
import Auth from "../../src/models/Auth";
import AuthMailService from "../../src/services/AuthMailService";
import config from "../../app.config";
import jwt from "jsonwebtoken";
import interceptor from "../interceptor";

describe("Testing Auth Controller", () => {
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
      email: "21255454@example.com",
      password: "password123",
      role: "client",
    };
    let response = await request(app.app)
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(201);

    mailMock.mockReset();
    mailMock.mockRejectedValue({});
    response = await request(app.app)
      .post("/api/auth/register")
      .send(falseAuth);
    expect(response.status).toBe(500);
  });

  test("It should catch vaidation errors", async () => {
    const falseAuth = {
      email: "21255454@example.com",
      password: null,
      role: "client",
    };
    let response = await request(app.app)
      .post("/api/auth/register")
      .send(falseAuth);

    expect(response.status).toBe(422);
  });

  test("It should catch existing email", async () => {
    const falseAuth = {
      email: "admin@example.com",
      password: "1232546584",
      role: "client",
    };
    let response = await request(app.app)
      .post("/api/auth/register")
      .send(falseAuth);

    expect(response.status).toBe(422);
  });

  test("It should catch not existing role", async () => {
    const falseAuth = {
      email: "21255454@example.com",
      password: "password123",
      role: "cliente",
    };
    let response = await request(app.app)
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
      role: "client",
    };
    let response = await request(app.app)
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
    const response = await request(app.app).get(`/api/auth/confirm/${token}`);
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
    let response = await request(app.app).get(`/api/auth/confirm/${token}`);
    expect(response.status).toEqual(422);
    response = await request(app.app).get(`/api/auth/confirm/nada`);
    expect(response.status).toEqual(422);
  });
});

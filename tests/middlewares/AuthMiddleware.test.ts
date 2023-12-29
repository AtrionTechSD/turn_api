import jwt from "jsonwebtoken";
import config from "../../app.config";
import express from "express";
import AuthMiddleware from "../../src/middlewares/AuthMiddleware";
import interceptor from "../interceptor";
import { ContextRunner } from "express-validator";
import tools from "../../src/utils/tools";
import { AuthRepository } from "../../src/repositories/AuthRepository";

const setToken = (payload: object): string => {
  return jwt.sign(payload, config.auth.secret);
};
const res = interceptor.mockResponse();
const req = express.request;

describe("Testing Authmiddleware", () => {
  afterEach(() => {
    req.headers.authorization = undefined;
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("It should pass auth middleware", async () => {
    const auth = {
      id: 1,
      email: "admin@atriontechsd.com",
      session_id: null,
    };
    req.headers.authorization = "Bearer " + setToken(auth);
    const next = jest.fn();

    await AuthMiddleware.auth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("It should catch if token is missing", async () => {
    const next = jest.fn();
    req.cookies = {};
    await AuthMiddleware.auth(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("It should catch if session_id is wrong", async () => {
    const auth = {
      id: 1,
      email: "admin@atriontechsd.com",
      session_id: 1,
    };
    req.headers.authorization = "Bearer " + setToken(auth);
    const next = jest.fn();

    await AuthMiddleware.auth(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("It should catch if token is wrong", async () => {
    const next = jest.fn();

    req.headers.authorization = "Bearer ";
    await AuthMiddleware.auth(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("It should pass middleware isRole", async () => {
    const req = { auth: { role: { name: "admin" } } };
    const next = jest.fn();
    let middleware = AuthMiddleware.isRole("admin");
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("It should pass middleware isRole when any", async () => {
    const req = { auth: { role: { name: "admin" } } };
    const next = jest.fn();
    let middleware = AuthMiddleware.isRole("any");
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("It should return error 419", async () => {
    const req = { auth: { role: { name: "admin" } } };
    const next = jest.fn();
    const middleware = AuthMiddleware.isRole("client");
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("It should return error 500", async () => {
    const req = { auth: "wrong" };
    const next = jest.fn();
    const middleware = AuthMiddleware.isRole("client");
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      content: "Cannot read properties of undefined (reading 'name')",
    });
  });

  test("It should validate on existing email", async () => {
    const next = jest.fn();
    const req = {
      body: { email: "admin@atriontechsd.com" },
    };

    await AuthMiddleware.emailExists(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("It should validate not existing email", async () => {
    const next = jest.fn();
    const req = {
      body: { email: "wrongemail@example.com" },
    };

    await AuthMiddleware.emailExists(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 404,
      content: "Este correo no tiene ninguna cuenta asociada",
    });
  });

  test("It should catch error 500 on emailsExist middlw", async () => {
    const next = jest.fn();
    const req = {
      body: { email: "wrongemail@example.com" },
    };
    jest.spyOn(AuthRepository.prototype, "find").mockRejectedValue({});

    await AuthMiddleware.emailExists(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      content: undefined,
    });
  });

  it("It should refresh token", async () => {
    const auth = {
      id: 1,
      email: "admin@atriontechsd.com",
      session_id: null,
    };
    const token = tools.getToken(auth, -1);
    const refreshToken = tools.getToken(auth, 72000);
    const response = await interceptor
      .getServer()
      .post("/api/auth/refreshtoken")
      .set("Cookie", `accessToken=${token}; refreshToken=${refreshToken}`);
    expect(response.status).toEqual(200);
  });

  it("It should catch error 401 on refresh token", async () => {
    const auth = {
      id: 1,
      email: "admin@atriontechsd.com",
      session_id: null,
    };

    const response = await interceptor
      .getServer()
      .post("/api/auth/refreshtoken");
    expect(response.status).toEqual(401);
  });
});

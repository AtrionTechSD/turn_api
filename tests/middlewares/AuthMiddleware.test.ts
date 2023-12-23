import jwt from "jsonwebtoken";
import config from "../../app.config";
import express from "express";
import AuthMiddleware from "../../src/middlewares/AuthMiddleware";
import interceptor from "../interceptor";
import { ContextRunner } from "express-validator";

const setToken = (payload: object): string => {
  return jwt.sign(payload, config.auth.secret);
};
const res = interceptor.mockResponse();
const req = express.request;

describe("Testing Authmiddleware", () => {
  afterEach(() => {
    req.headers.authorization = undefined;
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

  it("Should pass validateAuthRegister", () => {
    const next = jest.fn();

    const auth = {
      email: "admin@atriontechsd.com",
      password: "Admin1234",
      role_id: "admin",
    };
    req.body = auth;
  });
});

import { request, response } from "express";
import InstituteMiddleware from "../../src/middlewares/InstituteMiddleware";
import InstituteRepository from "../../src/repositories/InstituteRepository";
import interceptor from "../interceptor";

describe("Testing institute middleware", () => {
  const res = interceptor.mockResponse();
  const req = request;
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("It should pass when institute is unique", async () => {
    req.body = {
      name: "Foo",
    };
    const next = jest.fn();
    jest.spyOn(InstituteRepository.prototype, "find").mockResolvedValue(null);
    await InstituteMiddleware.isUnique(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("It should catch when institute is not unique", async () => {
    req.body = {
      name: "Universidad Abierta Para Adultos",
    };
    jest
      .spyOn(InstituteRepository.prototype, "find")
      .mockResolvedValue({ name: "FOo" });

    const next = jest.fn();
    await InstituteMiddleware.isUnique(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test("It should catch error 500 on isUnique middw", async () => {
    req.body = {
      name: "Foo",
    };
    const next = jest.fn();
    jest.spyOn(InstituteRepository.prototype, "find").mockRejectedValue({
      code: 500,
      message: "Error from mock test",
    });
    await InstituteMiddleware.isUnique(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});

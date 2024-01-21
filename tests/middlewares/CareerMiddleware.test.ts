import { request, response } from "express";
import CareerMiddleware from "../../src/middlewares/CareerMiddleware";
import CareerRepository from "../../src/repositories/CareerRepository";
import interceptor from "../interceptor";

describe("Testing career middleware", () => {
  const res = interceptor.mockResponse();
  const req = request;
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("It should pass when career is unique", async () => {
    req.body = {
      name: "Foo",
    };
    const next = jest.fn();
    jest.spyOn(CareerRepository.prototype, "find").mockResolvedValue(null);
    await CareerMiddleware.isUnique(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("It should catch when career is not unique", async () => {
    req.body = {
      name: "Ingeniería de Software",
    };
    jest
      .spyOn(CareerRepository.prototype, "find")
      .mockResolvedValue({ name: "Ingeniería de Software" });

    const next = jest.fn();
    await CareerMiddleware.isUnique(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test("It should catch error 500 on isUnique middw", async () => {
    req.body = {
      name: "Foo",
    };
    const next = jest.fn();
    jest.spyOn(CareerRepository.prototype, "find").mockRejectedValue({
      code: 500,
      message: "Error from mock test",
    });
    await CareerMiddleware.isUnique(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});

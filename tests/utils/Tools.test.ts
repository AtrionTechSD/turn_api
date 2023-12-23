import Tool from "../../src/utils/tools";
import interceptor from "../interceptor";

describe("Test utils Tool", () => {
  test("parseOrZero must return number", () => {
    expect(typeof Tool.parseOrZero(2)).toEqual("number");
    expect(typeof Tool.parseOrZero("15")).toEqual("number");
    expect(Tool.parseOrZero("maría")).toEqual(0);
  });

  test("It should set cookie on request", () => {
    const res = interceptor.mockResponse();
    Tool.setCookie(res, "test", "Tested");
    expect(res.cookie).toHaveBeenCalled();
  });
});

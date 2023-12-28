import request from "supertest";
import app from "../App";
import jwt from "jsonwebtoken";
import config from "../app.config";
import tools from "../src/utils/tools";

class Interceptor {
  mockRequest() {
    const req: any = {};
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    return req;
  }

  mockResponse() {
    const res: any = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
  }
  mockNext() {
    return () => jest.fn();
  }

  getServer() {
    const resq = request(app.app);
    return resq;
  }

  getAuthenticated(status: Boolean = true, auth?: any): String {
    if (!auth) {
      auth = {
        id: 1,
        email: "admin@atriontechsd.com",
        session_id: status ? null : 1,
      };
    }

    return tools.getToken(auth, 360);
  }
}

export default new Interceptor();

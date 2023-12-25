import { Response } from "express";
import config from "../../app.config";
import jwt from "jsonwebtoken";

class Tool {
  parseOrZero(value: string | number): number {
    if (typeof value == "number") {
      return value;
    }

    const converted = parseInt(value);
    if (isNaN(converted)) {
      return 0;
    }

    return converted;
  }

  setCookie(res: Response, name: string, value: string) {
    res.cookie(name, value, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.app.env.includes("prod"),
    });
  }

  getToken(payload: object, expiresIn: number): String {
    return jwt.sign(payload, config.auth.secret, {
      expiresIn,
    });
  }
}

export default new Tool();

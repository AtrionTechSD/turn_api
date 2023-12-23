import { Response } from "express";
import config from "../../app.config";

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
}

export default new Tool();

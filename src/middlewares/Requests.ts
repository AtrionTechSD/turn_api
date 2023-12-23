import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";
import response from "../utils/response";
export default class Requests {
  static validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages: any = {};
      Object.values(errors.mapped()).forEach((err: any) => {
        messages[err.path] = err.msg;
      });
      response.error(res, 422, messages);
      return messages;
    }
    next();
  }

  static validateAuthRegister(): Array<ValidationChain> {
    return [
      body("email", "Se requiere un correo electrónico").not().isEmpty(),
      body("email", "El formato del correo no es válido").isEmail(),
      body("password", "Se requiere una contraseña").exists(),
      body("password", "La contraseña debe estar entre 6 y 25").isLength({
        min: 6,
        max: 25,
      }),
      body("role", "Debe indicar un role").exists(),
      body("role", "El role indicado no existe").isIn(["admin", "client"]),
    ];
  }

  static validateAuthLogin(): Array<ValidationChain> {
    return [
      body("email", "Se requiere un correo electrónico").not().isEmpty(),
      body("password", "Se requiere una contraseña").exists(),
    ];
  }
}

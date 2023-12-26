import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";
import response from "../utils/response";
class Requests {
  public validate(req: Request, res: Response, next: NextFunction) {
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
  public validateAuthRegister(): Array<ValidationChain> {
    return [
      body("email", "Se requiere un correo electrónico").not().isEmpty(),
      body("email", "El formato del correo no es válido").isEmail(),
      body("password", "Se requiere una contraseña").exists(),
      body("password", "La contraseña debe estar entre 6 y 25").isLength({
        min: 6,
        max: 25,
      }),
    ];
  }

  public validateAuthLogin(): Array<ValidationChain> {
    return [
      body("email", "Se requiere un correo electrónico").not().isEmpty(),
      body("password", "Se requiere una contraseña").exists(),
    ];
  }

  public validateUserCreate(): Array<ValidationChain> {
    return [
      body("name", "El campo nombre es requerido").notEmpty(),
      body("lastname", "El campo apellido es requerido").notEmpty(),
      body("address", "El campo dirección es requerido").notEmpty(),
      body("phone", "El campo teléfono es requerido").notEmpty(),
    ];
  }

  public validateInstituteCreate(): Array<ValidationChain> {
    return [
      body("name", "El campo nombre es requerido"),
      body("sigla", "El campo sigla es requerido"),
    ];
  }
}

export default new Requests();

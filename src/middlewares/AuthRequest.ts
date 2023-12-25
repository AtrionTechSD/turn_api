import { ValidationChain, body } from "express-validator";
import Requests from "./Requests";
class AuthRequests extends Requests {
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
}

export default new AuthRequests();

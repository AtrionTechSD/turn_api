import { ValidationChain, body } from "express-validator";
import Requests from "./Requests";

class UserRequest extends Requests {
  public validateUserCreate(): Array<ValidationChain> {
    return [
      body("name", "El campo nombre es requerido").notEmpty(),
      body("lastname", "El campo apellido es requerido").notEmpty(),
      body("address", "El campo dirección es requerido").notEmpty(),
      body("phone", "El campo teléfono es requerido").notEmpty(),
    ];
  }
}

export default new UserRequest();

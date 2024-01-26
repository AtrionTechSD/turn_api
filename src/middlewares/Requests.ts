import { NextFunction, Request, Response } from "express";
import {
  ValidationChain,
  body,
  param,
  validationResult,
} from "express-validator";
import response from "../utils/response";
import { CGrade, OStatus, OType } from "../utils/Interfaces";
import moment from "moment";
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
      body("email", "El formato del correo no es válido").isEmail(),
      body("password", "Se requiere una contraseña").exists(),
    ];
  }

  public validatePasswordReset(): Array<ValidationChain> {
    return [
      body("password", "Se requiere la nueva contraseña").notEmpty(),
      body("password", "La contraseña debe estar entre 6 y 25").isLength({
        min: 6,
        max: 25,
      }),
      body("password_confirmation", "Se requiere la confirmación").notEmpty(),
      body("password_confirmation", "Las contraseñas no coinciden").custom(
        (value, { req }) => {
          return value === req.body.password;
        }
      ),
    ];
  }

  public validateRecoverEmail(): Array<ValidationChain> {
    return [
      body("email", "Se requiere el correo electrónico").notEmpty(),
      body("email", "El formato del correo no es válido").isEmail(),
    ];
  }
  public validateRecoverPassword(): Array<ValidationChain> {
    return [
      ...this.validatePasswordReset(),
      body("token", "Se requiere el token de validación").notEmpty(),
    ];
  }

  public validateUserCreate(): Array<ValidationChain> {
    return [
      body("name", "El campo nombre es requerido").notEmpty(),
      body("lastname", "El campo apellido es requerido").notEmpty(),
      body("email", "El campo correo es requerido").notEmpty(),
      body("email", "El formatode correo no es válido").isEmail(),
      body("address", "El campo dirección es requerido").notEmpty(),
      body("address", "La dirección es muy extensa").isLength({
        max: 155,
      }),
      body("phone", "El campo teléfono es requerido").notEmpty(),
    ];
  }

  public validateProfileCreate(): Array<ValidationChain> {
    return [
      ...this.validateUserCreate(),
      body("institute_id", "El campo institución es requerido").notEmpty(),
      body("career_id", "El campo carrera es requerido").notEmpty(),
      body("institute_id", "El id de la institución no es válido").isInt(),
      body("career_id", "El id de la carrera no es válido").isInt(),
    ];
  }

  public validateInstituteCreate(): Array<ValidationChain> {
    return [
      body("name", "El campo nombre es requerido").notEmpty(),
      body("sigla", "El campo sigla es requerido").notEmpty(),
    ];
  }

  public validateParamId(): Array<ValidationChain> {
    return [param("id", "El parámetro id debe ser un entero").isInt()];
  }

  public validateImageCreation(): Array<ValidationChain> {
    return [
      body("url", "Se requiere la ruta de la imagen").notEmpty(),
      body("url", "La ruta de imagen no es válida").isURL(),
      body("caption", "Se requiere el texto de la imagen").notEmpty(),
    ];
  }

  public validateImageArrayCreation(): Array<ValidationChain> {
    return [
      body("images.*.url", "Se requiere la ruta de cada imagen").notEmpty(),
      body("images.*.url", "Algunas urls no son válidas").isURL(),
      body(
        "images.*.caption",
        "Se requiere el texto de cada imagen"
      ).notEmpty(),
    ];
  }

  public validateCareerCreation(): Array<ValidationChain> {
    return [
      body("name", "El campo nombre es requerido").notEmpty(),
      body("sigla", "El campo sigla es requerido").notEmpty(),
      body("grade", "El campo grado es requerido").notEmpty(),
      body("grade", "Este grado no es válido").isIn(Object.values(CGrade)),
    ];
  }

  public validateOrderCreation(): Array<ValidationChain> {
    return [
      body("title", "El campo título es requerido").notEmpty(),
      body("description", "El campo descripción es requerido").notEmpty(),
      body("due_at", "La fecha de entrega es requerida").notEmpty(),
      body(
        "due_at",
        "La fecha de entrega debe ser posterior a la actual"
      ).custom((value) => {
        return moment(value).isAfter(moment.now());
      }),
      body("status", "El campo estado es requerido").notEmpty(),
      body("status", "El estado no es válido").isIn(Object.values(OStatus)),
      body("type", "El campo tipo es requerido").notEmpty(),
      body("type", "El tipo de orden no es válido").isIn(Object.values(OType)),
      body("client_id", "El cliente es requerido").notEmpty(),
      body("client_id", "El id de cliente no es válido").isInt(),
      body("tasks", "El formato de las tareas es inválido").isArray({
        min: 1,
        max: 10,
      }),
    ];
  }

  public validateOrderStatus(): Array<ValidationChain> {
    return [
      body("status", "Debe indicar un estado del pedido").notEmpty(),
      body("status", "El estado indicado no es válido").isIn(
        Object.values(OStatus)
      ),
    ];
  }

  public validateTaskCreation(): Array<ValidationChain> {
    return [
      body("tasks.*.title", "Cada tarea debe tener un título").notEmpty(),
      body(
        "tasks.*.due_at",
        "Cada tarea debe tener una fecha de entrega"
      ).notEmpty(),
      body(
        "tasks.*.due_at",
        "La entrega de cada tarea debe ser posterior a la actual"
      ).custom((value) => {
        return moment(value).isAfter(moment.now());
      }),
    ];
  }

  public validateTaskOrderId(): Array<ValidationChain> {
    return [
      param("orderId", "El parámetro del pedido debe ser un entero").isInt(),
    ];
  }

  public validateTaskStatus(): Array<ValidationChain> {
    return [
      body("status", "El estado de la tarea debe ser 0 ó 1").isIn([0, 1]),
    ];
  }
}

export default new Requests();

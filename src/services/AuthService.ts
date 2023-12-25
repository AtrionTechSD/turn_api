import Auth from "../models/Auth";
import { AuthRepository } from "../repositories/AuthRepository";
import RoleRepository from "../repositories/RoleRepository";
import { IParams } from "../utils/Interfaces";
import bcrypt from "bcrypt";
import AuthMailService from "./AuthMailService";
import config from "../../app.config";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import tools from "../utils/tools";
import { Connection } from "../db/Connection";

interface IAuth {
  email: string;
  password: string;
  role?: string;
}

export class AuthService {
  authRepo: AuthRepository = new AuthRepository();
  roleRepo: RoleRepository = new RoleRepository();
  authMailService: AuthMailService = new AuthMailService();
  async createAuth(auth: IAuth) {
    const trans: any = await Connection.getConnectionInstance().getTrans();
    try {
      if (auth.email.includes("@atriontechsd.com")) {
        auth.role = "admin";
      } else {
        auth.role = "client";
      }
      const role: any = await this.roleRepo.find("name", auth.role);
      const emailExists: any = await this.authRepo.find("email", auth.email);
      if (emailExists) {
        throw {
          code: 422,
          message: "El correo ingresado ya está registrado",
        };
      }
      const hashedPWD = await bcrypt.hash(auth.password, 10);
      const newAuth: Auth = await this.authRepo.create(
        {
          email: auth.email,
          password: hashedPWD,
        },
        trans
      );
      await this.authRepo.assingRole(role.id, newAuth, trans);
      await this.sendConfirmation(auth);
      await trans.commit();
      return newAuth;
    } catch (error: any) {
      await trans.rollback();
      if (error.code) {
        throw error;
      }

      throw { code: 500, message: error.message };
    }
  }

  async sendConfirmation(auth: any) {
    try {
      const basePath = config.app.url;
      auth.confirmURL = `${basePath}/api/auth/confirm/testoken`;
      auth.logo = basePath + "/logo.png";
      auth.image = basePath + "/signup.svg";
      auth.token = jwt.sign(auth, config.auth.secret, { expiresIn: 600 }); // Token de confirmación expira en 10 minutos
      await this.authMailService.sendConfirmation(auth);
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      };
    }
  }

  async confirmAuth(token: any): Promise<string> {
    return new Promise((res: any, rej: any) => {
      jwt.verify(token, config.auth.secret, async (err: any, decoded: any) => {
        const trans = await Connection.getConnectionInstance().getTrans();
        try {
          const auth: any = await this.authRepo.find("email", decoded.email);
          this.authRepo.update(
            {
              verifedAt: new Date(),
              session_id: uuidv4(),
            },
            auth.id,
            trans
          );
          await trans.commit();
          res(true);
          return;
        } catch (error: any) {
          await trans.rollback();
          rej(false);
          return;
        }
      });
    });
  }

  async login(auth: any, res: Response) {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      let userAuth = await this.authRepo.find("email", auth.email, false, {
        include: "role",
      });

      if (
        userAuth &&
        (await this.validateAuthAccount(userAuth, auth.password))
      ) {
        const updateData = { lastlogin: new Date(), status: 1 };
        await this.authRepo.update(updateData, userAuth.id, trans);
        const { token, refreshToken } = this.generateTokens(userAuth);
        tools.setCookie(res, "refreshToken", refreshToken);
        tools.setCookie(res, "accessToken", `Bearer ${token}`);
        await trans.commit();
        return { userAuth, token };
      }
      throw {
        code: 401,
        message: "Contraseña o Correo incorrecto",
      };
    } catch (error: any) {
      await trans.rollback();
      if (error.code) {
        throw error;
      }
      throw { code: 500, message: error.message };
    }
  }

  private generateTokens(userAuth: any) {
    const token = jwt.sign(userAuth.dataValues, config.auth.secret, {
      expiresIn: config.auth.expiresIn,
    });
    const refreshToken = jwt.sign(
      { email: userAuth.email },
      config.auth.secret,
      { expiresIn: "7d" }
    );
    return { token, refreshToken };
  }

  private async validateAuthAccount(auth: any, pwd: string): Promise<Boolean> {
    const isValidPassword = await bcrypt.compare(
      pwd,
      auth._previousDataValues.password
    );
    const isAccountVerified = auth.verified_at != null;
    if (!isAccountVerified)
      throw { code: 401, message: "Cuenta no verificada" };
    return isValidPassword;
  }

  public async logout(res: Response) {
    tools.setCookie(res, "accessToken", "null");
  }

  public async logoutAll(req: any, res: Response) {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      await this.authRepo.update(
        {
          session_id: uuidv4(),
        },
        req.auth.id,
        trans
      );
      tools.setCookie(res, "accessToken", "null");
      await trans.commit();
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
}

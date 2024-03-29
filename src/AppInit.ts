import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import IController from "./controllers/IController";
import config from "../app.config";

export class App {
  public app: express.Application;
  public port: number;
  constructor(controllers: Array<any>, port: number) {
    this.app = express();
    this.port = port;
    this.initApp();
    this.initControllers(controllers);
  }

  private initApp() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use("/api/public", express.static("public"));
    this.app.use("/api/views", express.static("views"));
    this.app.use(
      cors({
        origin: config.app.allowedUrl,
      })
    );
  }

  private initControllers(controllers: Array<IController>) {
    controllers.forEach((controller: IController) => {
      this.app.use(`/api/${controller.prefix}`, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Corriendo App en ${this.port}`);
    });
  }
}

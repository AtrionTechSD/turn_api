import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import IController from "./controllers/IController";

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
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.use(express.static(path.join(__dirname, "../views")));

    this.app.use(
      cors({
        origin: "*",
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
      console.log("Running on port " + this.port);
    });
  }
}

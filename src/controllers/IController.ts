import { Router } from "express";
export default interface IController {
  router: Router;
  prefix: string;
  initRoutes(): void;
}

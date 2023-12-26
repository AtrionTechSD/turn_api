import { Router } from "express";

export default abstract class AbstractRoutes {
  abstract router: Router;
  abstract controller: any;
  abstract initRoutes(): void;
}

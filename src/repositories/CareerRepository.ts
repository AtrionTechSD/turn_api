import Career from "../models/Career";
import { BaseRepository } from "./BaseRepository";

export default class CareerRepository extends BaseRepository<Career> {
  constructor() {
    super(Career);
  }
}

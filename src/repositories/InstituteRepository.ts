import Auth from "../models/Auth";
import Institute from "../models/Institute";
import { BaseRepository } from "./BaseRepository";

export default class InstituteRepository extends BaseRepository<Institute> {
  constructor() {
    super(Institute);
  }
}

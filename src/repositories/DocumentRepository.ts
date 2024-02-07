import Document from "../models/Document";
import { BaseRepository } from "./BaseRepository";

export default class DocumentRepository extends BaseRepository<Document> {
  constructor() {
    super(Document);
  }
}

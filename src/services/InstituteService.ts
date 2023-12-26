import { Connection } from "../db/Connection";
import InstituteRepository from "../repositories/InstituteRepository";
import { IInstitute, IParams } from "../utils/Interfaces";

export default class InstituteService {
  private instituteRepo: InstituteRepository = new InstituteRepository();

  public async createInstitute(institute: IInstitute): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const newInsti = await this.instituteRepo.create(institute, trans);
      await trans.commit();
      return newInsti;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: 500,
        message: error.message,
      };
    }
  }

  public async getInstitutes(params: IParams): Promise<any> {
    try {
      const institutes = await this.instituteRepo.getAll(params);
      return institutes;
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
  public async findInstitute(
    intituteId: number,
    params: IParams
  ): Promise<any> {
    try {
      const institute = await this.instituteRepo.findById(intituteId, params);
      return institute;
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
}

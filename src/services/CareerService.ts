import { Connection } from "../db/Connection";
import CareerRepository from "../repositories/CareerRepository";
import { ICareer, IParams } from "../utils/Interfaces";

export default class CareerService {
  private careerRepo: CareerRepository = new CareerRepository();

  async createCareer(career: ICareer): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const newCareer = await this.careerRepo.create(career, trans);
      await trans.commit();
      return newCareer;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async updateCareer(careerId: number, career: ICareer): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const updatedCareer = await this.careerRepo.update(
        career,
        careerId,
        trans
      );
      await trans.commit();
      return updatedCareer;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async getCareers(params: IParams): Promise<any> {
    try {
      const careers = await this.careerRepo.getAll(params);
      return careers;
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async findCareer(careerId: number, params: IParams): Promise<any> {
    try {
      const career = await this.careerRepo.findById(careerId, params);
      return career;
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async deteleCareer(careerId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const career = await this.careerRepo.delete(careerId, trans);
      await trans.commit();
      return career;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }
}

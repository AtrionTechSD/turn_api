export interface IParams {
  limit?: number;
  search?: string;
  order?: string;
  desc?: boolean;
  filter?: string[];
  include?: string;
  page?: number;
  perpage?: number;
  fields?: string;
  withtrashed?: boolean;
}

export interface IUser {
  id?: number;
  name: string;
  lastname: string;
  phone: string;
  address: string;
  institute_id?: number;
  auth_id?: number;
  career_id?: number;
}
export interface IInstitute {
  name: string;
  sigla: string;
}

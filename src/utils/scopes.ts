import { Model, ModelStatic, Op } from "sequelize";
import { IParams } from "./Interfaces";
import Parse from "./tools";

export class Scope {
  static paginate(perPage: number, page: number): object {
    const startIndex: number = (page - 1) * perPage;
    const pagination: object = { offset: startIndex, limit: perPage };
    return pagination;
  }

  static limit(limit: number): object {
    return { limit: Parse.parseOrZero(limit) };
  }

  static search(search: string, cols: Array<string>): object {
    if (cols.length > 0) {
      return {
        [Op.or]: cols.map((col) => {
          return {
            [col]: {
              [Op.like]: `%${search}%`,
            },
          };
        }),
      };
    }
    return {};
  }

  static fields(fields: string, cols: Array<string>): Object {
    let selections = fields.split(",");
    selections = selections.filter((sel) => cols.includes(sel) || sel == "id");
    if (selections.length > 0) {
      return { attributes: selections };
    } else {
      return {};
    }
  }

  static filter(filter: Array<string>, cols: Array<string>): object {
    let filtered = {};
    const conditions: any = {};
    filter.forEach((f) => {
      const parts: Array<string> = f.split(":");
      if (parts.length === 2 && (cols.includes(parts[0]) || parts[0] == "id")) {
        conditions[parts[0]] = parts[1];
      } else {
        return;
      }
    });

    if (Object.keys(conditions).length > 0) {
      filtered = conditions;
    } else {
      return {};
    }

    return filtered;
  }

  static include<T extends typeof Model<any, any>>(
    includes: string,
    model: T
  ): object {
    let included = {};
    const associations = new (model as any)().getRelations();
    let inclusions: Array<any> = includes.split(",");
    inclusions = inclusions.filter((i) =>
      associations.find((ass: string) => ass == i)
    );

    inclusions.forEach((incl, key) => {
      if (incl.includes(".")) {
        inclusions[key] = {
          association: incl.split(".")[0],
          include: { association: incl.split(".")[1] },
        };
      }
    });
    included = {
      include: inclusions,
    };
    return included;
  }

  static order(cols: string[], field: string, desc?: Boolean): object {
    if (cols.includes(field)) {
      if (desc) {
        return { order: [[field, "DESC"]] };
      }
      return { order: [field] };
    }
    return {};
  }

  static withTrashed(paranoid: boolean): object {
    return {
      paranoid: !paranoid,
    };
  }

  static getQuery<T extends typeof Model<any, any>>(
    params: IParams,
    cols: Array<string>,
    model: T
  ): Object {
    const query: any = {
      ...(params.page && params.perpage
        ? this.paginate(params.perpage, params.page)
        : {}),

      ...(params.include ? this.include(params.include, model) : {}),
      ...(params.limit ? this.limit(params.limit) : {}),
      ...(params.fields ? this.fields(params.fields, cols) : {}),
      ...(params.order ? this.order(cols, params.order, params.desc) : {}),
      ...(params.withtrashed ? this.withTrashed(params.withtrashed) : {}),
    };

    query.where = {
      ...(params.search ? this.search(params.search, cols) : {}),
      ...(params.filter ? this.filter(params.filter, cols) : {}),
    };
    return query;
  }

  static async get<T extends Model>(
    model: ModelStatic<T>,
    params: IParams
  ): Promise<any> {
    const cols = new (model as any)().getSearchables();
    const args = Scope.getQuery(params, cols, model);
    let result = null;
    if (params.limit && params.limit == 1) {
      result = await model.findOne(args);
    } else {
      result = await model.findAndCountAll(args);
    }
    return result;
  }
}

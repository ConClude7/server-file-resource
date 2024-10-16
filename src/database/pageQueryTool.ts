import mongoose, { Error, FilterQuery, Model } from "mongoose";
import { PageQuery } from "../utils/reqUtil";
import consoleLog from "../utils/console-log";

/// 分页查询工具
export const findPageData = async <T0>(
  pageQuery: PageQuery,
  dbModel: Model<any>,
  config?: {
    sort?: any;
    filter?: FilterQuery<T0>;
    populate?: string | string[];
  }
): Promise<T0[]> => {
  consoleLog("分页查询工具", pageQuery);
  pageQuery.total = await dbModel.countDocuments(config?.filter ?? {});
  const dataList = await dbModel
    .find(config?.filter ?? {})
    .sort(config?.sort ?? {})
    .limit(pageQuery.pageSize + 1)
    .skip(pageQuery.skipCount)
    .populate(config?.populate ?? "");

  return dataList;
};

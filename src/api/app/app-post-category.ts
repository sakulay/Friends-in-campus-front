import request from "@/utils/request";

const APPPOSTCATEGORY_BASE_URL = "/api/v1/appPostCategorys";

const AppPostCategoryAPI = {
  /** 获取帖子分类分页数据 */
  getPage(queryParams?: AppPostCategoryPageQuery) {
    return request<any, PageResult<AppPostCategoryPageVO[]>>({
      url: `${APPPOSTCATEGORY_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取帖子分类表单数据
   *
   * @param id 帖子分类ID
   * @returns 帖子分类表单数据
   */
  getFormData(id: number) {
    return request<any, AppPostCategoryForm>({
      url: `${APPPOSTCATEGORY_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加帖子分类*/
  add(data: AppPostCategoryForm) {
    return request({
      url: `${APPPOSTCATEGORY_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新帖子分类
   *
   * @param id 帖子分类ID
   * @param data 帖子分类表单数据
   */
  update(id: number, data: AppPostCategoryForm) {
    return request({
      url: `${APPPOSTCATEGORY_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除帖子分类，多个以英文逗号(,)分割
   *
   * @param ids 帖子分类ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPPOSTCATEGORY_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppPostCategoryAPI;

/** 帖子分类分页查询参数 */
export interface AppPostCategoryPageQuery extends PageQuery {}

/** 帖子分类表单对象 */
export interface AppPostCategoryForm {
  /** 主键，自增 */
  id?: number;
  /** 分类名称 */
  name?: string;
  /** 分类描述 */
  description?: string;
  /** 排序字段，值越小越靠前 */
  sort?: number;
}

/** 帖子分类分页对象 */
export interface AppPostCategoryPageVO {
  /** 主键，自增 */
  id?: number;
  /** 分类名称 */
  name?: string;
  /** 分类描述 */
  description?: string;
  /** 排序字段，值越小越靠前 */
  sort?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 是否删除(1-删除，0-未删除) */
  isDeleted?: number;
}

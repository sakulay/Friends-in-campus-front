import request from "@/utils/request";

const APPNEWS_BASE_URL = "/api/v1/appNewss";

const AppNewsAPI = {
  /** 获取校园新闻资讯分页数据 */
  getPage(queryParams?: AppNewsPageQuery) {
    return request<any, PageResult<AppNewsPageVO[]>>({
      url: `${APPNEWS_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取校园新闻资讯表单数据
   *
   * @param id 校园新闻资讯ID
   * @returns 校园新闻资讯表单数据
   */
  getFormData(id: number) {
    return request<any, AppNewsForm>({
      url: `${APPNEWS_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加校园新闻资讯*/
  add(data: AppNewsForm) {
    return request({
      url: `${APPNEWS_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新校园新闻资讯
   *
   * @param id 校园新闻资讯ID
   * @param data 校园新闻资讯表单数据
   */
  update(id: number, data: AppNewsForm) {
    return request({
      url: `${APPNEWS_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除校园新闻资讯，多个以英文逗号(,)分割
   *
   * @param ids 校园新闻资讯ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPNEWS_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppNewsAPI;

/** 校园新闻资讯分页查询参数 */
export interface AppNewsPageQuery extends PageQuery {}

/** 校园新闻资讯表单对象 */
export interface AppNewsForm {
  id?: number;
  title?: string;
  date?: string;
  content?: string;
}

/** 校园新闻资讯分页对象 */
export interface AppNewsPageVO {
  id?: number;
  title?: string;
  date?: string;
  content?: string;
  createTime?: Date;
  updateTime?: Date;
  isDeleted?: number;
}

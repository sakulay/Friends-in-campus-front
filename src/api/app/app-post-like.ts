import request from "@/utils/request";

const APPPOSTLIKE_BASE_URL = "/api/v1/appPostLikes";

const AppPostLikeAPI = {
  /** 获取用户点赞记录分页数据 */
  getPage(queryParams?: AppPostLikePageQuery) {
    return request<any, PageResult<AppPostLikePageVO[]>>({
      url: `${APPPOSTLIKE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取用户点赞记录表单数据
   *
   * @param id 用户点赞记录ID
   * @returns 用户点赞记录表单数据
   */
  getFormData(id: number) {
    return request<any, AppPostLikeForm>({
      url: `${APPPOSTLIKE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加用户点赞记录*/
  add(data: AppPostLikeForm) {
    return request({
      url: `${APPPOSTLIKE_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新用户点赞记录
   *
   * @param id 用户点赞记录ID
   * @param data 用户点赞记录表单数据
   */
  update(id: number, data: AppPostLikeForm) {
    return request({
      url: `${APPPOSTLIKE_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除用户点赞记录，多个以英文逗号(,)分割
   *
   * @param ids 用户点赞记录ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPPOSTLIKE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppPostLikeAPI;

/** 用户点赞记录分页查询参数 */
export interface AppPostLikePageQuery extends PageQuery {}

/** 用户点赞记录表单对象 */
export interface AppPostLikeForm {
  /** 主键，自增 */
  id?: number;
  /** 点赞用户ID，关联到 app_user 表 */
  userId?: number;
  /** 图文内容ID，关联到 app_post 表 */
  postId?: number;
}

/** 用户点赞记录分页对象 */
export interface AppPostLikePageVO {
  /** 主键，自增 */
  id?: number;
  /** 点赞用户ID，关联到 app_user 表 */
  userId?: number;
  /** 图文内容ID，关联到 app_post 表 */
  postId?: number;
  /** 点赞时间 */
  createTime?: Date;
  /** 是否删除(1-删除，0-未删除) */
  isDeleted?: number;
}

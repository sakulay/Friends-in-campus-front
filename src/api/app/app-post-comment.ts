import request from "@/utils/request";

const APPPOSTCOMMENT_BASE_URL = "/api/v1/appPostComments";

const AppPostCommentAPI = {
  /** 获取图文评论分页数据 */
  getPage(queryParams?: AppPostCommentPageQuery) {
    return request<any, PageResult<AppPostCommentPageVO[]>>({
      url: `${APPPOSTCOMMENT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取图文评论表单数据
   *
   * @param id 图文评论ID
   * @returns 图文评论表单数据
   */
  getFormData(id: number) {
    return request<any, AppPostCommentForm>({
      url: `${APPPOSTCOMMENT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加图文评论*/
  add(data: AppPostCommentForm) {
    return request({
      url: `${APPPOSTCOMMENT_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新图文评论
   *
   * @param id 图文评论ID
   * @param data 图文评论表单数据
   */
  update(id: number, data: AppPostCommentForm) {
    return request({
      url: `${APPPOSTCOMMENT_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除图文评论，多个以英文逗号(,)分割
   *
   * @param ids 图文评论ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPPOSTCOMMENT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppPostCommentAPI;

/** 图文评论分页查询参数 */
export interface AppPostCommentPageQuery extends PageQuery {}

/** 图文评论表单对象 */
export interface AppPostCommentForm {
  /** 主键，自增 */
  id?: number;
  /** 评论用户ID，关联到 app_user 表 */
  userId?: number;
  /** 图文内容ID，关联到 app_post 表 */
  postId?: number;
  /** 评论内容 */
  content?: string;
  /** 回复的评论ID，NULL表示主评论 */
  parentId?: number;
  /** 是否为回复评论(0为评论，1为回复) */
  isReply?: number;
  /** 审核状态（0 - 待审核，1 - 已通过， 2 - 禁用） */
  status?: number;
}

/** 图文评论分页对象 */
export interface AppPostCommentPageVO {
  /** 主键，自增 */
  id?: number;
  /** 评论用户ID，关联到 app_user 表 */
  userId?: number;
  /** 图文内容ID，关联到 app_post 表 */
  postId?: number;
  /** 评论内容 */
  content?: string;
  /** 回复的评论ID，NULL表示主评论 */
  parentId?: number;
  /** 评论时间 */
  createTime?: Date;
  /** 是否删除(1-删除，0-未删除) */
  isDeleted?: number;
  /** 是否为回复评论(0为评论，1为回复) */
  isReply?: number;
  /** 审核状态（0 - 待审核，1 - 已通过， 2 - 禁用） */
  status?: number;
}

import request from "@/utils/request";

const APPFRIEND_BASE_URL = "/api/v1/appFriends";

const AppFriendAPI = {
  /** 获取用户好友关系分页数据 */
  getPage(queryParams?: AppFriendPageQuery) {
    return request<any, PageResult<AppFriendPageVO[]>>({
      url: `${APPFRIEND_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取用户好友关系表单数据
   *
   * @param id 用户好友关系ID
   * @returns 用户好友关系表单数据
   */
  getFormData(id: number) {
    return request<any, AppFriendForm>({
      url: `${APPFRIEND_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加用户好友关系*/
  add(data: AppFriendForm) {
    return request({
      url: `${APPFRIEND_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新用户好友关系
   *
   * @param id 用户好友关系ID
   * @param data 用户好友关系表单数据
   */
  update(id: number, data: AppFriendForm) {
    return request({
      url: `${APPFRIEND_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除用户好友关系，多个以英文逗号(,)分割
   *
   * @param ids 用户好友关系ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPFRIEND_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppFriendAPI;

/** 用户好友关系分页查询参数 */
export interface AppFriendPageQuery extends PageQuery {}

/** 用户好友关系表单对象 */
export interface AppFriendForm {
  /** 主键，自增 */
  id?: number;
  /** 用户ID，关联到 app_user 表 */
  userId?: number;
  /** 好友ID，关联到 app_user 表 */
  friendId?: number;
  /** 好友关系状态，0-待验证，1-已通过，2-已删除 */
  status?: number;
}

/** 用户好友关系分页对象 */
export interface AppFriendPageVO {
  /** 主键，自增 */
  id?: number;
  /** 用户ID，关联到 app_user 表 */
  userId?: number;
  /** 好友ID，关联到 app_user 表 */
  friendId?: number;
  /** 好友关系状态，0-待验证，1-已通过，2-已删除 */
  status?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（1-删除，0-未删除） */
  isDeleted?: number;
}

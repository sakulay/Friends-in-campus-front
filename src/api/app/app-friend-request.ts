import request from "@/utils/request";

const APPFRIENDREQUEST_BASE_URL = "/api/v1/appFriendRequests";

const AppFriendRequestAPI = {
  /** 获取好友申请分页数据 */
  getPage(queryParams?: AppFriendRequestPageQuery) {
    return request<any, PageResult<AppFriendRequestPageVO[]>>({
      url: `${APPFRIENDREQUEST_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取好友申请表单数据
   *
   * @param id 好友申请ID
   * @returns 好友申请表单数据
   */
  getFormData(id: number) {
    return request<any, AppFriendRequestForm>({
      url: `${APPFRIENDREQUEST_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加好友申请*/
  add(data: AppFriendRequestForm) {
    return request({
      url: `${APPFRIENDREQUEST_BASE_URL}`,
      method: "post",
      data: data,
    });
  },
  /** 通过好友申请 */
  passRequest(data: number) {
    return request({
      url: `${APPFRIENDREQUEST_BASE_URL}/passRequest/${data}`,
      method: "put",
      data: data,
    });
  },
  /**
   * 更新好友申请
   *
   * @param id 好友申请ID
   * @param data 好友申请表单数据
   */
  update(id: number, data: AppFriendRequestForm) {
    return request({
      url: `${APPFRIENDREQUEST_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除好友申请，多个以英文逗号(,)分割
   *
   * @param ids 好友申请ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPFRIENDREQUEST_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppFriendRequestAPI;

/** 好友申请分页查询参数 */
export interface AppFriendRequestPageQuery extends PageQuery {}

/** 好友申请表单对象 */
export interface AppFriendRequestForm {
  /** 主键，自增 */
  id?: number;
  /** 申请人ID，关联到 app_user 表 */
  senderId?: number;
  /** 接收者ID，关联到 app_user 表 */
  receiverId?: number;
  /** 申请状态，0-待处理，1-已通过，2-已拒绝，3-已撤回 */
  status?: number;
}

/** 好友申请分页对象 */
export interface AppFriendRequestPageVO {
  /** 主键，自增 */
  id?: number;
  /** 申请人ID，关联到 app_user 表 */
  senderId?: number;
  /** 接收者ID，关联到 app_user 表 */
  receiverId?: number;
  /** 申请状态，0-待处理，1-已通过，2-已拒绝，3-已撤回 */
  status?: number;
  /** 申请时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除(1-删除，0-未删除) */
  isDeleted?: number;
}

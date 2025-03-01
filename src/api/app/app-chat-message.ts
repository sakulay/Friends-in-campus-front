import request from "@/utils/request";

const APPCHATMESSAGE_BASE_URL = "/api/v1/appChatMessages";

const AppChatMessageAPI = {
  /** 获取用户聊天记录分页数据 */
  getPage(queryParams?: AppChatMessagePageQuery) {
    return request<any, PageResult<AppChatMessagePageVO[]>>({
      url: `${APPCHATMESSAGE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取用户聊天记录表单数据
   *
   * @param id 用户聊天记录ID
   * @returns 用户聊天记录表单数据
   */
  getFormData(id: number) {
    return request<any, AppChatMessageForm>({
      url: `${APPCHATMESSAGE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加用户聊天记录*/
  add(data: AppChatMessageForm) {
    return request({
      url: `${APPCHATMESSAGE_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新用户聊天记录
   *
   * @param id 用户聊天记录ID
   * @param data 用户聊天记录表单数据
   */
  update(id: number, data: AppChatMessageForm) {
    return request({
      url: `${APPCHATMESSAGE_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除用户聊天记录，多个以英文逗号(,)分割
   *
   * @param ids 用户聊天记录ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPCHATMESSAGE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppChatMessageAPI;

/** 用户聊天记录分页查询参数 */
export interface AppChatMessagePageQuery extends PageQuery {}

/** 用户聊天记录表单对象 */
export interface AppChatMessageForm {
  /** 主键，自增 */
  id?: number;
  /** 发送者ID，关联到 app_user 表 */
  senderId?: number;
  /** 接收者ID，关联到 app_user 表 */
  receiverId?: number;
  /** 消息内容 */
  messageContent?: string;
  /** 消息类型，1-文本消息，2-图片，3-语音等 */
  messageType?: number;
  /** 是否已读，0-未读，1-已读 */
  isRead?: number;
}

/** 用户聊天记录分页对象 */
export interface AppChatMessagePageVO {
  /** 主键，自增 */
  id?: number;
  /** 发送者ID，关联到 app_user 表 */
  senderId?: number;
  /** 接收者ID，关联到 app_user 表 */
  receiverId?: number;
  /** 消息内容 */
  messageContent?: string;
  /** 消息类型，1-文本消息，2-图片，3-语音等 */
  messageType?: number;
  /** 消息发送时间 */
  createTime?: Date;
  /** 是否已读，0-未读，1-已读 */
  isRead?: number;
  /** 是否删除，0-未删除，1-已删除 */
  isDeleted?: number;
}

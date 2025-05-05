import request from "@/utils/request";

const APPCOMPLAINT_BASE_URL = "/api/v1/appComplaints";

const AppComplaintAPI = {
  /** 获取用户举报记录分页数据 */
  getPage(queryParams?: AppComplaintPageQuery) {
    return request<any, PageResult<AppComplaintPageVO[]>>({
      url: `${APPCOMPLAINT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取用户举报记录表单数据
   *
   * @param id 用户举报记录ID
   * @returns 用户举报记录表单数据
   */
  getFormData(id: number) {
    return request<any, AppComplaintForm>({
      url: `${APPCOMPLAINT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加用户举报记录*/
  add(data: AppComplaintForm) {
    return request({
      url: `${APPCOMPLAINT_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新用户举报记录
   *
   * @param id 用户举报记录ID
   * @param data 用户举报记录表单数据
   */
  update(id: number, data: AppComplaintForm) {
    return request({
      url: `${APPCOMPLAINT_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除用户举报记录，多个以英文逗号(,)分割
   *
   * @param ids 用户举报记录ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPCOMPLAINT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppComplaintAPI;

/** 用户举报记录分页查询参数 */
export interface AppComplaintPageQuery extends PageQuery {}

/** 用户举报记录表单对象 */
export interface AppComplaintForm {
  /** 主键，自增 */
  id?: number;
  /** 举报用户ID，关联到 app_user 表 */
  userId?: number;
  /** 举报描述，说明举报原因 */
  complaintDescription?: string;
  /** 举报目标类型，1-图文，2-评论 */
  complaintTargetType?: number;
  /** 举报目标ID（对应图文ID或评论ID） */
  complaintTargetId?: number;
  /** 举报状态，0-待处理，1-已受理，2-已处理，3-已驳回 */
  status?: number;
}

/** 用户举报记录分页对象 */
export interface AppComplaintPageVO {
  /** 主键，自增 */
  id?: number;
  /** 举报用户ID，关联到 app_user 表 */
  userId?: number;
  /** 举报类型（例如：恶意内容、色情暴力等） */
  complaintType?: string;
  /** 举报描述，说明举报原因 */
  complaintDescription?: string;
  /** 举报目标类型，1-图文，2-评论 */
  complaintTargetType?: number;
  /** 举报目标ID（对应图文ID或评论ID） */
  complaintTargetId?: number;
  /** 举报状态，0-待处理，1-已受理，2-已处理，3-已驳回 */
  status?: number;
  /** 举报时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除(1-删除，0-未删除) */
  isDeleted?: number;
}

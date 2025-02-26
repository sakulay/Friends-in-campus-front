import request from "@/utils/request";

const APPUSERPROFILE_BASE_URL = "/api/v1/appUserProfiles";

const AppUserProfileAPI = {
  /** 获取用户个人信息分页数据 */
  getPage(queryParams?: AppUserProfilePageQuery) {
    return request<any, PageResult<AppUserProfilePageVO[]>>({
      url: `${APPUSERPROFILE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取用户个人信息表单数据
   *
   * @param id 用户个人信息ID
   * @returns 用户个人信息表单数据
   */
  getFormData(id: number) {
    return request<any, AppUserProfileForm>({
      url: `${APPUSERPROFILE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加用户个人信息*/
  add(data: AppUserProfileForm) {
    return request({
      url: `${APPUSERPROFILE_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新用户个人信息
   *
   * @param id 用户个人信息ID
   * @param data 用户个人信息表单数据
   */
  update(id: number, data: AppUserProfileForm) {
    // console.log("更新数据: " + JSON.stringify(data, null, 2));
    return request({
      url: `${APPUSERPROFILE_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除用户个人信息，多个以英文逗号(,)分割
   *
   * @param ids 用户个人信息ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPUSERPROFILE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppUserProfileAPI;

/** 用户个人信息分页查询参数 */
export interface AppUserProfilePageQuery extends PageQuery {}

/** 用户个人信息表单对象 */
export interface AppUserProfileForm {
  /** 主键，自增 */
  id?: number;
  /** 学号，关联到 app_user 表的学号 */
  studentId?: number;
  /** 用户昵称 */
  nickname?: string;
  /** 用户头像URL */
  avatar?: string;
  /** 性别，0-男，1-女 */
  gender?: number;
  /** 个人简介 */
  bio?: string;
  /** 是否删除（1-删除，0-未删除） */
  isDeleted?: number;
  /** 头像删除地址 */
  deleteUrl?: string;
}

/** 用户个人信息分页对象 */
export interface AppUserProfilePageVO {
  /** 主键，自增 */
  id?: number;
  /** 学号，关联到 app_user 表的学号 */
  studentId?: number;
  /** 用户昵称 */
  nickname?: string;
  /** 用户头像URL */
  avatar?: string;
  /** 性别，0-男，1-女 */
  gender?: number;
  /** 个人简介 */
  bio?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人ID */
  createBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 修改人ID */
  updateBy?: number;
  /** 是否删除（1-删除，0-未删除） */
  isDeleted?: number;
  /** 头像删除地址 */
  deleteUrl?: string;
}

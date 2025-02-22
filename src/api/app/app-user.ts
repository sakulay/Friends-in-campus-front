import request from "@/utils/request";

const APPUSER_BASE_URL = "/api/v1/appUsers";
const allowedFields: (keyof AppUserForm)[] = ["studentId", "password", "authStatus", "authInfo"];

function filterObject<T extends Record<string, any>>(
  obj: T,
  allowedFields: (keyof T)[]
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key as keyof T))
  ) as Partial<T>;
}

const AppUserAPI = {
  /** 获取app_user ，存储用户的基本信息及认证信息分页数据 */
  getPage(queryParams?: AppUserPageQuery) {
    return request<any, PageResult<AppUserPageVO[]>>({
      url: `${APPUSER_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取app_user ，存储用户的基本信息及认证信息表单数据
   *
   * @param id app_user ，存储用户的基本信息及认证信息ID
   * @returns app_user ，存储用户的基本信息及认证信息表单数据
   */
  getFormData(id: number) {
    return request<any, AppUserForm>({
      url: `${APPUSER_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加app_user ，存储用户的基本信息及认证信息*/
  add(data: AppUserForm) {
    return request({
      url: `${APPUSER_BASE_URL}`,
      method: "post",
      data: filterObject(data, allowedFields),
    });
  },

  /**
   * 更新app_user ，存储用户的基本信息及认证信息
   *
   * @param id app_user ，存储用户的基本信息及认证信息ID
   * @param data app_user ，存储用户的基本信息及认证信息表单数据
   */
  update(id: number, data: AppUserForm) {
    return request({
      url: `${APPUSER_BASE_URL}/${id}`,
      method: "put",
      data: filterObject(data, allowedFields),
    });
  },

  /**
   * 批量删除app_user ，存储用户的基本信息及认证信息，多个以英文逗号(,)分割
   *
   * @param ids app_user ，存储用户的基本信息及认证信息ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPUSER_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppUserAPI;

/** app_user ，存储用户的基本信息及认证信息分页查询参数 */
export interface AppUserPageQuery extends PageQuery {}

/** app_user ，存储用户的基本信息及认证信息表单对象 */
export interface AppUserForm {
  /** 学号，唯一标识 */
  studentId?: number;
  /** 用户密码 */
  password?: string;
  /** 认证状态，0-未认证，1-已认证 */
  authStatus?: number;
  /** 认证信息（如认证图片的URL） */
  authInfo?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人ID */
  createBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 修改人ID */
  updateBy?: number;
}

/** app_user ，存储用户的基本信息及认证信息分页对象 */
export interface AppUserPageVO {
  /** 学号，唯一标识 */
  studentId?: number;
  /** 用户密码 */
  password?: string;
  /** 认证状态，0-未认证，1-已认证 */
  authStatus?: number;
  /** 认证信息（如认证图片的URL） */
  authInfo?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人ID */
  createBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 修改人ID */
  updateBy?: number;
}

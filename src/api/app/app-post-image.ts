import request from "@/utils/request";

const APPPOSTIMAGE_BASE_URL = "/api/v1/appPostImages";

const AppPostImageAPI = {
  /** 获取图文图片分页数据 */
  getPage(queryParams?: AppPostImagePageQuery) {
    return request<any, PageResult<AppPostImagePageVO[]>>({
      url: `${APPPOSTIMAGE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取图文图片表单数据
   *
   * @param id 图文图片ID
   * @returns 图文图片表单数据
   */
  getFormData(id: number) {
    return request<any, AppPostImageForm>({
      url: `${APPPOSTIMAGE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加图文图片*/
  add(data: AppPostImageForm) {
    return request({
      url: `${APPPOSTIMAGE_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新图文图片
   *
   * @param id 图文图片ID
   * @param data 图文图片表单数据
   */
  update(id: number, data: AppPostImageForm) {
    return request({
      url: `${APPPOSTIMAGE_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除图文图片，多个以英文逗号(,)分割
   *
   * @param ids 图文图片ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPPOSTIMAGE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AppPostImageAPI;

/** 图文图片分页查询参数 */
export interface AppPostImagePageQuery extends PageQuery {}

/** 图文图片表单对象 */
export interface AppPostImageForm {
  /** 主键，自增 */
  id?: number;
  /** 图文ID，关联到 app_post 表 */
  postId?: number;
  /** 图片URL，存储图片路径或链接 */
  imageUrl?: string;
  /** 图片删除URL */
  deleteUrl?: string;
  /** 图片的显示顺序，值越小排前 */
  imageOrder?: number;
  /** 图片上传时间 */
  createTime?: Date;
}

/** 图文图片分页对象 */
export interface AppPostImagePageVO {
  /** 主键，自增 */
  id?: number;
  /** 图文ID，关联到 app_post 表 */
  postId?: number;
  /** 图片URL，存储图片路径或链接 */
  imageUrl?: string;
  /** 图片删除URL */
  deleteUrl?: string;
  /** 图片的显示顺序，值越小排前 */
  imageOrder?: number;
  /** 图片上传时间 */
  createTime?: Date;
  /** 是否删除(1-删除，0-未删除) */
  isDeleted?: number;
}

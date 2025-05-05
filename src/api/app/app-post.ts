import request from "@/utils/request";
import { type AppPostImageForm, type AppPostImagePageVO } from "./app-post-image";

const APPPOST_BASE_URL = "/api/v1/appPosts";

const AppPostAPI = {
  /** 获取图文内容分页数据 */
  getPage(queryParams?: AppPostPageQuery) {
    return request<any, PageResult<AppPostPageVO[]>>({
      url: `${APPPOST_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取图文内容表单数据
   *
   * @param id 图文内容ID
   * @returns 图文内容表单数据
   */
  getFormData(id: number) {
    return request<any, AppPostForm>({
      url: `${APPPOST_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加图文内容*/
  add(data: AppPostForm) {
    return request({
      url: `${APPPOST_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新图文内容
   *
   * @param id 图文内容ID
   * @param data 图文内容表单数据
   */
  update(id: number, data: AppPostForm) {
    console.log("更新数据", data);

    return request({
      url: `${APPPOST_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除图文内容，多个以英文逗号(,)分割
   *
   * @param ids 图文内容ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${APPPOST_BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  /**
   * 审核图片信息，1-通过， 2-不通过
   *
   * @param id 图文内容ID
   */
  verify(id: number, status: number) {
    return request({
      url: `${APPPOST_BASE_URL}/verify/${id}`,
      method: "put",
      data: status,
    });
  },

  // 新增方法：将 UploadFile[] 转换为 AppPostImagePageVO[]
  uploadFilesToAppPostImages(uploadFiles: UploadFile[]): AppPostImagePageVO[] {
    return uploadFiles.map((file, index) => ({
      id: file.id,
      imageUrl: file.url,
      deleteUrl: file.deleteUrl,
      imageOrder: index,
    }));
  },

  // 新增方法：将 AppPostImagePageVO[] 转换为 UploadFile[]
  appPostImagesToUploadFiles(appPostImages: AppPostImageForm[]): UploadFile[] {
    return appPostImages.map((image) => ({
      id: image.id,
      name: image.imageUrl?.split("/").pop() || "",
      url: image.imageUrl || "",
      deleteUrl: image.deleteUrl,
    }));
  },
};

// 新增 UploadFile 接口
export interface UploadFile {
  id?: number;
  name: string;
  url?: string;
  deleteUrl?: string;
  response?: any;
}

export default AppPostAPI;

/** 图文内容分页查询参数 */
export interface AppPostPageQuery extends PageQuery {}

/** 图文内容表单对象 */
export interface AppPostForm {
  /** 主键，自增 */
  id?: number;
  /** 发布图文的用户ID，关联到 app_user 表 */
  userId?: number;
  /** 图文标题 */
  title?: string;
  /** 图文内容，支持富文本 */
  content?: string;
  /** 点赞数 */
  likeCount?: number;
  /** 评论数 */
  commentCount?: number;
  /** 文章状态（0-待审核，1-审核通过，2-禁用） */
  status?: number;
  /** 图片列表 */
  imageList?: AppPostImageForm[];
}

/** 图文内容分页对象 */
export interface AppPostPageVO {
  /** 主键，自增 */
  id?: number;
  /** 发布图文的用户ID，关联到 app_user 表 */
  userId?: number;
  /** 图文标题 */
  title?: string;
  /** 图文内容，支持富文本 */
  content?: string;
  /** 点赞数 */
  likeCount?: number;
  /** 评论数 */
  commentCount?: number;
  /** 发布图文时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
  /** 文章状态（0-待审核，1-审核通过，2-禁用） */
  status?: number;
  /** 图片列表 */
  imageList?: AppPostImagePageVO[];
}

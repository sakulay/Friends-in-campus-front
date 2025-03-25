<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button v-hasPerm="['app:appPost:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appPost:delete']"
          type="danger"
          :disabled="removeIds.length === 0"
          @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>
      <!-- 数据表格 -->
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="55" align="center" />
        <el-table-column key="id" label="图文ID" prop="id" min-width="80" align="center" />
        <el-table-column key="userId" label="用户ID" prop="userId" min-width="140" align="center" />
        <el-table-column label="图片" width="200" align="center">
          <template #default="{ row }">
            <el-carousel v-if="row.imageList && row.imageList.length > 0" height="100px">
              <el-carousel-item v-for="(image, index) in row.imageList" :key="index">
                <el-image :src="image.imageUrl" fit="cover" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-table-column>
        <el-table-column key="title" label="图文标题" prop="title" min-width="200" align="center">
          <template #default="{ row }">
            <el-tooltip :content="row.title" placement="top">
              <span>
                {{ row.title.length > 30 ? row.title.slice(0, 30) + "..." : row.title }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          key="content"
          label="图文内容"
          prop="content"
          min-width="250"
          align="center"
        >
          <template #default="{ row }">
            <span>
              {{ row.content.length > 30 ? row.content.slice(0, 40) + "..." : row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          key="likeCount"
          label="点赞数"
          prop="likeCount"
          min-width="100"
          align="center"
        />
        <el-table-column
          key="commentCount"
          label="评论数"
          prop="commentCount"
          min-width="100"
          align="center"
        />
        <!-- <el-table-column
          key="createTime"
          label="发布图文时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateTime"
          label="更新时间"
          prop="updateTime"
          min-width="150"
          align="center"
        /> -->
        <el-table-column
          key="status"
          label="文章状态（0-待审核，1-审核通过，2-禁用）"
          prop="status"
          min-width="150"
          align="center"
        >
          <template #header>
            <el-tooltip effect="dark" content="0-待审核，1-审核通过，2-未通过" placement="top">
              <span>文章状态</span>
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status == 0 ? 'warning' : scope.row.status == 1 ? 'success' : 'danger'
              "
            >
              {{ scope.row.status == 0 ? "待审核" : scope.row.status == 1 ? "审核通过" : "未通过" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appPost:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appPost:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
            <!-- :disabled="!(scope.row.status == 0)" -->
            <el-button type="primary" size="small" link @click="viewDetails(scope.row)">
              <template #icon>
                <View />
              </template>
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>
    <!-- {{ pageData[0].imageList[0].imageUrl }} -->
    <!-- 图文内容表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="1000px"
      :close-on-click-modal="false"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="发布图文的用户ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="图文标题" prop="title">
          <el-input v-model="formData.title" placeholder="图文标题" />
        </el-form-item>

        <el-form-item label="图文内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10 }"
            placeholder="图文内容"
          />
        </el-form-item>

        <el-form-item label="图片" prop="imageList">
          <el-upload
            ref="uploadRef"
            :action="FileAPI.myUploadUrl"
            :name="FileAPI.name"
            :data="FileAPI.data"
            list-type="picture-card"
            :file-list="imageList"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog :visible.sync="dialogImageUrlVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 文章详情内容弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      width="1000px"
      style="padding: 0 35px 20px; margin-top: 10px; margin-bottom: 10px"
    >
      <div class="post-header">
        <h2>{{ selectedPost?.title }}</h2>
        <div class="post-meta">
          <p>
            点赞数：{{ selectedPost?.likeCount }} &nbsp;&nbsp; 评论数：{{
              selectedPost?.commentCount
            }}
          </p>
          <p>发布时间：{{ formatDate(selectedPost?.createTime) }}</p>
        </div>
      </div>
      <!-- 轮播图 -->
      <el-carousel
        v-if="selectedPost?.imageList && selectedPost?.imageList.length > 0"
        height="400px"
        :interval="4000"
        indicator-position="outside"
      >
        <el-carousel-item
          v-for="(image, index) in selectedPost.imageList"
          :key="index"
          class="carousel-item"
        >
          <el-image :src="image.imageUrl" fit="contain" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>
      <div class="post-content">
        <h2>内容详情：</h2>
        <p style="margin-top: 10px">{{ selectedPost?.content }}</p>
      </div>
      <template #footer>
        <el-button
          type="success"
          :disabled="selectedPost.status != 0"
          @click="handleVerify(1, selectedPost.id)"
        >
          通过
        </el-button>
        <el-button type="danger" @click="handleVerify(2, selectedPost.id)">拒绝</el-button>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import FileAPI from "@/api/file";

defineOptions({
  name: "AppPost",
  inheritAttrs: false,
});

import AppPostAPI, {
  AppPostPageVO,
  AppPostForm,
  AppPostPageQuery,
  UploadFile,
} from "@/api/app/app-post";
import axios from "axios";
import { dayjs } from "element-plus";
// import { View } from "@element-plus/icons-vue/dist/types";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppPostPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 图文内容表格数据
const pageData = ref<AppPostPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 审核内容弹窗
const dialogVisible = ref(false);
const selectedPost = ref<AppPostPageVO>({});
// 查看详情
const viewDetails = (post: AppPostPageVO) => {
  selectedPost.value = post;
  dialogVisible.value = true;
};
// 图文内容表单数据
const formData = reactive<AppPostForm>({});

// 图文内容表单校验规则
const rules = reactive({
  userId: [
    { required: true, message: "请输入发布图文的用户ID，关联到 app_user 表", trigger: "blur" },
  ],
});
// 图片列表
const imageList = ref<UploadFile[]>([]);
// upload的引用
const uploadRef = ref();

// 格式化日期时间

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
/** 查询图文内容 */
function handleQuery() {
  loading.value = true;
  AppPostAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置图文内容查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开图文内容弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改图文内容";
    AppPostAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
      // 转换 imageList 类型
      imageList.value = AppPostAPI.appPostImagesToUploadFiles(formData.imageList || []);
    });
  } else {
    dialog.title = "新增图文内容";
  }
}

/** 提交图文内容表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      // 转换 imageList 类型
      formData.imageList = AppPostAPI.uploadFilesToAppPostImages(imageList.value);
      if (id) {
        loading.value = false;
        // console.log("formadata: ", JSON.stringify(formData));
        AppPostAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        // console.dir("formData" + JSON.stringify(formData));
        AppPostAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭图文内容弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
  imageList.value = []; // 重置 imageList
}

/** 删除图文内容 */
function handleDelete(id?: number) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      const imageListForDeletion = getImageListForDeletion(ids);
      // console.log(JSON.stringify(imageListForDeletion));
      loading.value = false;
      AppPostAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          // 删除图片
          deleteImages(imageListForDeletion);
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}
/** 获取要删除的图文的图片类别 */
function getImageListForDeletion(ids: string): UploadFile[] {
  const idsArray = ids.split(",").map(Number);
  let imageListForDeletion: UploadFile[] = [];
  idsArray.forEach((postId) => {
    const postToDelete = pageData.value.find((post) => post.id == postId);
    if (postToDelete) {
      imageListForDeletion = imageListForDeletion.concat(
        AppPostAPI.appPostImagesToUploadFiles(postToDelete.imageList || [])
      );
    }
  });
  return imageListForDeletion;
}
// 新增方法：删除图片
function deleteImages(imageList: UploadFile[]) {
  imageList.forEach((file) => {
    const deleteUrl = file.deleteUrl;
    console.log("deleteUrl: ", deleteUrl);

    if (deleteUrl) {
      axios
        .get(deleteUrl.replace(import.meta.env.VITE_PIC_API_URL, import.meta.env.VITE_PIC_BASE_API))
        .then((res) => {
          if (res.data.code == 200) {
            ElMessage.success("图片删除成功");
          } else {
            ElMessage.error("图片删除失败" + res.data.msg);
          }
        })
        .catch((err) => {
          console.error("图片删除失败", err);
          ElMessage.error("图片删除失败", err);
        });
    } else {
      ElMessage.warning("删除URL不存在");
    }
  });
}

/** 提交审核结果 */
const handleVerify = (type: number, id?: number) => {
  if (id === undefined) {
    ElMessage.warning("请选择有效的图文内容");
    return;
  }
  ElMessageBox.confirm("确认审核已选中的图文内容?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    if (type === 1) {
      AppPostAPI.verify(id, type)
        .then(() => {
          ElMessage.success("审核已通过");
          handleResetQuery();
          dialogVisible.value = false;
        })
        .finally(() => (loading.value = false));
    } else if (type === 2) {
      AppPostAPI.verify(id, type)
        .then(() => {
          ElMessage.success("审核已拒绝");
          handleResetQuery();
          dialogVisible.value = false;
        })
        .finally(() => (loading.value = false));
    }
  });
};

/** Upload部分 */
// 新增 handleUploadSuccess 方法
function handleUploadSuccess(response: any, file: UploadFile, fileList: UploadFile[]) {
  console.log("上传成功: " + response);
  // 假设 response 包含上传成功后的图片 URL
  const newFile: UploadFile = {
    name: file.name,
    url: response.url, // 根据实际返回的数据结构调整
    deleteUrl: response.del,
  };
  imageList.value.push(newFile);
}

// 新增 handleUploadError 方法
function handleUploadError(err: any, file: UploadFile, fileList: UploadFile[]) {
  console.error("文件上传失败", err);
  ElMessage.error("文件上传失败，请重试");
}

// 新增 handleRemove 方法
function handleRemove(file: UploadFile, fileList: UploadFile[]) {
  // 如果 file.deleteUrl 不存在，则从 file.response 中提取
  const deleteUrl = file.deleteUrl || file.response?.del;
  const url = file.url || file.response?.url;
  if (deleteUrl) {
    axios
      .get(deleteUrl.replace(import.meta.env.VITE_PIC_API_URL, import.meta.env.VITE_PIC_BASE_API))
      .then((res) => {
        if (res.data.code == 200) {
          ElMessage.success("图片删除成功");
          // 从 imageList 中移除已删除的图片
          imageList.value = imageList.value.filter((img) => img.url !== url);
          // console.log("imageList", JSON.stringify(imageList.value));
        } else {
          ElMessage.error("图片删除失败" + res.data.msg);
        }
      })
      .catch((err) => {
        console.error("图片删除失败", err);
        ElMessage.error("图片删除失败", err);
      });
  } else {
    ElMessage.warning("删除URL不存在");
  }
}

// 初始化 dialogImageUrlVisible 和 dialogImageUrl
const dialogImageUrlVisible = ref(false);
const dialogImageUrl = ref("");

// 图片预览处理
function handlePictureCardPreview(file: UploadFile) {
  dialogImageUrl.value = file.url!;
  dialogImageUrlVisible.value = true;
}

onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0;
  overflow: hidden; /* 隐藏溢出部分 */
  background-color: #f0f0f0; /* 背景颜色 */
  border-radius: 8px; /* 圆角 */
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例并完全显示 */
}

.post-header {
  margin-bottom: 20px;
}

.post-meta p {
  margin: 5px 0;
  font-family: Arial, sans-serif;
  font-size: 13px;
  color: #606266;
}

.post-content {
  margin-bottom: 20px;
}

.post-content p {
  margin: 5px 0;
  font-family: Arial, sans-serif;
  font-size: 17px;
  color: #606266;
}
</style>

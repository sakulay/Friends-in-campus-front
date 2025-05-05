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
        <el-button v-hasPerm="['app:appComplaint:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appComplaint:delete']"
          type="danger"
          :disabled="removeIds.length === 0"
          @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column key="id" label="ID" prop="id" min-width="150" align="center" />
        <el-table-column
          key="userId"
          label="举报用户ID"
          prop="userId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="complaintDescription"
          label="举报描述"
          prop="complaintDescription"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="complaintTargetType"
          label="举报目标类型"
          prop="complaintTargetType"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span>
              {{ row.complaintTargetType == 1 ? "图文" : "评论" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          key="complaintTargetId"
          label="举报目标ID"
          prop="complaintTargetId"
          min-width="150"
          align="center"
        />
        <el-table-column key="status" label="举报状态" prop="status" min-width="150" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.status == 0
                  ? "待处理"
                  : row.status == 1
                    ? "已受理"
                    : row.status == 2
                      ? "已处理"
                      : "已驳回"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appComplaint:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button type="info" size="small" link @click="handleViewComplaintContent(scope.row)">
              查看内容
            </el-button>
            <el-button
              v-hasPerm="['app:appComplaint:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
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

    <!-- 用户举报记录表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="formData.id" placeholder="主键，自增" />
        </el-form-item>

        <el-form-item label="举报用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="举报用户ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="举报描述" prop="complaintDescription">
          <el-input v-model="formData.complaintDescription" placeholder="举报描述，说明举报原因" />
        </el-form-item>

        <el-form-item label="举报目标类型" prop="complaintTargetType">
          <el-input
            v-model="formData.complaintTargetType"
            placeholder="举报目标类型，1-图文，2-评论"
          />
        </el-form-item>

        <el-form-item label="举报目标ID" prop="complaintTargetId">
          <el-input
            v-model="formData.complaintTargetId"
            placeholder="举报目标ID（对应图文ID或评论ID）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看评论-->
    <el-dialog v-model="dialogCommentVisible" width="600px">
      <div>
        <p><strong>评论内容：</strong></p>
        <p>{{ selectedComment.content }}</p>
      </div>

      <template #footer>
        <el-button
          type="success"
          :disabled="selectReport.status != 0"
          @click="handleReject(selectReport.id as number)"
        >
          驳回
        </el-button>
        <el-button
          type="danger"
          :disabled="selectReport.status != 0"
          @click="handleBanComment(selectedComment.id as number)"
        >
          禁用
        </el-button>
        <el-button type="primary" @click="handleClose()">关闭</el-button>
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
          :disabled="selectReport.status != 0"
          @click="handleReject(selectReport.id as number)"
        >
          驳回
        </el-button>
        <el-button
          type="danger"
          :disabled="selectReport.status != 0"
          @click="handleBanPost(selectedPost.id as number)"
        >
          禁用
        </el-button>
        <el-button type="primary" @click="handleClose()">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AppComplaint",
  inheritAttrs: false,
});

import AppComplaintAPI, {
  AppComplaintPageVO,
  AppComplaintForm,
  AppComplaintPageQuery,
} from "@/api/app/app-complaint";
import AppPostAPI, { AppPostForm, AppPostPageVO } from "@/api/app/app-post";
import AppPostCommentAPI, { AppPostCommentForm } from "@/api/app/app-post-comment";
import App from "@/App.vue";
import { dayjs } from "element-plus";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

// 审核内容弹窗
const dialogVisible = ref(false);
const selectedPost = ref<AppPostForm>({});
const dialogCommentVisible = ref(false);
const selectedComment = ref<AppPostCommentForm>({});
const selectReport = ref<AppComplaintPageVO>({});

const queryParams = reactive<AppComplaintPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 用户举报记录表格数据
const pageData = ref<AppComplaintPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 格式化日期时间

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
/**
 * 处理查看举报内容详情
 * @param row
 */
function handleViewComplaintContent(row: AppComplaintPageVO) {
  console.log("row: ", JSON.stringify(row));
  selectReport.value = row;
  if ((row.complaintTargetType as number) == 1) {
    dialogVisible.value = true;
    AppPostAPI.getFormData(row.complaintTargetId as number).then((data) => {
      selectedPost.value = data;
    });
  } else if ((row.complaintTargetType as number) == 2) {
    dialogCommentVisible.value = true;
    AppPostCommentAPI.getFormData(row.complaintTargetId as number).then((data) => {
      selectedComment.value = data;
    });
  }
}
// 驳回
function handleReject(rowId: number) {
  const form = { status: 3 };
  AppComplaintAPI.update(rowId, form)
    .then(() => {
      ElMessage.success("驳回成功");
      handleQuery();
    })
    .catch(() => {
      ElMessage.error("驳回失败");
    })
    .finally(() => {
      dialogVisible.value = false;
      dialogCommentVisible.value = false;
      selectReport.value = {};
    });
}
// 关闭
function handleClose() {
  dialogVisible.value = false;
  dialogCommentVisible.value = false;
  selectedPost.value = {};
}

async function handleBanPost(postId: number) {
  try {
    await AppPostAPI.update(postId, { status: 2 });
    await AppComplaintAPI.update(selectReport.value.id as number, { status: 1 });
  } catch (error) {
  } finally {
    dialogVisible.value = false;
    dialogCommentVisible.value = false;
    selectReport.value = {};
  }
  ElMessage.success("禁用成功");
  handleQuery();
}
async function handleBanComment(commentId: number) {
  try {
    await AppPostCommentAPI.update(commentId, { status: 2 });
    await AppComplaintAPI.update(selectReport.value.id as number, { status: 1 });
  } catch (error) {
  } finally {
    dialogVisible.value = false;
    dialogCommentVisible.value = false;
    selectReport.value = {};
  }
  ElMessage.success("禁用成功");
  handleQuery();
}
// 用户举报记录表单数据
const formData = reactive<AppComplaintForm>({});

// 用户举报记录表单校验规则
const rules = reactive({
  userId: [{ required: true, message: "请输入举报用户ID，关联到 app_user 表", trigger: "blur" }],
  complaintTargetType: [
    { required: true, message: "请输入举报目标类型，1-图文，2-评论", trigger: "blur" },
  ],
  complaintTargetId: [
    { required: true, message: "请输入举报目标ID（对应图文ID或评论ID）", trigger: "blur" },
  ],
});

/** 查询用户举报记录 */
function handleQuery() {
  loading.value = true;
  AppComplaintAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置用户举报记录查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开用户举报记录弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改用户举报记录";
    AppComplaintAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增用户举报记录";
  }
}

/** 提交用户举报记录表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppComplaintAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppComplaintAPI.add(formData)
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

/** 关闭用户举报记录弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除用户举报记录 */
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
      AppComplaintAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>

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
        <el-button
          v-hasPerm="['app:appPostComment:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appPostComment:delete']"
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
        <el-table-column key="id" label="主键，自增" prop="id" min-width="150" align="center" />
        <el-table-column
          key="userId"
          label="评论用户ID，关联到 app_user 表"
          prop="userId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="postId"
          label="图文内容ID，关联到 app_post 表"
          prop="postId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="content"
          label="评论内容"
          prop="content"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="parentId"
          label="回复的评论ID，NULL表示主评论"
          prop="parentId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="评论时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isDeleted"
          label="是否删除(1-删除，0-未删除)"
          prop="isDeleted"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isReply"
          label="是否为回复评论(0为评论，1为回复)"
          prop="isReply"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="status"
          label="审核状态（0 - 待审核，1 - 已通过， 2 - 禁用）"
          prop="status"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appPostComment:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appPostComment:delete']"
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

    <!-- 图文评论表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="主键，自增" prop="id">
          <el-input v-model="formData.id" placeholder="主键，自增" />
        </el-form-item>

        <el-form-item label="评论用户ID，关联到 app_user 表" prop="userId">
          <el-input v-model="formData.userId" placeholder="评论用户ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="图文内容ID，关联到 app_post 表" prop="postId">
          <el-input v-model="formData.postId" placeholder="图文内容ID，关联到 app_post 表" />
        </el-form-item>

        <el-form-item label="评论内容" prop="content">
          <el-input v-model="formData.content" placeholder="评论内容" />
        </el-form-item>

        <el-form-item label="回复的评论ID，NULL表示主评论" prop="parentId">
          <el-input v-model="formData.parentId" placeholder="回复的评论ID，NULL表示主评论" />
        </el-form-item>

        <el-form-item label="是否为回复评论(0为评论，1为回复)" prop="isReply">
          <el-input v-model="formData.isReply" placeholder="是否为回复评论(0为评论，1为回复)" />
        </el-form-item>

        <el-form-item label="审核状态（0 - 待审核，1 - 已通过， 2 - 禁用）" prop="status">
          <el-input
            v-model="formData.status"
            placeholder="审核状态（0 - 待审核，1 - 已通过， 2 - 禁用）"
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
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AppPostComment",
  inheritAttrs: false,
});

import AppPostCommentAPI, {
  AppPostCommentPageVO,
  AppPostCommentForm,
  AppPostCommentPageQuery,
} from "@/api/app/app-post-comment";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppPostCommentPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 图文评论表格数据
const pageData = ref<AppPostCommentPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 图文评论表单数据
const formData = reactive<AppPostCommentForm>({});

// 图文评论表单校验规则
const rules = reactive({
  userId: [{ required: true, message: "请输入评论用户ID，关联到 app_user 表", trigger: "blur" }],
  postId: [{ required: true, message: "请输入图文内容ID，关联到 app_post 表", trigger: "blur" }],
  content: [{ required: true, message: "请输入评论内容", trigger: "blur" }],
});

/** 查询图文评论 */
function handleQuery() {
  loading.value = true;
  AppPostCommentAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置图文评论查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开图文评论弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改图文评论";
    AppPostCommentAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增图文评论";
  }
}

/** 提交图文评论表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppPostCommentAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppPostCommentAPI.add(formData)
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

/** 关闭图文评论弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除图文评论 */
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
      AppPostCommentAPI.deleteByIds(ids)
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

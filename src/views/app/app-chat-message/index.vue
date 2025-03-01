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
          v-hasPerm="['app:appChatMessage:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appChatMessage:delete']"
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
        <el-table-column key="id" label="主键" prop="id" min-width="150" align="center" />
        <el-table-column
          key="senderId"
          label="发送者ID"
          prop="senderId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="receiverId"
          label="接收者ID"
          prop="receiverId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="messageContent"
          label="消息内容"
          prop="messageContent"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="messageType"
          label="消息类型(1-文本消息，2-图片，3-语音)"
          prop="messageType"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="消息发送时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isRead"
          label="是否已读(0-未读，1-已读)"
          prop="isRead"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isDeleted"
          label="是否删除(0-未删除，1-已删除)"
          prop="isDeleted"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appChatMessage:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appChatMessage:delete']"
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

    <!-- 用户聊天记录表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="主键" prop="id">
          <el-input v-model="formData.id" placeholder="主键，自增" />
        </el-form-item>

        <el-form-item label="发送者ID" prop="senderId">
          <el-input v-model="formData.senderId" placeholder="发送者ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="接收者ID" prop="receiverId">
          <el-input v-model="formData.receiverId" placeholder="接收者ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="消息内容" prop="messageContent">
          <el-input v-model="formData.messageContent" placeholder="消息内容" />
        </el-form-item>

        <el-form-item label="消息类型" prop="messageType">
          <el-input
            v-model="formData.messageType"
            placeholder="消息类型，1-文本消息，2-图片，3-语音等"
          />
        </el-form-item>

        <el-form-item label="是否已读" prop="isRead">
          <el-input v-model="formData.isRead" placeholder="是否已读，0-未读，1-已读" />
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
  name: "AppChatMessage",
  inheritAttrs: false,
});

import AppChatMessageAPI, {
  AppChatMessagePageVO,
  AppChatMessageForm,
  AppChatMessagePageQuery,
} from "@/api/app/app-chat-message";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppChatMessagePageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 用户聊天记录表格数据
const pageData = ref<AppChatMessagePageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 用户聊天记录表单数据
const formData = reactive<AppChatMessageForm>({});

// 用户聊天记录表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入主键，自增", trigger: "blur" }],
  senderId: [{ required: true, message: "请输入发送者ID，关联到 app_user 表", trigger: "blur" }],
  receiverId: [{ required: true, message: "请输入接收者ID，关联到 app_user 表", trigger: "blur" }],
  messageContent: [{ required: true, message: "请输入消息内容", trigger: "blur" }],
});

/** 查询用户聊天记录 */
function handleQuery() {
  loading.value = true;
  AppChatMessageAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置用户聊天记录查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开用户聊天记录弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改用户聊天记录";
    AppChatMessageAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增用户聊天记录";
  }
}

/** 提交用户聊天记录表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppChatMessageAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppChatMessageAPI.add(formData)
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

/** 关闭用户聊天记录弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除用户聊天记录 */
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
      AppChatMessageAPI.deleteByIds(ids)
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

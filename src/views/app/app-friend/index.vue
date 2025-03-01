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
        <el-button v-hasPerm="['app:appFriend:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appFriend:delete']"
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
        <el-table-column key="userId" label="用户ID" prop="userId" min-width="150" align="center" />
        <el-table-column
          key="friendId"
          label="好友ID"
          prop="friendId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="status"
          label="好友关系状态(0-待验证，1-已通过，2-已删除)"
          prop="status"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="创建时间"
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
        />
        <el-table-column
          key="isDeleted"
          label="是否删除(1-删除，0-未删除)"
          prop="isDeleted"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appFriend:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appFriend:delete']"
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

    <!-- 用户好友关系表单弹窗 -->
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

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="用户ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="好友ID" prop="friendId">
          <el-input v-model="formData.friendId" placeholder="好友ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="好友关系状态" prop="status">
          <el-input
            v-model="formData.status"
            placeholder="好友关系状态，0-待验证，1-已通过，2-已删除"
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
  name: "AppFriend",
  inheritAttrs: false,
});

import AppFriendAPI, {
  AppFriendPageVO,
  AppFriendForm,
  AppFriendPageQuery,
} from "@/api/app/app-friend";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppFriendPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 用户好友关系表格数据
const pageData = ref<AppFriendPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 用户好友关系表单数据
const formData = reactive<AppFriendForm>({});

// 用户好友关系表单校验规则
const rules = reactive({
  userId: [{ required: true, message: "请输入用户ID，关联到 app_user 表", trigger: "blur" }],
  friendId: [{ required: true, message: "请输入好友ID，关联到 app_user 表", trigger: "blur" }],
});

/** 查询用户好友关系 */
function handleQuery() {
  loading.value = true;
  AppFriendAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置用户好友关系查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开用户好友关系弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改用户好友关系";
    AppFriendAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增用户好友关系";
  }
}

/** 提交用户好友关系表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppFriendAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppFriendAPI.add(formData)
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

/** 关闭用户好友关系弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除用户好友关系 */
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
      AppFriendAPI.deleteByIds(ids)
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

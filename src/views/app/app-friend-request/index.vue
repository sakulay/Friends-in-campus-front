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
          v-hasPerm="['app:appFriendRequest:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appFriendRequest:delete']"
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
          label="申请人ID"
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
          key="status"
          label="申请状态(0-待处理，1-已通过，2-已拒绝，3-已撤回)"
          prop="status"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status == 0
                  ? 'warning'
                  : scope.row.status == 1
                    ? 'success'
                    : scope.row.status == 2
                      ? 'danger'
                      : 'info'
              "
            >
              {{
                scope.row.status == 0
                  ? "待处理"
                  : scope.row.status == 1
                    ? "已通过"
                    : scope.row.status == 2
                      ? "已拒绝"
                      : "已撤回"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          key="createTime"
          label="申请时间"
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
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appFriendRequest:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appFriendRequest:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              :disabled="!(scope.row.status == 0)"
              @click="handlePassRequest(scope.row.id)"
            >
              <template #icon>
                <Select />
              </template>
              通过申请
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

    <!-- 好友申请表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item v-if="type" label="主键" prop="id">
          <el-input v-model="formData.id" placeholder="主键，自增" />
        </el-form-item>

        <el-form-item label="申请人ID" prop="senderId">
          <el-input v-model="formData.senderId" placeholder="申请人ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item label="接收者ID" prop="receiverId">
          <el-input v-model="formData.receiverId" placeholder="接收者ID，关联到 app_user 表" />
        </el-form-item>

        <el-form-item v-if="type" label="申请状态" prop="status">
          <el-input
            v-model="formData.status"
            placeholder="申请状态，0-待处理，1-已通过，2-已拒绝，3-已撤回"
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
  name: "AppFriendRequest",
  inheritAttrs: false,
});

import AppFriendRequestAPI, {
  AppFriendRequestPageVO,
  AppFriendRequestForm,
  AppFriendRequestPageQuery,
} from "@/api/app/app-friend-request";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppFriendRequestPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 好友申请表格数据
const pageData = ref<AppFriendRequestPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 好友申请表单数据
const formData = reactive<AppFriendRequestForm>({});

// 好友申请表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入主键，自增", trigger: "blur" }],
  senderId: [{ required: true, message: "请输入申请人ID，关联到 app_user 表", trigger: "blur" }],
  receiverId: [{ required: true, message: "请输入接收者ID，关联到 app_user 表", trigger: "blur" }],
});

// 处理弹窗类型 true-编辑，false-新增
const type = ref(false);

/** 查询好友申请 */
function handleQuery() {
  loading.value = true;
  AppFriendRequestAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置好友申请查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开好友申请弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改好友申请";
    type.value = true;
    AppFriendRequestAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增好友申请";
  }
}

/** 提交好友申请表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppFriendRequestAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppFriendRequestAPI.add(formData)
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

/** 关闭好友申请弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除好友申请 */
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
      AppFriendRequestAPI.deleteByIds(ids)
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

/** 通过好友申请 */
function handlePassRequest(id: number) {
  ElMessageBox.confirm("确认通过好友请求?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      AppFriendRequestAPI.passRequest(id)
        .then(() => {
          ElMessage.success("请求通过成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>

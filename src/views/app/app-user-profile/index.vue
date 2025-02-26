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
          v-hasPerm="['app:appUserProfile:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appUserProfile:delete']"
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
        <el-table-column key="id" label="个人信息ID" prop="id" min-width="100" align="center" />
        <el-table-column
          key="studentId"
          label="学号"
          prop="studentId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="nickname"
          label="用户昵称"
          prop="nickname"
          min-width="150"
          align="center"
        />
        <el-table-column key="avatar" label="用户头像" prop="avatar" min-width="150" align="center">
          <template #default="scope">
            <div class="center-content">
              <ImageUpload
                :id="scope.row.id"
                v-model="scope.row.avatar"
                :limit="1"
                :maxSize="10"
                :updateMethod="AppUserProfileAPI.update"
                :deleteUrl="scope.row.deleteUrl"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          key="gender"
          label="性别(0-男，1-女)"
          prop="gender"
          min-width="150"
          align="center"
        />
        <el-table-column key="bio" label="个人简介" prop="bio" min-width="150" align="center" />
        <el-table-column label="状态" align="center" prop="isDeleted" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.isDeleted == 0 ? 'success' : 'danger'">
              {{ scope.row.isDeleted == 0 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appUserProfile:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appUserProfile:delete']"
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

    <!-- 用户个人信息表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="formData.studentId" placeholder="学号，关联到 app_user 表的学号" />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="用户昵称" />
        </el-form-item>

        <el-form-item label="用户头像" prop="avatar">
          <el-input v-model="formData.avatar" placeholder="用户头像URL" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-input v-model="formData.gender" placeholder="性别(0-男，1-女)" />
        </el-form-item>

        <el-form-item label="个人简介" prop="bio">
          <el-input v-model="formData.bio" placeholder="个人简介" />
        </el-form-item>
        <el-form-item v-if="type" label="是否删除（1-删除，0-未删除）" prop="isDeleted">
          <el-input v-model="formData.isDeleted" placeholder="是否删除（1-删除，0-未删除）" />
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
  name: "AppUserProfile",
  inheritAttrs: false,
});

import AppUserProfileAPI, {
  AppUserProfilePageVO,
  AppUserProfileForm,
  AppUserProfilePageQuery,
} from "@/api/app/app-user-profile";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
// const picUrl = ref("https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg");

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);
const type = ref(false);
const queryParams = reactive<AppUserProfilePageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 用户个人信息表格数据
const pageData = ref<AppUserProfilePageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 用户个人信息表单数据
const formData = reactive<AppUserProfileForm>({});

// 用户个人信息表单校验规则
const rules = reactive({
  // id: [{ required: true, message: "请输入主键，自增", trigger: "blur" }],
  studentId: [{ required: true, message: "请输入学号，关联到 app_user 表的学号", trigger: "blur" }],
});

/** 查询用户个人信息 */
function handleQuery() {
  loading.value = true;
  AppUserProfileAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置用户个人信息查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开用户个人信息弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    type.value = true;
    dialog.title = "修改用户个人信息";
    AppUserProfileAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    type.value = false;
    dialog.title = "新增用户个人信息";
  }
}

/** 提交用户个人信息表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppUserProfileAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppUserProfileAPI.add(formData)
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

/** 关闭用户个人信息弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除用户个人信息 */
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
      AppUserProfileAPI.deleteByIds(ids)
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
<style lang="scss" scoped>
.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; // 让它充满 `el-table-column`
}
</style>

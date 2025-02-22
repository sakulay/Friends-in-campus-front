<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
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
        <el-button v-hasPerm="['app:appUser:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appUser:delete']"
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
        <el-table-column
          key="studentId"
          label="学号"
          prop="studentId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="password"
          label="用户密码"
          prop="password"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="authStatus"
          label="认证状态(0-未认证，1-已认证)"
          prop="authStatus"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="authInfo"
          label="认证信息"
          prop="authInfo"
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
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['app:appUser:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.studentId)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['app:appUser:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.studentId)"
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

    <!-- app_user ，存储用户的基本信息及认证信息表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="formData.studentId" placeholder="学号" />
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="formData.password" placeholder="用户密码" />
        </el-form-item>

        <el-form-item label="认证状态" prop="authStatus">
          <el-input v-model="formData.authStatus" placeholder="认证状态(0-未认证，1-已认证)" />
        </el-form-item>

        <el-form-item label="认证信息" prop="authInfo">
          <el-input v-model="formData.authInfo" placeholder="认证信息" />
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
  name: "AppUser",
  inheritAttrs: false,
});

import AppUserAPI, { AppUserPageVO, AppUserForm, AppUserPageQuery } from "@/api/app/app-user";
import AuthAPI from "@/api/auth";
import { log } from "console";
import { fdatasync } from "fs";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppUserPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

const type = ref(true);
// app_user ，存储用户的基本信息及认证信息表格数据
const pageData = ref<AppUserPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// app_user ，存储用户的基本信息及认证信息表单数据
const formData = reactive<AppUserForm>({});

// app_user ，存储用户的基本信息及认证信息表单校验规则
const rules = reactive({
  studentId: [{ required: true, message: "请输入学号，唯一标识", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
  authInfo: [{ required: true, message: "请输入认证信息（如认证图片的URL）", trigger: "blur" }],
});

/** 查询app_user ，存储用户的基本信息及认证信息 */
function handleQuery() {
  loading.value = true;
  AppUserAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置app_user ，存储用户的基本信息及认证信息查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开app_user ，存储用户的基本信息及认证信息弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    type.value = true;
    dialog.title = "修改app_user";
    AppUserAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    type.value = false;
    dialog.title = "新增app_user";
  }
  console.dir(formData);
}

/** 提交app_user ，存储用户的基本信息及认证信息表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.studentId;
      if (type.value && id) {
        AppUserAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        // AppUserAPI.add(formData)
        AuthAPI.register(formData)
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

/** 关闭app_user ，存储用户的基本信息及认证信息弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.studentId = undefined;
}

/** 删除app_user ，存储用户的基本信息及认证信息 */
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
      AppUserAPI.deleteByIds(ids)
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

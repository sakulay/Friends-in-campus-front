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
          min-width="100"
          align="center"
        />

        <el-table-column key="authInfo" label="认证信息" prop="authInfo" align="center">
          <template #default="scope">
            <div class="center-content">
              <ImageUpload
                :id="Number(scope.row.studentId)"
                v-model="scope.row.authInfo"
                :limit="1"
                :maxSize="10"
                :updateMethod="AppUserAPI.update"
                :getFormData="AppUserAPI.getFormData"
                :fieldNames="fieldNames"
                :deleteUrl="scope.row.deleteUrl"
              />
            </div>
          </template>
        </el-table-column>

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
        <el-table-column label="状态" align="center" prop="authStatus" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.authStatus == 1 ? 'success' : 'danger'">
              {{ scope.row.authStatus == 1 ? "已认证" : "未认证" }}
            </el-tag>
          </template>
        </el-table-column>
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
            <el-button
              type="primary"
              size="small"
              link
              :disabled="scope.row.authStatus == 1"
              @click="handleVerify(scope.row.studentId)"
            >
              <template #icon>
                <Select />
              </template>
              审核
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
      @close="handleCloseDialog(true)"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="formData.studentId" placeholder="学号" />
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="formData.password" placeholder="用户密码" />
        </el-form-item>

        <el-form-item v-if="type" label="认证状态" prop="authStatus">
          <el-input v-model="formData.authStatus" placeholder="认证状态(0-未认证，1-已认证)" />
        </el-form-item>
        <el-form-item key="authInfo" label="认证信息" prop="authInfo" align="center">
          <!-- <template #default="scope"> -->
          <el-upload
            ref="uploadRef"
            v-model="fileList"
            class="avatar-uploader"
            :action="FileAPI.myUploadUrl"
            name="image"
            :data="{ token: '1c17b11693cb5ec63859b091c5b9c1b2' }"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="imageUrl" alt="Preview Image" />
          </el-dialog>
          <!-- </template> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog(true)">取消</el-button>
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
import { UploadProps } from "element-plus";
import FileAPI from "@/api/file";
import axios from "axios";

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
const uploadRef = ref();
const fieldNames = ref(["authInfo", "deleteUrl"]);
const fileList = ref([]);
const imageUrl = ref("");
const deleteUrl = ref("");
// 图片预览器可视化与否
const dialogVisible = ref(false);

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
function handleCloseDialog(isDeleted?: boolean) {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.studentId = undefined;
  if (isDeleted) {
    handleRemove();
  }
  // 清空imageUrl、deleteUrl、上传列表
  console.log("清空imageUrl、deleteUrl、上传列表");
  imageUrl.value = "";
  deleteUrl.value = "";
  uploadRef.value.clearFiles();
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
/** 审核学生 */
function handleVerify(id: number) {
  ElMessageBox.confirm("确认审核已选中的学生用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      AppUserAPI.verify(id)
        .then(() => {
          ElMessage.success("审核成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消审核");
    }
  );
}
/** authInfo图片添加*/
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = response.url;
  deleteUrl.value = response.del;
  formData.deleteUrl = response.del;
  formData.authInfo = response.url;
};
/** 验证文件是否为图片*/
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // if (rawFile.type !== "image/jpeg/png/") {
  //   ElMessage.error("图片格式必须是JPG/png格式!");
  //   return false;
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error("图片大小不能超过2MB!");
  //   return false;
  // }
  // return true;
};
/** 处理图片预览 */
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  imageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
/** 删除图片*/
const handleRemove = () => {
  if (deleteUrl.value) {
    axios
      .get(
        deleteUrl.value.replace(import.meta.env.VITE_PIC_API_URL, import.meta.env.VITE_PIC_BASE_API)
      )
      .then((res) => {
        console.log("已清空图片" + JSON.stringify(res));
        imageUrl.value = "";
        deleteUrl.value = "";
        uploadRef.value.clearFiles();
      });
  }
};
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

.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
  border: 1px;
}

.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>

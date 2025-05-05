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
        <el-button v-hasPerm="['app:appNews:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['app:appNews:delete']"
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
        <el-table-column key="id" label="id" prop="id" min-width="60" align="center" />
        <el-table-column key="date" label="发布日期" prop="date" min-width="80" align="center" />
        <el-table-column key="title" label="标题" prop="title" min-width="150" align="center" />
        <!-- <el-table-column key="content" label="内容" prop="content" min-width="250" align="center">
          <template #default="{ row }">
            <span>
              {{ row.content.length > 30 ? row.content.slice(0, 40) + "..." : row.title }}
            </span>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template #default="scope" align="center">
            <el-button type="primary" size="small" link @click="viewDetails(scope.row)">
              <template #icon>
                <Select />
              </template>
              查看
            </el-button>
            <el-button
              v-hasPerm="['app:appNews:delete']"
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

    <!-- 校园新闻资讯表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="" prop="id">
          <el-input v-model="formData.id" placeholder="" />
        </el-form-item>

        <el-form-item label="" prop="title">
          <el-input v-model="formData.title" placeholder="" />
        </el-form-item>

        <el-form-item label="" prop="date">
          <el-input v-model="formData.date" placeholder="" />
        </el-form-item>

        <el-form-item label="" prop="content">
          <el-input v-model="formData.content" placeholder="" />
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
          <p>发布时间：{{ selectedPost?.date }}</p>
        </div>
      </div>
      <!-- 轮播图 -->
      <!-- <el-carousel
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
      </el-carousel> -->
      <div class="post-content">
        <h2>内容详情：</h2>
        <div class="rich-text" v-html="selectedPost?.content" />
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AppNews",
  inheritAttrs: false,
});

import AppNewsAPI, { AppNewsPageVO, AppNewsForm, AppNewsPageQuery } from "@/api/app/app-news";
import { dayjs } from "element-plus";
const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AppNewsPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 校园新闻资讯表格数据
const pageData = ref<AppNewsPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 审核内容弹窗
const dialogVisible = ref(false);
const selectedPost = ref<AppNewsPageVO>({});
// 查看详情
const viewDetails = (post: AppNewsPageVO) => {
  selectedPost.value = post;
  dialogVisible.value = true;
};
// 校园新闻资讯表单数据
const formData = reactive<AppNewsForm>({});

// 校园新闻资讯表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入", trigger: "blur" }],
});
// 格式化日期时间

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
/** 查询校园新闻资讯 */
function handleQuery() {
  loading.value = true;
  AppNewsAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置校园新闻资讯查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开校园新闻资讯弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改校园新闻资讯";
    AppNewsAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增校园新闻资讯";
  }
}

/** 提交校园新闻资讯表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AppNewsAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AppNewsAPI.add(formData)
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

/** 关闭校园新闻资讯弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除校园新闻资讯 */
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
      AppNewsAPI.deleteByIds(ids)
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

<style scoped lang="scss">
.rich-text {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap; /* 保留换行符 */
}

.rich-text table {
  width: 100%;
  border-collapse: collapse;
}

.rich-text th,
.rich-text td {
  padding: 6px;
  text-align: center;
  border: 1px solid #ccc;
}
</style>

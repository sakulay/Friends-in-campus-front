<template>
  <div>
    <!-- 图文列表 -->
    <el-table :data="postList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column label="图片" width="200">
        <template #default="{ row }">
          <el-carousel v-if="row.images && row.images.length > 0" height="100px">
            <el-carousel-item v-for="(image, index) in row.images" :key="index">
              <el-image :src="image" fit="cover" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="content" label="内容" min-width="300">
        <template #default="{ row }">
          <el-tooltip :content="row.content" placement="top">
            <span>
              {{ row.content.length > 30 ? row.content.slice(0, 30) + "..." : row.content }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" width="100" align="center">
        <template #default="{ row }">
          <el-button type="primary" @click="toggleLike(row)">
            <el-icon :color="row.liked ? 'red' : 'gray'">
              <i class="el-icon-thumb" />
            </el-icon>
            {{ row.likes }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="评论数" width="100" align="center" />
      <el-table-column prop="createdAt" label="发布时间" width="180" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="viewDetails(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="图文详情" width="600px">
      <h3>{{ selectedPost?.title }}</h3>
      <el-carousel v-if="selectedPost?.images && selectedPost?.images.length > 0" height="200px">
        <el-carousel-item v-for="(image, index) in selectedPost.images" :key="index">
          <el-image :src="image" fit="cover" style="width: 100%; height: 100%" />
        </el-carousel-item>
      </el-carousel>
      <p style="margin-top: 10px">{{ selectedPost?.content }}</p>
      <p>点赞数：{{ selectedPost?.likes }}</p>
      <p>评论数：{{ selectedPost?.comments }}</p>
      <p>发布时间：{{ selectedPost?.createdAt }}</p>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    // 示例数据
    const postList = ref([
      {
        id: 1,
        title: "美丽的校园",
        content: "今天拍到了学校的美丽风景，分享给大家！",
        images: [
          "https://source.unsplash.com/random/300x200?nature",
          "https://source.unsplash.com/random/300x200?campus",
        ],
        likes: 10,
        comments: 5,
        createdAt: "2025-03-01 10:00:00",
        liked: false,
      },
      {
        id: 2,
        title: "晨跑打卡",
        content: "每天晨跑，健康生活。",
        images: ["https://source.unsplash.com/random/300x200?run"],
        likes: 20,
        comments: 8,
        createdAt: "2025-03-01 08:00:00",
        liked: true,
      },
    ]);

    const dialogVisible = ref(false);
    const selectedPost = ref(null);

    // 切换点赞状态
    const toggleLike = (post) => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    };

    // 查看详情
    const viewDetails = (post) => {
      selectedPost.value = post;
      dialogVisible.value = true;
    };

    return {
      postList,
      dialogVisible,
      selectedPost,
      toggleLike,
      viewDetails,
    };
  },
};
</script>

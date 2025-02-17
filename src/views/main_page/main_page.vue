<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'

onMounted(() => {
  const dom = document.getElementById('main')
  if (dom) {
    const myChart = echarts.init(dom)
    myChart.setOption({
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    })
  }
  else {
    console.error('无法找到 #main 元素')
  }
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="card-container">
          <el-card class="box-card">
            沪深两市成交额
          </el-card>
          <el-card class="box-card">
            上涨家数
          </el-card>
          <el-card class="box-card">
            下跌家数
          </el-card>
          <el-card class="box-card">
            北向资金净流入
          </el-card>
        </div>
        <div class="card-container-main">
          <el-card>
            <template #header>
              大盘指数
            </template>
            <div id="main" class="myChart" style="width: 100%;height: 800px;" />
          </el-card>
        </div>
      </el-main>
      <el-aside width="200px">
        <el-card class="aside-card">
          <template #header>
            <div>
              <span>市场资讯</span>
            </div>
          </template>
          <div>
            <span>内容</span>
          </div>
        </el-card>
        <el-card class="aside-card">
          <div>
            <span>热门个股</span>
          </div>
          <div>
            比亚迪
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<style scoped>
.aside-card {
  display: flex;
  margin: 16px 0;
}

.card-container {
  display: flex;
  gap: 16px;
}

.card-container-main {
  margin: 17px 0;
}

.box-card {
  box-sizing: border-box;
  flex: 1 1 calc(25% - 16px);
  min-width: 0;
}
</style>

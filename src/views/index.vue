<route lang="yaml">
meta:
  title: 主页
  icon: ant-design:home-twotone
</route>

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
  <div>
    <FaPageHeader>
      <template #title>
        <div class="flex items-center gap-4">
          欢迎使用云析智雾
        </div>
      </template>
      <template #description>
        <div class="text-sm/6">
          <div>
            这是一款简单易上手的股市分析系统，它包括了一般的股市网站会拥有的简单的股市分析的内容
          </div>
          <div>
            同时提供了前沿技术来帮助用户对股市趋势进行分析
          </div>
        </div>
      </template>
    </FaPageHeader>

    <fa-page-main>
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
    </fa-page-main>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  gap: 16px;
}

.card-container-main {
  margin: 16px 0;
}

.box-card {
  box-sizing: border-box;
  flex: 1 1 calc(25% - 16px);
  min-width: 0;
}
</style>

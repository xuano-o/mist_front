<i18n lang="json">
{
  "zh-cn": {
    "uploadDragTips": "将文件拖到此处，或",
    "uploadClickTips": "点击上传",
    "tips": "上传文件支持 {ext} 格式，单个文件大小不超过 {size} MB，且文件数量不超过 {max} 个",
    "typeError": "上传文件只支持 {ext} 格式",
    "sizeError": "上传文件大小不能超过 {size} MB",
    "maxError": "上传文件数量不能超过 {max} 个"
  },
  "zh-tw": {
    "uploadDragTips": "將文件拖到此處，或",
    "uploadClickTips": "點擊上傳",
    "tips": "上傳文件支持 {ext} 格式，單個文件大小不超過 {size} MB，且文件數量不超過 {max} 個",
    "typeError": "上傳文件只支持 {ext} 格式",
    "sizeError": "上傳文件大小不能超過 {size} MB",
    "maxError": "上傳文件數量不能超過 {max} 個"
  },
  "en": {
    "uploadDragTips": "Drop files here to upload, or",
    "uploadClickTips": "click",
    "tips": "Upload files support {ext} format, single file size not exceeding {size} MB, and the number of files does not exceed {max}",
    "typeError": "Upload files only support {ext} format",
    "sizeError": "Upload file size cannot exceed {size} MB",
    "maxError": "Upload file number cannot exceed {max}"
  }
}
</i18n>

<script setup lang="ts">
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FileUpload',
})

const props = withDefaults(
  defineProps<{
    action: UploadProps['action']
    headers?: UploadProps['headers']
    data?: UploadProps['data']
    name?: UploadProps['name']
    size?: number
    max?: number
    files?: UploadUserFile[]
    notip?: boolean
    ext?: string[]
    httpRequest?: UploadProps['httpRequest']
  }>(),
  {
    name: 'file',
    size: 2,
    max: 3,
    files: () => [],
    notip: false,
    ext: () => ['zip', 'rar'],
  },
)

const emits = defineEmits<{
  onSuccess: [
    res: any,
    file: UploadUserFile,
    fileList: UploadUserFile[],
  ]
}>()

const { t } = useI18n()

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const fileName = file.name.split('.')
  const fileExt = fileName.at(-1) ?? ''
  const isTypeOk = props.ext.includes(fileExt)
  const isSizeOk = file.size / 1024 / 1024 < props.size
  if (!isTypeOk) {
    ElMessage.error(t('typeError', { ext: props.ext.join(' / ') }))
  }
  if (!isSizeOk) {
    ElMessage.error(t('sizeError', { size: props.size }))
  }
  return isTypeOk && isSizeOk
}

const onExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(t('maxError', { max: props.max }))
}

const onSuccess: UploadProps['onSuccess'] = (res, file, fileList) => {
  emits('onSuccess', res, file, fileList)
}

const onPreview: UploadProps['onPreview'] = (e) => {
  const getBlob = (url: string) => new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.send()
  })
  getBlob(e.url!).then((blob: any) => {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    const event = new MouseEvent('click')
    a.target = '_blank'
    a.download = e.name
    a.href = url
    a.dispatchEvent(event)
  })
}
</script>

<template>
  <ElUpload
    :headers="headers"
    :action="action"
    :data="data"
    :name="name"
    :before-upload="beforeUpload"
    :on-exceed="onExceed"
    :on-success="onSuccess"
    :on-preview="onPreview"
    :http-request="httpRequest"
    :file-list="files"
    :limit="max"
    drag
  >
    <div class="slot">
      <FaIcon name="i-ep:upload-filled" class="el-icon--upload" />
      <div class="el-upload__text">
        {{ t('uploadDragTips') }} <em>{{ t('uploadClickTips') }}</em>
      </div>
    </div>
    <template #tip>
      <div v-if="!notip" class="el-upload__tip">
        <div style="display: inline-block;">
          <ElAlert :title="t('tips', { ext: ext.join(' / '), size, max })" type="info" show-icon :closable="false" />
        </div>
      </div>
    </template>
  </ElUpload>
</template>

<style scoped>
:deep(.el-upload.is-drag) {
  display: inline-block;

  .el-upload-dragger {
    padding: 0;
  }

  &.is-dragover {
    border-width: 1px;
  }

  .slot {
    width: 300px;
    padding: 40px 0;
  }
}
</style>

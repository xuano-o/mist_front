<i18n lang="json">
{
  "zh-cn": {
    "accountLogin": "账号密码登录",
    "qrcodeLogin": "扫码登录",
    "intro": "请重新登录",
    "subIntro": "您的登录状态已过期",
    "wechatQrcode": "请使用微信扫码登录",
    "form": {
      "account": "用户名",
      "password": "密码 (123456)",
      "login": "登录"
    },
    "rules": {
      "account": "请输入用户名",
      "password": "请输入密码"
    }
  },
  "zh-tw": {
    "accountLogin": "帳號密碼登入",
    "qrcodeLogin": "掃碼登入",
    "intro": "請重新登入",
    "subIntro": "您的登入狀態已過期",
    "wechatQrcode": "請使用微信掃碼登入",
    "form": {
      "account": "用戶名",
      "password": "密碼 (123456)",
      "login": "登入"
    },
    "rules": {
      "account": "請輸入用戶名",
      "password": "請輸入密碼"
    }
  },
  "en": {
    "accountLogin": "Account Login",
    "qrcodeLogin": "Scan Login",
    "intro": "Please re-login",
    "subIntro": "Your login status has expired",
    "wechatQrcode": "Please use WeChat scan login",
    "form": {
      "account": "Account",
      "password": "Password (123456)",
      "login": "Login"
    },
    "rules": {
      "account": "Please enter the account",
      "password": "Please enter the password"
    }
  }
}
</i18n>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import { FormControl, FormField, FormItem, FormMessage } from '@/ui/shadcn/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as z from 'zod'

defineOptions({
  name: 'LoginAgainForm',
})

const emits = defineEmits<{
  onAfterLogin: [account?: string]
}>()

const { t } = useI18n()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const loading = ref(false)

// 登录方式，default 账号密码登录，qrcode 扫码登录
const type = ref<'default' | 'qrcode'>('default')

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    account: z.string().min(1, t('rules.account')),
    password: z.string().min(1, t('rules.password')),
  })),
  initialValues: {
    account: userStore.account,
    password: '',
  },
})
const onSubmit = form.handleSubmit((values) => {
  loading.value = true
  userStore.login(values).then(async () => {
    // 获取用户权限
    settingsStore.settings.app.enablePermission && await userStore.getPermissions()
    // 获取用户偏好设置
    settingsStore.settings.userPreferences.enable && await userStore.getPreferences()
    emits('onAfterLogin', values.account)
  }).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <div class="w-full flex-col-stretch-center p-12">
    <div class="mb-6 space-y-2">
      <h3 class="text-4xl color-[var(--el-text-color-primary)] font-bold">
        {{ t('intro') }}
      </h3>
      <p class="text-sm text-muted-foreground lg:text-base">
        {{ t('subIntro') }}
      </p>
    </div>
    <div class="mb-4">
      <FaTabs
        v-model="type" :list="[
          { label: t('accountLogin'), value: 'default' },
          { label: t('qrcodeLogin'), value: 'qrcode' },
        ]" class="inline-flex"
      />
    </div>
    <div v-show="type === 'default'">
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField, errors }" name="account">
          <FormItem class="relative pb-6 space-y-0">
            <FormControl>
              <FaInput type="text" :placeholder="t('form.account')" disabled class="w-full" :class="errors.length && 'border-destructive'" v-bind="componentField" />
            </FormControl>
            <Transition enter-active-class="transition-opacity" enter-from-class="opacity-0" leave-active-class="transition-opacity" leave-to-class="opacity-0">
              <FormMessage class="absolute bottom-1 text-xs" />
            </Transition>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="password">
          <FormItem class="relative pb-6 space-y-0">
            <FormControl>
              <FaInput type="password" :placeholder="t('form.password')" class="w-full" :class="errors.length && 'border-destructive'" v-bind="componentField" />
            </FormControl>
            <Transition enter-active-class="transition-opacity" enter-from-class="opacity-0" leave-active-class="transition-opacity" leave-to-class="opacity-0">
              <FormMessage class="absolute bottom-1 text-xs" />
            </Transition>
          </FormItem>
        </FormField>
        <FaButton :loading="loading" size="lg" class="mt-8 w-full" type="submit">
          {{ t('form.login') }}
        </FaButton>
      </form>
    </div>
    <div v-show="type === 'qrcode'">
      <div class="flex-col-center">
        <img src="https://s2.loli.net/2024/04/26/GsahtuIZ9XOg5jr.png" class="h-[250px] w-[250px]">
        <div class="mt-2 text-sm text-secondary-foreground op-50">
          {{ t('wechatQrcode') }}
        </div>
      </div>
    </div>
  </div>
</template>

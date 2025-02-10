<i18n lang="json">
{
  "zh-cn": {
    "intro": "探索从这里开始 🚀",
    "hasAccount": "已经有帐号?",
    "login": "去登录",
    "form": {
      "account": "用户名",
      "captcha": "验证码",
      "sendCaptcha": "发送验证码",
      "password": "密码",
      "checkPassword": "确认密码",
      "register": "注册"
    },
    "rules": {
      "account": "请输入用户名",
      "captcha": "请输入验证码",
      "password": "请输入密码",
      "passwordLength": "密码长度为6到18位",
      "checkPassword": "请再次输入密码",
      "checkPasswordError": "两次输入的密码不一致"
    }
  },
  "zh-tw": {
    "intro": "探索從這裡開始 🚀",
    "hasAccount": "已有帳號?",
    "login": "去登入",
    "form": {
      "account": "用戶名",
      "captcha": "驗證碼",
      "sendCaptcha": "發送驗證碼",
      "password": "密碼",
      "checkPassword": "確認密碼",
      "register": "註冊"
    },
    "rules": {
      "account": "請輸入用戶名",
      "captcha": "請輸入驗證碼",
      "password": "請輸入密碼",
      "passwordLength": "密碼長度為6到18位",
      "checkPassword": "請再次輸入密碼",
      "checkPasswordError": "兩次輸入的密碼不一致"
    }
  },
  "en": {
    "intro": "Explore from here 🚀",
    "hasAccount": "Already have an account?",
    "login": "Login",
    "form": {
      "account": "Account",
      "captcha": "Captcha",
      "sendCaptcha": "Send Captcha",
      "password": "Password",
      "checkPassword": "Check Password",
      "register": "Register"
    },
    "rules": {
      "account": "Please enter an account",
      "captcha": "Please enter a captcha",
      "password": "Please enter a password",
      "passwordLength": "Password length is 6 to 18 bits",
      "checkPassword": "Please enter the password again",
      "checkPasswordError": "The two passwords entered are inconsistent"
    }
  }
}
</i18n>

<script setup lang="ts">
import { FormControl, FormField, FormItem, FormMessage } from '@/ui/shadcn/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as z from 'zod'

defineOptions({
  name: 'RegisterForm',
})

const props = defineProps<{
  account?: string
}>()

const emits = defineEmits<{
  onLogin: [account?: string]
  onRegister: [account?: string]
}>()

const { t } = useI18n()

const loading = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      account: z.string().min(1, t('rules.account')),
      captcha: z.string().min(6, t('rules.captcha')),
      password: z.string().min(1, t('rules.password')).min(6, t('rules.passwordLength')).max(18, t('rules.passwordLength')),
      checkPassword: z.string().min(1, t('rules.checkPassword')),
    }).refine(data => data.password === data.checkPassword, {
      message: t('rules.checkPasswordError'),
      path: ['checkPassword'],
    }),
  ),
  initialValues: {
    account: props.account ?? '',
    captcha: '',
    password: '',
    checkPassword: '',
  },
})
const onSubmit = form.handleSubmit((values) => {
  loading.value = true
  emits('onRegister', values.account)
})
</script>

<template>
  <div class="min-h-500px w-full flex-col-stretch-center p-12">
    <form @submit="onSubmit">
      <div class="mb-8 space-y-2">
        <h3 class="text-4xl color-[var(--el-text-color-primary)] font-bold">
          {{ t('intro') }}
        </h3>
        <p class="text-sm text-muted-foreground lg:text-base">
          演示系统未提供该功能
        </p>
      </div>
      <FormField v-slot="{ componentField, errors }" name="account">
        <FormItem class="relative pb-6 space-y-0">
          <FormControl>
            <FaInput type="text" :placeholder="t('form.account')" class="w-full" :class="errors.length && 'border-destructive'" v-bind="componentField" />
          </FormControl>
          <Transition enter-active-class="transition-opacity" enter-from-class="opacity-0" leave-active-class="transition-opacity" leave-to-class="opacity-0">
            <FormMessage class="absolute bottom-1 text-xs" />
          </Transition>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField, value, errors }" name="password">
        <FormItem class="relative pb-6 space-y-0">
          <FormControl>
            <FaInput type="password" :placeholder="t('form.password')" class="w-full" :class="errors.length && 'border-destructive'" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            <FaPasswordStrength :password="value" class="mt-2" />
          </FormDescription>
          <Transition enter-active-class="transition-opacity" enter-from-class="opacity-0" leave-active-class="transition-opacity" leave-to-class="opacity-0">
            <FormMessage class="absolute bottom-1 text-xs" />
          </Transition>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField, errors }" name="checkPassword">
        <FormItem class="relative pb-6 space-y-0">
          <FormControl>
            <FaInput type="password" :placeholder="t('form.checkPassword')" class="w-full" :class="errors.length && 'border-destructive'" v-bind="componentField" />
          </FormControl>
          <Transition enter-active-class="transition-opacity" enter-from-class="opacity-0" leave-active-class="transition-opacity" leave-to-class="opacity-0">
            <FormMessage class="absolute bottom-1 text-xs" />
          </Transition>
        </FormItem>
      </FormField>
      <FaButton :loading="loading" size="lg" class="mt-4 w-full" type="submit">
        {{ t('form.register') }}
      </FaButton>
      <div class="mt-4 flex-center gap-2 text-sm">
        <span class="text-secondary-foreground op-50">{{ t('hasAccount') }}</span>
        <FaButton variant="link" class="h-auto p-0" @click="emits('onLogin', form.values.account)">
          {{ t('login') }}
        </FaButton>
      </div>
    </form>
  </div>
</template>

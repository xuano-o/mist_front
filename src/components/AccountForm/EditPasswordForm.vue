<i18n lang="json">
{
  "zh-cn": {
    "intro": "修改密码",
    "subIntro": "请输入原密码、新密码和确认密码",
    "form": {
      "password": "原密码",
      "newPassword": "新密码",
      "checkPassword": "确认密码",
      "save": "保存"
    },
    "rules": {
      "password": "请输入原密码",
      "newPassword": "请输入新密码",
      "passwordLength": "密码长度为6到18位",
      "checkPassword": "请确认新密码",
      "checkPasswordError": "两次输入的密码不一致"
    }
  },
  "zh-tw": {
    "intro": "修改密碼",
    "subIntro": "請輸入原密碼、新密碼和確認密碼",
    "form": {
      "password": "原密碼",
      "newPassword": "新密碼",
      "checkPassword": "確認新密碼",
      "save": "保存"
    },
    "rules": {
      "password": "請輸入原密碼",
      "newPassword": "請輸入新密碼",
      "passwordLength": "密碼長度為6到18位",
      "checkPassword": "請確認新密碼",
      "checkPasswordError": "兩次輸入的密碼不一致"
    }
  },
  "en": {
    "intro": "Modify Password",
    "subIntro": "Please enter the original password, new password and confirm password",
    "form": {
      "password": "Original Password",
      "newPassword": "New Password",
      "checkPassword": "Confirm New Password",
      "save": "Save"
    },
    "rules": {
      "password": "Please enter the original password",
      "newPassword": "Please enter the new password",
      "passwordLength": "Password length is 6 to 18 characters",
      "checkPassword": "Please confirm the new password",
      "checkPasswordError": "The two passwords do not match"
    }
  }
}
</i18n>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { FormControl, FormField, FormItem, FormMessage } from '@/ui/shadcn/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import * as z from 'zod'

defineOptions({
  name: 'EditPasswordForm',
})

const { t } = useI18n()
const userStore = useUserStore()

const loading = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      password: z.string().min(1, t('rules.password')),
      newPassword: z.string().min(1, t('rules.newPassword')).min(6, t('rules.passwordLength')).max(18, t('rules.passwordLength')),
      checkPassword: z.string().min(1, t('rules.checkPassword')),
    }).refine(data => data.newPassword === data.checkPassword, {
      message: t('rules.checkPasswordError'),
      path: ['checkPassword'],
    }),
  ),
  initialValues: {
    password: '',
    newPassword: '',
    checkPassword: '',
  },
})
const onSubmit = form.handleSubmit((values) => {
  loading.value = true
  userStore.editPassword(values).then(async () => {
    toast.success('模拟修改成功，请重新登录')
    userStore.logout()
  }).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <div class="w-full flex-col-stretch-center">
    <div class="mb-6 space-y-2">
      <h3 class="text-4xl color-[var(--el-text-color-primary)] font-bold">
        {{ t('intro') }}
      </h3>
      <p class="text-sm text-muted-foreground lg:text-base">
        {{ t('subIntro') }}
      </p>
    </div>
    <form @submit="onSubmit">
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
      <FormField v-slot="{ componentField, errors }" name="newPassword">
        <FormItem class="relative pb-6 space-y-0">
          <FormControl>
            <FaInput type="password" :placeholder="t('form.newPassword')" class="w-full" :class="errors.length && 'border-destructive'" v-bind="componentField" />
          </FormControl>
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
      <FaButton :loading="loading" size="lg" class="mt-8 w-full" type="submit">
        {{ t('form.save') }}
      </FaButton>
    </form>
  </div>
</template>

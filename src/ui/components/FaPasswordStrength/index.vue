<i18n lang="yaml">
zh-cn:
  tips: 建议
  hasLength: 长度至少为8个字符
  hasUppercase: 包含大写字母
  hasLowercase: 包含小写字母
  hasNumber: 包含数字
  hasSpecialChar: 包含特殊字符
zh-tw:
  tips: 建議
  hasLength: 長度至少為8個字符
  hasUppercase: 包含大寫字母
  hasLowercase: 包含小寫字母
  hasNumber: 包含數字
  hasSpecialChar: 包含特殊字符
en:
  tips: Suggestion
  hasLength: At least 8 characters
  hasUppercase: Contains uppercase letters
  hasLowercase: Contains lowercase letters
  hasNumber: Contains numbers
  hasSpecialChar: Contains special characters
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FaPasswordStrength',
})

const props = withDefaults(
  defineProps<{
    password?: string
  }>(),
  {
    password: '',
  },
)

const { t } = useI18n()

const maxStrength = 5

const hasLength = computed(() => props.password.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(props.password))
const hasLowercase = computed(() => /[a-z]/.test(props.password))
const hasNumber = computed(() => /\d/.test(props.password))
const hasSpecialChar = computed(() => /[^A-Z0-9]/i.test(props.password))

const strength = computed(() => {
  let score = 0
  if (hasLength.value) {
    score++
  }
  if (hasUppercase.value) {
    score++
  }
  if (hasLowercase.value) {
    score++
  }
  if (hasNumber.value) {
    score++
  }
  if (hasSpecialChar.value) {
    score++
  }
  return score
})

const strengthColor = computed(() => {
  if (strength.value === 0) {
    return 'bg-red-500'
  }
  if (strength.value < 3) {
    return 'bg-orange-500'
  }
  if (strength.value < 5) {
    return 'bg-yellow-500'
  }
  return 'bg-green-500'
})
</script>

<template>
  <div class="w-full flex-center gap-2">
    <div class="h-2 flex-1 overflow-hidden rounded-full bg-border">
      <div
        :class="strengthColor"
        :style="{ width: `${(strength / maxStrength) * 100}%` }"
        class="h-full transition-all duration-300 ease-out"
      />
    </div>
    <FaTooltip>
      <FaIcon name="i-ri:question-line" class="cursor-help text-sm text-muted-foreground" />
      <template #content>
        <div class="py-1">
          <div class="mb-1 text-sm text-muted-foreground">
            {{ t('tips') }}
          </div>
          <ul class="text-sm text-muted-foreground space-y-1">
            <li class="flex-center-start gap-1" :class="{ 'text-green-600': hasLength }">
              <FaIcon :name="hasLength ? 'i-carbon:checkmark' : 'i-carbon:close'" />
              {{ t('hasLength') }}
            </li>
            <li class="flex-center-start gap-1" :class="{ 'text-green-600': hasUppercase }">
              <FaIcon :name="hasUppercase ? 'i-carbon:checkmark' : 'i-carbon:close'" />
              {{ t('hasUppercase') }}
            </li>
            <li class="flex-center-start gap-1" :class="{ 'text-green-600': hasLowercase }">
              <FaIcon :name="hasLowercase ? 'i-carbon:checkmark' : 'i-carbon:close'" />
              {{ t('hasLowercase') }}
            </li>
            <li class="flex-center-start gap-1" :class="{ 'text-green-600': hasNumber }">
              <FaIcon :name="hasNumber ? 'i-carbon:checkmark' : 'i-carbon:close'" />
              {{ t('hasNumber') }}
            </li>
            <li class="flex-center-start gap-1" :class="{ 'text-green-600': hasSpecialChar }">
              <FaIcon :name="hasSpecialChar ? 'i-carbon:checkmark' : 'i-carbon:close'" />
              {{ t('hasSpecialChar') }}
            </li>
          </ul>
        </div>
      </template>
    </FaTooltip>
  </div>
</template>

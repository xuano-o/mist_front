import type { App, DirectiveBinding } from 'vue'
import mediumZoom from 'medium-zoom'

export default function directive(app: App) {
  app.directive('auth', (el: HTMLElement, binding: DirectiveBinding) => {
    watch(() => binding.modifiers.all ? useAuth().authAll(binding.value) : useAuth().auth(binding.value), (val) => {
      el.style.display = val ? '' : 'none'
    }, {
      immediate: true,
    })
  })
  // 注册 medium-zoom 指令
  app.directive('zoomable', (el: HTMLElement) => {
    mediumZoom(el, {
      background: 'var(--g-main-area-bg)',
    })
  })
}

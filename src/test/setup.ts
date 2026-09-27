import { config } from '@vue/test-utils'

/**
 * Vue Test Utils replaces `<transition>` with a stub that renders none of its
 * children. naive-ui wraps collapsible and popover content in transitions, so
 * with the default stub in place that content is absent from the DOM and tests
 * cannot see it. Rendering transitions for real keeps assertions honest about
 * what a user would actually find on the page.
 */
config.global.stubs = {
  transition: false,
  'transition-group': false
}

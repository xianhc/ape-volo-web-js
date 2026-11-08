import { shallowRef } from 'vue'
export function useMutationAction(execute) {
  const pending = shallowRef(false)
  const error = shallowRef(null)
  const run = async (input) => {
    if (pending.value) return false
    pending.value = true
    error.value = null
    try {
      return (await execute(input)) !== false
    } catch (cause) {
      error.value = cause
      return false
    } finally {
      pending.value = false
    }
  }
  return { pending, error, run }
}

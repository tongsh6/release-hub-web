import { useUserStore } from '@/stores/user'

export function hasPerm(required?: string): boolean {
  if (!required) return true
  try {
    const userStore = useUserStore()
    return userStore.hasPermission(required)
  } catch (e) {
    // Fallback or safe fail if Pinia not ready
    return false
  }
}

import { ref } from 'vue'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  const toast = ({
    title,
    description,
    variant = 'default',
    duration = 3000,
  }: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
    }

    toasts.value.push(newToast)

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  const dismiss = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, description?: string) => {
    return toast({ title, description, variant: 'success' })
  }

  const error = (title: string, description?: string) => {
    return toast({ title, description, variant: 'error' })
  }

  const warning = (title: string, description?: string) => {
    return toast({ title, description, variant: 'warning' })
  }

  return {
    toast,
    toasts,
    dismiss,
    success,
    error,
    warning,
  }
}

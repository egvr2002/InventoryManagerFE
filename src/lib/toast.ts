import {toast as sonnerToast} from "sonner";

interface ToastOptions {
  description?: string;
}

interface Toast {
  success: (message: string, options?: ToastOptions) => string | number;
  error: (message: string, options?: ToastOptions) => string | number;
  loading: (message: string, options?: ToastOptions) => string | number;
  dismiss: (id: string | number) => string | number;
}

export const toast: Toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, options),

  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, options),

  loading: (message: string, options?: ToastOptions) =>
    sonnerToast.loading(message, options),

  dismiss: (id: string | number) => sonnerToast.dismiss(id),
};

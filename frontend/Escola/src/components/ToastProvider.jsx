import { Toast } from "primereact/toast";
import { createContext, useContext, useCallback, useRef } from "react";

const fallbackToast = {
  show: (msg) => {
    console.warn("ToastProvider não está disponível:", msg);
  },
};

const ToastContext = createContext(fallbackToast);

export const useToast = () => useContext(ToastContext) || fallbackToast;

export function ToastProvider({ children }) {
  const toast = useRef(null);

  const show = useCallback((msg) => {
    if (!toast.current) {
      console.warn("Toast ainda não está pronto:", msg);
      return;
    }

    toast.current.show(msg);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}

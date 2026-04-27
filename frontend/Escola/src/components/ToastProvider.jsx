import { Toast } from "primereact/toast";
import { createContext, useContext, useRef } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const toast = useRef();

  const show = (msg) => {
    toast.current.show(msg);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}
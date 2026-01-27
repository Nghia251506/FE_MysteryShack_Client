"use client"; // 👈 BẮT BUỘC: Dòng này báo hiệu đây là Client Component

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store"; // Import store bạn đã tạo ở bước trước

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
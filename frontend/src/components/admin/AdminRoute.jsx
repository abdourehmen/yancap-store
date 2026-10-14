import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  // التحقق من حالة تسجيل الدخول من الـ localStorage
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  // إذا لم يكن المشرف مسجلاً للدخول، يتم توجيهه لصفحة تسجيل الدخول
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // إذا كان مسجلاً، اظهر له محتوى لوحة التحكم
  return children;
}
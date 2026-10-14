import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import './AdminLogin.css'; // أو يمكنك دمج التنسيقات في ملف CSS عام

export default function AdminLogin({ lang = 'ar' }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const handleLogin = (e) => {
    e.preventDefault();
    
    // يمكنك تعديل اسم المستخدم وكلمة المرور الخاصة بك هنا
    // مثال: 
    // اسم المستخدم: admin
    // كلمة المرور: 123456 (أو أي كلمة مرور سرية تفضلها)
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard'); // توجيه لصفحة لوحة التحكم
    } else {
      setError(isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <div className="admin-login-header">
          <div className="admin-shield-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>{isAr ? 'لوحة تحكم المشرف' : 'Admin Dashboard'}</h2>
          <p>{isAr ? 'يرجى تسجيل الدخول للمتابعة' : 'Please sign in to continue'}</p>
        </div>

        {error && <div className="admin-error-msg">{error}</div>}

        <div className="admin-input-group">
          <label>{isAr ? 'اسم المستخدم' : 'Username'}</label>
          <div className="input-with-icon">
            <User size={18} />
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder={isAr ? 'أدخل اسم المستخدم' : 'Enter username'} 
              required 
            />
          </div>
        </div>

        <div className="admin-input-group">
          <label>{isAr ? 'كلمة المرور' : 'Password'}</label>
          <div className="input-with-icon">
            <Lock size={18} />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="admin-login-btn">
          {isAr ? 'تسجيل الدخول' : 'Login'}
        </button>
      </form>
    </div>
  );
}
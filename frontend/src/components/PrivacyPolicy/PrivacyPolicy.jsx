import React from 'react';
import './PrivacyPolicy.css'; // ملف التنسيق الخاص بها

export default function PrivacyPolicy({ lang }) {
  const isAr = lang === 'ar'; // 🟢 تعريف متغير اللغة هنا ليعمل الكود بسلاسة

  return (
    <div className="privacy-page-container">
      <div className="privacy-content">
        <h1>{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</h1>
        <p className="last-updated">
          {isAr ? "آخر تحديث: سبتمبر 2026" : "Last updated: September 2026"}
        </p>

        <section>
          <h2>{isAr ? "1. جمع المعلومات" : "1. Information We Collect"}</h2>
          <p>
            {isAr 
              ? "نحن نجمع المعلومات التي تقدمها لنا مباشرة عند إتمام الطلب مثل الاسم، رقم الهاتف، وعنوان الشحن لتوصيل طلباتك بنجاح عبر Yancap.dz."
              : "We collect information you provide directly when placing an order, such as your name, phone number, and shipping address to fulfill your orders via Yancap.dz."}
          </p>
        </section>

        <section>
          <h2>{isAr ? "2. استخدام البيانات" : "2. How We Use Your Data"}</h2>
          <p>
            {isAr 
              ? "تُستخدم بياناتك حصرياً لتأكيد الطلبات، معالجة الشحنات، والتواصل معك في حال احتجنا لتحديثات حول طلبك. نحن لا نشارك بياناتك مع أي طرف ثالث."
              : "Your data is used exclusively to confirm orders, process shipments, and contact you if we need updates regarding your order. We never share your data with third parties."}
          </p>
        </section>

        <section>
          <h2>{isAr ? "3. أمان البيانات" : "3. Data Security"}</h2>
          <p>
            {isAr 
              ? "نحن نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية باستخدام قواعد بيانات آمنة ومشفرة ."
              : "We take strict security measures to protect your personal information using secure and encrypted databases ."}
          </p>
        </section>
      </div>
    </div>
  );
}
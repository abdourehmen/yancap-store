import React from 'react';

export default function PrivacyCentre({ lang }) {
  const isAr = lang === 'ar';

  return (
    <div className="privacy-page-container">
      <div className="privacy-content">
        <h1>{isAr ? "مركز الخصوصية" : "Privacy Centre"}</h1>
        <p className="last-updated">
          {isAr ? "إدارة وتحكم في بياناتك بكل سهولة وأمان عبر Yancap.dz" : "Manage and control your data easily and securely via Yancap.dz"}
        </p>

        <section>
          <h2>{isAr ? "1. الشفافية والتحكم" : "1. Transparency & Control"}</h2>
          <p>
            {isAr 
              ? "في Yancap.dz، نؤمن بأحقيتك الكاملة في معرفة كيف يتم التعامل مع بياناتك الشخصية. يمكنك في أي وقت طلب مراجعة أو تحديث بياناتك المسجلة لدينا."
              : "At Yancap.dz, we believe in your complete right to know how your personal data is handled. You can request to review or update your data at any time."}
          </p>
        </section>

        <section>
          <h2>{isAr ? "2. حماية الخصوصية والأمان" : "2. Privacy & Security Protection"}</h2>
          <p>
            {isAr 
              ? "نحن نطبق إجراءات تقنية وتنظيمية مشددة لمنع أي وصول غير مرغوب فيه إلى معلوماتك، ونضمن عدم بيعها أو مشاركتها مع أي جهات خارجية نهائياً."
              : "We apply strict technical and organizational measures to prevent unauthorized access to your information, ensuring it is never sold or shared with external parties."}
          </p>
        </section>

        <section>
          <h2>{isAr ? "3. تواصل معنا" : "3. Contact Us"}</h2>
          <p>
            {isAr 
              ? "إذا كان لديك أي استفسار بخصوص خصوصية بياناتك أو طلب لحذفها، يمكنك التواصل معنا مباشرة عبر وسائل الاتصال المتاحة في المتجر."
              : "If you have any questions regarding your data privacy or wish to request its deletion, you can contact us directly via the store's support channels."}
          </p>
        </section>
      </div>
    </div>
  );
}
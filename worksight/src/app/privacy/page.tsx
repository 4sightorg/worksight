import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br">
      <div className="flex flex-col items-center px-4 text-center">
        <h1 className="text-primary text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed font-normal">
          At WorkSight, we value your privacy and are committed to protecting your personal
          information. This Privacy Policy outlines how we collect, use, and safeguard your data
          when you use our application.
        </p>

        <h2 className="mt-8 text-lg font-semibold">1. Information We Collect</h2>
        <p className="text-muted-foreground mt-2">
          We may collect personal information such as your name, email address, and usage data when
          you register or interact with our services.
        </p>

        <h2 className="mt-8 text-lg font-semibold">2. How We Use Your Information</h2>
        <p className="text-muted-foreground mt-2">
          Your information is used to provide and improve our services, communicate with you, and
          personalize your experience.
        </p>

        <h2 className="mt-8 text-lg font-semibold">3. Data Sharing</h2>
        <p className="text-muted-foreground mt-2">
          We do not sell or rent your personal information to third parties. We may share your data
          with trusted partners to help us operate our services, subject to strict confidentiality
          agreements.
        </p>

        <h2 className="mt-8 text-lg font-semibold">4. Cookies</h2>
        <p className="text-muted-foreground mt-2">
          We use cookies to enhance your experience on our site. You can choose to accept or decline
          cookies through your browser settings.
        </p>

        <h2 className="mt-8 text-lg font-semibold">5. Your Rights</h2>
        <p className="text-muted-foreground mt-2">
          You have the right to access, correct, or delete your personal information. If you have
          any questions or requests regarding your data, please contact us.
        </p>

        <h2 className="mt-8 text-lg font-semibold">6. Changes to This Policy</h2>
        <p className="text-muted-foreground mt-2">
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new policy on this page.
        </p>

        <h2 className="mt-8 text-lg font-semibold">7. Contact Us</h2>
        <p className="text-muted-foreground mt-2">
          If you have any questions about this Privacy Policy, please contact us at
          support@worksight.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

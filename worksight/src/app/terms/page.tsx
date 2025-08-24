import React from 'react';

const TermsOfService = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Terms of Service</h1>
        <p className="mb-4">
          Welcome to WorkSight! These Terms of Service outline the rules and guidelines for using
          our application. By accessing or using WorkSight, you agree to comply with these terms.
        </p>

        <h2 className="mt-4 text-xl font-semibold">1. User Responsibilities</h2>
        <p className="mb-4">
          Users are responsible for maintaining the confidentiality of their account information and
          for all activities that occur under their account. You agree to notify us immediately of
          any unauthorized use of your account.
        </p>

        <h2 className="mt-4 text-xl font-semibold">2. Limitations of Liability</h2>
        <p className="mb-4">
          WorkSight is not liable for any direct, indirect, incidental, or consequential damages
          arising from your use of the application. We do not guarantee the accuracy or reliability
          of any information provided.
        </p>

        <h2 className="mt-4 text-xl font-semibold">3. Legal Disclaimers</h2>
        <p className="mb-4">
          We reserve the right to modify or terminate the service for any reason, without notice. We
          may also update these Terms of Service from time to time, and your continued use of the
          service constitutes acceptance of those changes.
        </p>

        <h2 className="mt-4 text-xl font-semibold">4. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of the jurisdiction in which WorkSight operates. Any
          disputes arising from these terms will be resolved in the appropriate courts of that
          jurisdiction.
        </p>

        <h2 className="mt-4 text-xl font-semibold">5. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at
          support@worksight.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;

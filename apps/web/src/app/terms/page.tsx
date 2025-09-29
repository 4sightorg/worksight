'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-primary mb-4 text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Please read these terms carefully before using WorkSight
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                By accessing and using WorkSight (&quot;the Service&quot;), you accept and agree to
                be bound by the terms and provision of this agreement. If you do not agree to abide
                by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                WorkSight is a personal dashboard application designed to monitor burnout levels and
                foster well-being in the workplace. The service provides analytics, insights, and
                tools to help users track and improve their work-life balance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <ul>
                <li>Provide accurate and complete information when creating your account</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Use the service in compliance with all applicable laws and regulations</li>
                <li>Not attempt to gain unauthorized access to any part of the service</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Your privacy is important to us. We collect and use your personal information in
                accordance with our Privacy Policy. By using WorkSight, you consent to the
                collection and use of your information as outlined in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                The WorkSight service and its original content, features, and functionality are and
                will remain the exclusive property of 4sight Organization and its licensors. The
                service is protected by copyright, trademark, and other laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We strive to provide reliable service but cannot guarantee 100% uptime. We reserve
                the right to modify, suspend, or discontinue the service at any time with reasonable
                notice to users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                WorkSight is provided &quot;as is&quot; without any warranty, express or implied. We
                shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We may terminate or suspend your account and access to the service immediately,
                without prior notice or liability, for any reason whatsoever, including without
                limitation if you breach the Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any
                material changes via email or through the service. Your continued use of the service
                after such modifications constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. End User License Agreement (EULA)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                WorkSight grants you a limited, non-exclusive, non-transferable license to use our
                software application subject to these terms. You may not:
              </p>
              <ul>
                <li>Copy, modify, or distribute the software</li>
                <li>Reverse engineer, decompile, or disassemble the software</li>
                <li>Use the software for any commercial purpose without authorization</li>
                <li>Remove or alter any proprietary notices or labels</li>
                <li>Transfer your license to another party</li>
              </ul>
              <p>This license terminates automatically if you violate any of these restrictions.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. GDPR Compliance</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                For users in the European Union, we comply with the General Data Protection
                Regulation (GDPR). You have the following rights:
              </p>
              <ul>
                <li>
                  <strong>Right to be informed:</strong> Clear information about data processing
                </li>
                <li>
                  <strong>Right of access:</strong> Request copies of your personal data
                </li>
                <li>
                  <strong>Right to rectification:</strong> Correct inaccurate or incomplete data
                </li>
                <li>
                  <strong>Right to erasure:</strong> Request deletion of your personal data
                </li>
                <li>
                  <strong>Right to restrict processing:</strong> Limit how we use your data
                </li>
                <li>
                  <strong>Right to data portability:</strong> Receive your data in a structured
                  format
                </li>
                <li>
                  <strong>Right to object:</strong> Object to processing based on legitimate
                  interests
                </li>
              </ul>
              <p>To exercise these rights, contact our Data Protection Officer at dpo@4sight.org</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. California Privacy Rights (CCPA)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                California residents have additional rights under the California Consumer Privacy
                Act (CCPA):
              </p>
              <ul>
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to say no to the sale of personal information</li>
                <li>Right to access personal information</li>
                <li>Right to delete personal information</li>
                <li>Right to equal service and price</li>
              </ul>
              <p>We do not sell personal information to third parties.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We are committed to ensuring WorkSight is accessible to users with disabilities. We
                strive to comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                standards. If you encounter accessibility barriers, please contact us at
                accessibility@4sight.org
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Force Majeure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We shall not be liable for any failure to perform our obligations due to
                circumstances beyond our reasonable control, including but not limited to acts of
                God, natural disasters, war, terrorism, strikes, or government actions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Governing Law and Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your
                Jurisdiction]. Any disputes arising from these Terms or your use of WorkSight shall
                be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>16. Severability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that
                provision shall be limited or eliminated to the minimum extent necessary so that
                these Terms shall otherwise remain in full force and effect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>17. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <ul>
                <li>Email: legal@4sight.org</li>
                <li>GDPR/Data Protection: dpo@4sight.org</li>
                <li>Accessibility: accessibility@4sight.org</li>
                <li>General Support: support@4sight.org</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">Last updated: August 24, 2025</p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/';
                }
              }}
            >
              Back to Previous Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

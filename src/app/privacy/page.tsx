'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-primary mb-4 text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            We are committed to protecting your privacy and personal information
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h4>Personal Information</h4>
              <ul>
                <li>Name and email address when you create an account</li>
                <li>Profile information you choose to provide</li>
                <li>Communication preferences and settings</li>
              </ul>

              <h4>Usage Data</h4>
              <ul>
                <li>How you interact with WorkSight features</li>
                <li>Time spent using the application</li>
                <li>Feature usage patterns and preferences</li>
                <li>Device and browser information</li>
              </ul>

              <h4>Well-being Data</h4>
              <ul>
                <li>Self-reported stress levels and mood indicators</li>
                <li>Work schedule and break patterns</li>
                <li>Burnout assessment responses</li>
                <li>Goal setting and achievement data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <ul>
                <li>
                  <strong>Service Provision:</strong> To provide and maintain the WorkSight
                  dashboard
                </li>
                <li>
                  <strong>Personalization:</strong> To customize your experience and provide
                  relevant insights
                </li>
                <li>
                  <strong>Analytics:</strong> To generate burnout risk assessments and well-being
                  trends
                </li>
                <li>
                  <strong>Communication:</strong> To send important updates and optional
                  notifications
                </li>
                <li>
                  <strong>Improvement:</strong> To enhance our service features and user experience
                </li>
                <li>
                  <strong>Support:</strong> To provide customer support and respond to inquiries
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                <strong>We do not sell your personal information.</strong>
              </p>

              <p>We may share your information only in the following circumstances:</p>
              <ul>
                <li>
                  <strong>With your consent:</strong> When you explicitly authorize us to share
                  specific information
                </li>
                <li>
                  <strong>Service providers:</strong> With trusted third-party services that help us
                  operate WorkSight
                </li>
                <li>
                  <strong>Legal requirements:</strong> When required by law or to protect our legal
                  rights
                </li>
                <li>
                  <strong>Aggregated data:</strong> Anonymous, aggregated statistics that cannot
                  identify individuals
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>We implement robust security measures to protect your information:</p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure hosting infrastructure with industry-standard protections</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal data
                </li>
                <li>
                  <strong>Portability:</strong> Export your data in a machine-readable format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your information
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of data processing
                </li>
              </ul>
              <p>To exercise these rights, contact us at privacy@4sight.org</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Authenticate your login sessions</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Provide personalized content and features</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>We retain your information for as long as necessary to:</p>
              <ul>
                <li>Provide you with WorkSight services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <p>
                When you delete your account, we will remove your personal information within 30
                days, except where retention is required by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                WorkSight is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13. If we become aware that we have
                collected such information, we will take steps to delete it promptly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Your information may be transferred to and processed in countries other than your
                own. We ensure appropriate safeguards are in place to protect your information
                during such transfers, including standard contractual clauses and adequacy
                decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting the new policy on this page and updating the "Last
                updated" date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. GDPR Compliance (EU Users)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h4>Legal Basis for Processing</h4>
              <ul>
                <li>
                  <strong>Consent:</strong> For optional features and marketing communications
                </li>
                <li>
                  <strong>Contract:</strong> To provide WorkSight services you've signed up for
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> For service improvement and security
                </li>
                <li>
                  <strong>Legal Obligation:</strong> For compliance with applicable laws
                </li>
              </ul>

              <h4>Data Subject Rights</h4>
              <ul>
                <li>
                  <strong>Right to withdraw consent:</strong> Withdraw consent at any time
                </li>
                <li>
                  <strong>Right to lodge a complaint:</strong> Contact your local supervisory
                  authority
                </li>
                <li>
                  <strong>Right not to be subject to automated decision-making:</strong> Including
                  profiling
                </li>
              </ul>

              <h4>Data Protection Officer</h4>
              <p>
                For GDPR-related inquiries, contact our Data Protection Officer at dpo@4sight.org
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. California Privacy Rights (CCPA/CPRA)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                California residents have additional rights under the California Consumer Privacy
                Act:
              </p>

              <h4>Categories of Personal Information We Collect</h4>
              <ul>
                <li>Identifiers (name, email, account ID)</li>
                <li>Personal information (as defined in Cal. Civ. Code § 1798.80)</li>
                <li>Internet or network activity information</li>
                <li>Sensory data (if you provide audio/video feedback)</li>
                <li>Professional or employment-related information</li>
              </ul>

              <h4>Your Rights</h4>
              <ul>
                <li>Right to know about personal information collected, used, or shared</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of sale (we don't sell your information)</li>
                <li>Right to non-discrimination for exercising your rights</li>
                <li>Right to correct inaccurate personal information</li>
                <li>Right to limit use of sensitive personal information</li>
              </ul>

              <p>To exercise these rights, contact us at privacy@4sight.org</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Sensitive Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>WorkSight may collect sensitive personal information including:</p>
              <ul>
                <li>Health and wellness data (stress levels, burnout indicators)</li>
                <li>Information about mental health and well-being</li>
                <li>Work performance and productivity metrics</li>
              </ul>
              <p>
                This information is used solely to provide personalized well-being insights and is
                protected with enhanced security measures. You can limit the collection of sensitive
                information through your account settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Automated Decision-Making and Profiling</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                WorkSight uses automated processing to provide burnout risk assessments and
                personalized recommendations. You have the right to:
              </p>
              <ul>
                <li>Request human review of automated decisions</li>
                <li>Object to automated decision-making</li>
                <li>Understand the logic behind automated decisions</li>
              </ul>
              <p>Contact us at privacy@4sight.org to exercise these rights.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Cross-Border Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                When transferring personal data outside your country, we implement appropriate
                safeguards:
              </p>
              <ul>
                <li>Standard Contractual Clauses (SCCs) approved by the EU Commission</li>
                <li>Adequacy decisions by relevant data protection authorities</li>
                <li>Binding Corporate Rules where applicable</li>
                <li>Consent for specific transfers where legally required</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>16. Data Breach Notification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                In the event of a data breach that may pose a risk to your rights and freedoms, we
                will:
              </p>
              <ul>
                <li>Notify relevant supervisory authorities within 72 hours</li>
                <li>Inform affected users without undue delay</li>
                <li>Provide clear information about the nature of the breach</li>
                <li>Explain the measures taken to address the breach</li>
                <li>Offer guidance on steps you can take to protect yourself</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>17. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                WorkSight may integrate with third-party services. When you use these integrations:
              </p>
              <ul>
                <li>You'll be clearly informed before any data sharing</li>
                <li>We'll obtain your explicit consent for data transfers</li>
                <li>Third parties must meet our data protection standards</li>
                <li>You can revoke permissions at any time through your account settings</li>
              </ul>
              <p>
                Current third-party integrations include authentication providers and analytics
                services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>18. Contact Information and Data Protection Officer</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>For privacy-related inquiries, please contact us:</p>
              <ul>
                <li>
                  <strong>General Privacy:</strong> privacy@4sight.org
                </li>
                <li>
                  <strong>Data Protection Officer (GDPR):</strong> dpo@4sight.org
                </li>
                <li>
                  <strong>California Privacy Rights:</strong> california-privacy@4sight.org
                </li>
                <li>
                  <strong>Data Subject Requests:</strong> data-requests@4sight.org
                </li>
                <li>
                  <strong>Security Issues:</strong> security@4sight.org
                </li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                Last updated: August 24, 2025
                <br />
                Next scheduled review: August 24, 2026
              </p>
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

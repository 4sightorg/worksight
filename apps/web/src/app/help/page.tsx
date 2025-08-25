'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  ArrowLeft,
  Book,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Search,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    {
      question: 'How often should I take the burnout survey?',
      answer:
        'You can take the survey once every hour. We recommend taking it weekly to track your wellness trends.',
    },
    {
      question: 'Is my survey data private?',
      answer:
        'Yes, all survey responses are encrypted and only accessible to you and authorized administrators.',
    },
    {
      question: 'How is my burnout level calculated?',
      answer:
        'Your burnout level is calculated using a scientifically-validated assessment based on the Maslach Burnout Inventory.',
    },
    {
      question: 'Can I export my wellness data?',
      answer: 'Yes, you can download your data from the Settings page under Privacy section.',
    },
  ];

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: Book,
      description: 'Learn the basics of using WorkSight',
      items: [
        'Setting up your profile',
        'Taking your first survey',
        'Understanding your dashboard',
      ],
    },
    {
      title: 'Surveys & Assessments',
      icon: HelpCircle,
      description: 'Everything about burnout assessments',
      items: ['How surveys work', 'Understanding results', 'Survey frequency'],
    },
    {
      title: 'Dashboard & Analytics',
      icon: Video,
      description: 'Make the most of your wellness data',
      items: ['Reading wellness trends', 'Understanding metrics', 'Setting goals'],
    },
    {
      title: 'Account & Privacy',
      icon: MessageCircle,
      description: 'Manage your account and data',
      items: ['Account settings', 'Privacy controls', 'Data export'],
    },
  ];

  return (
    <ProtectedRoute>
      <ClientOnly>
        <SidebarProvider>
          <SidebarInset>
            <div className="flex flex-1 flex-col space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
                  <p className="text-muted-foreground">
                    Find answers to your questions and get support
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                    <Input
                      placeholder="Search for help articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">Contact Support</h3>
                        <p className="text-muted-foreground text-sm">Get help from our team</p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Video className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-semibold">Video Tutorials</h3>
                        <p className="text-muted-foreground text-sm">Watch step-by-step guides</p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Help Categories */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">Browse by Category</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {helpCategories.map((category) => (
                    <Card
                      key={category.title}
                      className="hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <category.icon className="text-primary h-6 w-6" />
                          <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {category.items.map((item) => (
                            <li
                              key={item}
                              className="text-muted-foreground flex items-center gap-2 text-sm"
                            >
                              <ChevronRight className="h-3 w-3" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Still need help?</CardTitle>
                  <CardDescription>Our support team is here to help you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Email Support</h4>
                      <p className="text-muted-foreground text-sm">
                        support@worksight.app
                        <br />
                        Response time: 24 hours
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Live Chat</h4>
                      <p className="text-muted-foreground text-sm">
                        Available Mon-Fri, 9AM-5PM EST
                        <br />
                        Average response: 2 minutes
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>Start Live Chat</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientOnly>
    </ProtectedRoute>
  );
}

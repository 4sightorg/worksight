'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSurveyStore } from '@/store/survey-store';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Heart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export function SurveyResultsCard() {
  const { getLatestResults } = useSurveyStore();
  const latestData = getLatestResults();

  if (!latestData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Survey Results
          </CardTitle>
          <CardDescription>Your latest wellness assessment results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <Activity className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">No survey results available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { results, timestamp } = latestData;

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'moderate':
        return <TrendingUp className="h-5 w-5 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'severe':
        return <Heart className="h-5 w-5 text-red-600" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'severe':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatLevelTitle = (level: string) => {
    switch (level) {
      case 'low':
        return 'Low Risk';
      case 'moderate':
        return 'Moderate Risk';
      case 'high':
        return 'High Risk';
      case 'severe':
        return 'Severe Risk';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Latest Survey Results
        </CardTitle>
        <CardDescription>Completed on {new Date(timestamp).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Burnout Score</span>
            <span className={`text-lg font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${getProgressColor(results.overallScore)}`}
              style={{ width: `${results.overallScore}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm">{results.overallLevel}</p>
        </div>

        {/* Dimension Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Breakdown by Category</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Workload</span>
              <span className="text-xs font-medium">{results.workload.score.toFixed(1)}</span>
            </div>
            <Progress value={results.workload.score} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Work-Life Balance</span>
              <span className="text-xs font-medium">{results.balance.score.toFixed(1)}</span>
            </div>
            <Progress value={results.balance.score} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Support</span>
              <span className="text-xs font-medium">{results.support.score.toFixed(1)}</span>
            </div>
            <Progress value={results.support.score} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Engagement</span>
              <span className="text-xs font-medium">{results.engagement.score.toFixed(1)}</span>
            </div>
            <Progress value={results.engagement.score} className="h-1" />
          </div>
        </div>

        {/* Trend Indicator (mock for now) */}
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground text-xs">Since last assessment</span>
          <div className="flex items-center gap-1">
            {Math.random() > 0.5 ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
            <span className="text-xs">
              {Math.random() > 0.5 ? '+' : '-'}
              {Math.floor(Math.random() * 10)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

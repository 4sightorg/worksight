import {
  ChartDataSchema,
  ReportMetricSchema,
  ReportType,
  TimePeriodSchema,
  validateBurnoutAnalytics,
  validateCreateReport,
  validateReport,
  validateReportDates,
  validateReportSection,
  validateSectionOrder,
  type ChartData,
  type CreateReport,
  type Report,
  type ReportMetric,
  type ReportSection,
  type TimePeriod,
} from '@/schemas/report';

describe('Report Schema Validation', () => {
  describe('ReportType', () => {
    it('should accept all valid report types', () => {
      const validTypes = [
        'burnout_analysis',
        'survey_results',
        'user_activity',
        'department_overview',
        'risk_assessment',
        'task_completion',
        'engagement_metrics',
      ];

      validTypes.forEach((type) => {
        const result = ReportType.safeParse(type);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid report types', () => {
      const invalidTypes = ['invalid_type', '', null, undefined, 123];

      invalidTypes.forEach((type) => {
        const result = ReportType.safeParse(type);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('TimePeriodSchema', () => {
    const validTimePeriod: TimePeriod = {
      start: '2024-01-01T00:00:00.000Z',
      end: '2024-01-31T23:59:59.999Z',
      period: 'monthly',
    };

    it('should validate complete time period', () => {
      const result = TimePeriodSchema.safeParse(validTimePeriod);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date formats', () => {
      const invalidPeriod = {
        ...validTimePeriod,
        start: 'invalid-date',
      };

      const result = TimePeriodSchema.safeParse(invalidPeriod);
      expect(result.success).toBe(false);
    });

    it('should reject invalid period values', () => {
      const invalidPeriod = {
        ...validTimePeriod,
        period: 'invalid',
      };

      const result = TimePeriodSchema.safeParse(invalidPeriod);
      expect(result.success).toBe(false);
    });

    it('should accept all valid period values', () => {
      const periods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

      periods.forEach((period) => {
        const timePeriod = {
          ...validTimePeriod,
          period,
        };

        const result = TimePeriodSchema.safeParse(timePeriod);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('ReportMetricSchema', () => {
    const validMetric: ReportMetric = {
      name: 'Average Burnout Score',
      value: 6.5,
      previousValue: 6.8,
      change: -4.4,
      changeType: 'decrease',
      unit: 'score',
      trend: 'down',
      color: 'red',
    };

    it('should validate complete metric', () => {
      const result = ReportMetricSchema.safeParse(validMetric);
      expect(result.success).toBe(true);
    });

    it('should validate minimal metric', () => {
      const minimalMetric = {
        name: 'Simple Metric',
        value: 100,
      };

      const result = ReportMetricSchema.safeParse(minimalMetric);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.color).toBe('blue'); // default value
      }
    });

    it('should reject metric without name', () => {
      const invalidMetric = {
        value: 100,
      };

      const result = ReportMetricSchema.safeParse(invalidMetric);
      expect(result.success).toBe(false);
    });

    it('should accept all valid colors', () => {
      const colors = ['green', 'red', 'yellow', 'blue', 'gray'];

      colors.forEach((color) => {
        const metric = {
          ...validMetric,
          color,
        };

        const result = ReportMetricSchema.safeParse(metric);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('ChartDataSchema', () => {
    const validChartData: ChartData = {
      type: 'bar',
      data: [
        {
          label: 'Engineering',
          value: 65,
          color: '#3B82F6',
          metadata: { department: 'Engineering', userCount: 25 },
        },
        {
          label: 'Marketing',
          value: 72,
          color: '#EF4444',
        },
      ],
      title: 'Burnout Scores by Department',
      description: 'Average burnout scores across different departments',
    };

    it('should validate complete chart data', () => {
      const result = ChartDataSchema.safeParse(validChartData);
      expect(result.success).toBe(true);
    });

    it('should validate minimal chart data', () => {
      const minimalChart = {
        type: 'line',
        data: [
          { label: 'Jan', value: 50 },
          { label: 'Feb', value: 60 },
        ],
        title: 'Trend Chart',
      };

      const result = ChartDataSchema.safeParse(minimalChart);
      expect(result.success).toBe(true);
    });

    it('should accept all valid chart types', () => {
      const types = ['line', 'bar', 'pie', 'area', 'scatter'];

      types.forEach((type) => {
        const chart = {
          ...validChartData,
          type,
        };

        const result = ChartDataSchema.safeParse(chart);
        expect(result.success).toBe(true);
      });
    });

    it('should reject chart without required fields', () => {
      const invalidChart = {
        data: [{ label: 'Test', value: 100 }],
        title: 'Test Chart',
        // missing type
      };

      const result = ChartDataSchema.safeParse(invalidChart);
      expect(result.success).toBe(false);
    });
  });

  describe('ReportSectionSchema', () => {
    const validSection: ReportSection = {
      id: 'section1',
      title: 'Burnout Overview',
      description: 'Overview of burnout metrics',
      type: 'metrics',
      data: [
        {
          name: 'Total Users',
          value: 150,
          color: 'blue',
        },
      ],
      order: 1,
    };

    it('should validate section with metrics data', () => {
      const result = validateReportSection(validSection);
      expect(result.success).toBe(true);
    });

    it('should validate section with chart data', () => {
      const chartSection = {
        ...validSection,
        type: 'chart',
        data: {
          type: 'bar',
          data: [{ label: 'Test', value: 100 }],
          title: 'Test Chart',
        },
      };

      const result = validateReportSection(chartSection);
      expect(result.success).toBe(true);
    });

    it('should validate section with text data', () => {
      const textSection = {
        ...validSection,
        type: 'text',
        data: 'This is a text section with important insights.',
      };

      const result = validateReportSection(textSection);
      expect(result.success).toBe(true);
    });

    it('should reject section with negative order', () => {
      const invalidSection = {
        ...validSection,
        order: -1,
      };

      const result = validateReportSection(invalidSection);
      expect(result.success).toBe(false);
    });
  });

  describe('ReportSchema', () => {
    const validReport: Report = {
      id: 'report123',
      title: 'Monthly Burnout Analysis',
      description: 'Comprehensive analysis of burnout trends',
      type: 'burnout_analysis',
      createdBy: 'admin123',
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z',
      timePeriod: {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-31T23:59:59.999Z',
        period: 'monthly',
      },
      filters: {
        departments: ['Engineering', 'Marketing'],
        teams: [],
        roles: [],
        riskLevels: ['high'],
        userIds: [],
      },
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          type: 'metrics',
          data: [
            {
              name: 'Total Users',
              value: 150,
              color: 'blue',
            },
          ],
          order: 1,
        },
      ],
      status: 'completed',
      scheduledRefresh: false,
    };

    it('should validate complete report', () => {
      const result = validateReport(validReport);
      expect(result.success).toBe(true);
    });

    it('should validate minimal report', () => {
      const minimalReport = {
        id: 'report123',
        title: 'Simple Report',
        type: 'survey_results',
        createdBy: 'user123',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z',
        timePeriod: {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-01-31T23:59:59.999Z',
          period: 'monthly',
        },
        filters: {},
        sections: [
          {
            id: 'section1',
            title: 'Section',
            type: 'text',
            data: 'Simple text section',
            order: 1,
          },
        ],
      };

      const result = validateReport(minimalReport);
      expect(result.success).toBe(true);
    });

    it('should reject report without sections', () => {
      const reportWithoutSections = {
        ...validReport,
        sections: [],
      };

      const result = validateReport(reportWithoutSections);
      expect(result.success).toBe(false);
    });

    it('should reject report with invalid title length', () => {
      const reportWithLongTitle = {
        ...validReport,
        title: 'a'.repeat(201),
      };

      const result = validateReport(reportWithLongTitle);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateReportSchema', () => {
    const validCreateReport: CreateReport = {
      title: 'New Report',
      description: 'A new report for analysis',
      type: 'burnout_analysis',
      timePeriod: {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-31T23:59:59.999Z',
        period: 'monthly',
      },
      filters: {
        departments: ['Engineering'],
        teams: [],
        roles: [],
        riskLevels: [],
        userIds: [],
      },
      scheduledRefresh: true,
    };

    it('should validate create report request', () => {
      const result = validateCreateReport(validCreateReport);
      expect(result.success).toBe(true);
    });

    it('should validate minimal create report', () => {
      const minimalCreate = {
        title: 'Minimal Report',
        type: 'survey_results',
        timePeriod: {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-01-31T23:59:59.999Z',
          period: 'monthly',
        },
      };

      const result = validateCreateReport(minimalCreate);
      expect(result.success).toBe(true);
    });

    it('should reject create report without required fields', () => {
      const invalidCreate = {
        description: 'Missing title and type',
        timePeriod: {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-01-31T23:59:59.999Z',
          period: 'monthly',
        },
      };

      const result = validateCreateReport(invalidCreate);
      expect(result.success).toBe(false);
    });
  });

  describe('BurnoutAnalyticsSchema', () => {
    const validAnalytics = {
      averageScore: 6.5,
      highRiskCount: 25,
      mediumRiskCount: 45,
      lowRiskCount: 80,
      totalUsers: 150,
      departmentBreakdown: [
        {
          department: 'Engineering',
          averageScore: 7.2,
          userCount: 50,
        },
        {
          department: 'Marketing',
          averageScore: 5.8,
          userCount: 30,
        },
      ],
      trendData: [
        {
          date: '2024-01-01T00:00:00.000Z',
          averageScore: 6.0,
        },
        {
          date: '2024-01-15T00:00:00.000Z',
          averageScore: 6.5,
        },
      ],
    };

    it('should validate complete burnout analytics', () => {
      const result = validateBurnoutAnalytics(validAnalytics);
      expect(result.success).toBe(true);
    });

    it('should reject analytics with invalid score range', () => {
      const invalidAnalytics = {
        ...validAnalytics,
        averageScore: 15, // > 10
      };

      const result = validateBurnoutAnalytics(invalidAnalytics);
      expect(result.success).toBe(false);
    });

    it('should reject analytics with negative counts', () => {
      const invalidAnalytics = {
        ...validAnalytics,
        highRiskCount: -5,
      };

      const result = validateBurnoutAnalytics(invalidAnalytics);
      expect(result.success).toBe(false);
    });
  });

  describe('Custom Validation Functions', () => {
    describe('validateReportDates', () => {
      it('should pass validation for valid date ranges', () => {
        const timePeriod: TimePeriod = {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-01-31T23:59:59.999Z',
          period: 'monthly',
        };

        const result = validateReportDates(timePeriod);
        expect(result.success).toBe(true);
      });

      it('should fail when start date is after end date', () => {
        const timePeriod: TimePeriod = {
          start: '2024-01-31T23:59:59.999Z',
          end: '2024-01-01T00:00:00.000Z',
          period: 'monthly',
        };

        const result = validateReportDates(timePeriod);
        expect(result.success).toBe(false);
        expect(result.error).toBe('End date must be after start date');
      });

      it('should validate daily reports do not exceed 31 days', () => {
        const timePeriod: TimePeriod = {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-03-01T00:00:00.000Z', // > 31 days
          period: 'daily',
        };

        const result = validateReportDates(timePeriod);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Daily reports should not exceed 31 days');
      });

      it('should validate weekly reports do not exceed 1 year', () => {
        const timePeriod: TimePeriod = {
          start: '2024-01-01T00:00:00.000Z',
          end: '2026-01-01T00:00:00.000Z', // > 1 year
          period: 'weekly',
        };

        const result = validateReportDates(timePeriod);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Weekly reports should not exceed 1 year');
      });

      it('should validate monthly reports do not exceed 2 years', () => {
        const timePeriod: TimePeriod = {
          start: '2024-01-01T00:00:00.000Z',
          end: '2027-01-01T00:00:00.000Z', // > 2 years
          period: 'monthly',
        };

        const result = validateReportDates(timePeriod);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Monthly reports should not exceed 2 years');
      });
    });

    describe('validateSectionOrder', () => {
      it('should pass validation for unique section orders', () => {
        const sections: ReportSection[] = [
          {
            id: 'section1',
            title: 'Section 1',
            type: 'metrics',
            data: [],
            order: 1,
          },
          {
            id: 'section2',
            title: 'Section 2',
            type: 'text',
            data: 'Text content',
            order: 2,
          },
          {
            id: 'section3',
            title: 'Section 3',
            type: 'chart',
            data: {
              type: 'bar',
              data: [{ label: 'Test', value: 100 }],
              title: 'Test Chart',
            },
            order: 3,
          },
        ];

        const result = validateSectionOrder(sections);
        expect(result.success).toBe(true);
      });

      it('should fail validation for duplicate section orders', () => {
        const sections: ReportSection[] = [
          {
            id: 'section1',
            title: 'Section 1',
            type: 'metrics',
            data: [],
            order: 1,
          },
          {
            id: 'section2',
            title: 'Section 2',
            type: 'text',
            data: 'Text content',
            order: 1, // duplicate order
          },
        ];

        const result = validateSectionOrder(sections);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Section orders must be unique');
      });
    });
  });
});

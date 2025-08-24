import {
  QuestionType,
  validateCreateSurvey,
  validateQuestionOrder,
  validateSurvey,
  validateSurveyDates,
  validateSurveyFilters,
  validateSurveyQuestion,
  validateSurveyResponse,
  type CreateSurvey,
  type Survey,
  type SurveyQuestion,
  type SurveyResponse,
} from '@/schemas/survey';

describe('Survey Schema Validation', () => {
  describe('QuestionType', () => {
    it('should accept valid question types', () => {
      const validTypes = [
        'multiple_choice',
        'single_choice',
        'text',
        'rating',
        'yes_no',
        'scale',
        'date',
      ];

      validTypes.forEach((type) => {
        const result = QuestionType.safeParse(type);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid question types', () => {
      const invalidTypes = ['invalid', '', null, undefined, 123];

      invalidTypes.forEach((type) => {
        const result = QuestionType.safeParse(type);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('SurveyQuestionSchema', () => {
    const validQuestion: SurveyQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      title: 'How often do you feel stressed?',
      description: 'Please select the frequency that best describes your experience',
      required: true,
      options: ['Never', 'Sometimes', 'Often', 'Always'],
      order: 1,
    };

    it('should validate a complete question', () => {
      const result = validateSurveyQuestion(validQuestion);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validQuestion);
      }
    });

    it('should validate minimal question', () => {
      const minimalQuestion = {
        id: 'q1',
        type: 'text',
        title: 'Any comments?',
        order: 0,
      };

      const result = validateSurveyQuestion(minimalQuestion);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toBe(false); // default value
      }
    });

    it('should reject question without required fields', () => {
      const invalidQuestions = [
        { type: 'text', title: 'Missing ID', order: 1 },
        { id: 'q1', title: 'Missing type', order: 1 },
        { id: 'q1', type: 'text', order: 1 }, // Missing title
        { id: 'q1', type: 'text', title: 'Missing order' },
      ];

      invalidQuestions.forEach((question) => {
        const result = validateSurveyQuestion(question);
        expect(result.success).toBe(false);
      });
    });

    it('should reject question with invalid title length', () => {
      const longTitle = 'a'.repeat(201);
      const question = {
        id: 'q1',
        type: 'text',
        title: longTitle,
        order: 1,
      };

      const result = validateSurveyQuestion(question);
      expect(result.success).toBe(false);
    });

    it('should reject question with negative order', () => {
      const question = {
        id: 'q1',
        type: 'text',
        title: 'Valid title',
        order: -1,
      };

      const result = validateSurveyQuestion(question);
      expect(result.success).toBe(false);
    });
  });

  describe('SurveySchema', () => {
    const validSurvey: Survey = {
      id: 'survey1',
      title: 'Burnout Assessment Survey',
      description: 'A comprehensive survey to assess workplace burnout levels',
      status: 'active',
      createdBy: 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      targetDepartments: ['Engineering', 'Marketing'],
      targetRoles: ['Developer', 'Manager'],
      questions: [
        {
          id: 'q1',
          type: 'rating',
          title: 'How stressed do you feel?',
          required: true,
          minValue: 1,
          maxValue: 10,
          order: 1,
        },
      ],
      responseCount: 0,
      completionRate: 0,
    };

    it('should validate complete survey', () => {
      const result = validateSurvey(validSurvey);
      expect(result.success).toBe(true);
    });

    it('should validate survey with minimal fields', () => {
      const minimalSurvey = {
        id: 'survey1',
        title: 'Simple Survey',
        status: 'draft',
        createdBy: 'user123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: [
          {
            id: 'q1',
            type: 'text',
            title: 'Any feedback?',
            order: 1,
          },
        ],
      };

      const result = validateSurvey(minimalSurvey);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.targetDepartments).toEqual([]);
        expect(result.data.targetRoles).toEqual([]);
        expect(result.data.responseCount).toBe(0);
        expect(result.data.completionRate).toBe(0);
      }
    });

    it('should reject survey without questions', () => {
      const surveyWithoutQuestions = {
        ...validSurvey,
        questions: [],
      };

      const result = validateSurvey(surveyWithoutQuestions);
      expect(result.success).toBe(false);
    });

    it('should reject survey with invalid completion rate', () => {
      const surveyWithInvalidRate = {
        ...validSurvey,
        completionRate: 150, // > 100%
      };

      const result = validateSurvey(surveyWithInvalidRate);
      expect(result.success).toBe(false);
    });

    it('should reject survey with negative response count', () => {
      const surveyWithNegativeCount = {
        ...validSurvey,
        responseCount: -5,
      };

      const result = validateSurvey(surveyWithNegativeCount);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateSurveySchema', () => {
    const validCreateSurvey: CreateSurvey = {
      title: 'New Survey',
      description: 'A new survey for testing',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      targetDepartments: ['Engineering'],
      targetRoles: ['Developer'],
      questions: [
        {
          type: 'text',
          title: 'How are you feeling?',
          order: 1,
          required: false,
        },
      ],
    };

    it('should validate create survey request', () => {
      const result = validateCreateSurvey(validCreateSurvey);
      expect(result.success).toBe(true);
    });

    it('should validate minimal create survey', () => {
      const minimalCreate = {
        title: 'Minimal Survey',
        questions: [
          {
            type: 'text',
            title: 'Question 1',
            order: 1,
          },
        ],
      };

      const result = validateCreateSurvey(minimalCreate);
      expect(result.success).toBe(true);
    });

    it('should reject create survey without required fields', () => {
      const invalidCreate = {
        description: 'Missing title',
        questions: [
          {
            type: 'text',
            title: 'Question 1',
            order: 1,
          },
        ],
      };

      const result = validateCreateSurvey(invalidCreate);
      expect(result.success).toBe(false);
    });
  });

  describe('SurveyResponseSchema', () => {
    const validResponse: SurveyResponse = {
      id: 'response1',
      surveyId: 'survey1',
      userId: 'user123',
      responses: {
        q1: 'Very satisfied',
        q2: 8,
        q3: true,
        q4: ['Option 1', 'Option 3'],
      },
      completedAt: new Date().toISOString(),
      timeSpent: 300, // 5 minutes
    };

    it('should validate complete response', () => {
      const result = validateSurveyResponse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject response with negative time spent', () => {
      const invalidResponse = {
        ...validResponse,
        timeSpent: -10,
      };

      const result = validateSurveyResponse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject response without required fields', () => {
      const invalidResponses = [
        { ...validResponse, id: '' },
        { ...validResponse, surveyId: '' },
        { ...validResponse, userId: '' },
      ];

      invalidResponses.forEach((response) => {
        const result = validateSurveyResponse(response);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('SurveyFiltersSchema', () => {
    it('should validate default filters', () => {
      const result = validateSurveyFilters({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.searchTerm).toBe('');
        expect(result.data.status).toBe('all');
        expect(result.data.department).toBe('all');
        expect(result.data.createdBy).toBe('all');
      }
    });

    it('should validate complete filters', () => {
      const filters = {
        searchTerm: 'burnout',
        status: 'active',
        department: 'Engineering',
        createdBy: 'john.doe',
        dateRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString(),
        },
      };

      const result = validateSurveyFilters(filters);
      expect(result.success).toBe(true);
    });

    it('should reject filters with invalid search term length', () => {
      const filters = {
        searchTerm: 'a'.repeat(101), // too long
      };

      const result = validateSurveyFilters(filters);
      expect(result.success).toBe(false);
    });
  });

  describe('Custom Validation Functions', () => {
    describe('validateSurveyDates', () => {
      it('should pass validation for valid dates', () => {
        const survey: CreateSurvey = {
          title: 'Test Survey',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          questions: [],
        };

        const result = validateSurveyDates(survey);
        expect(result.success).toBe(true);
      });

      it('should fail validation when start date is after end date', () => {
        const survey: CreateSurvey = {
          title: 'Test Survey',
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          questions: [],
        };

        const result = validateSurveyDates(survey);
        expect(result.success).toBe(false);
        expect(result.error).toBe('End date must be after start date');
      });

      it('should pass validation when dates are not provided', () => {
        const survey: CreateSurvey = {
          title: 'Test Survey',
          questions: [],
        };

        const result = validateSurveyDates(survey);
        expect(result.success).toBe(true);
      });
    });

    describe('validateQuestionOrder', () => {
      it('should pass validation for unique orders', () => {
        const questions = [
          { id: 'q1', type: 'text', title: 'Q1', order: 1 },
          { id: 'q2', type: 'text', title: 'Q2', order: 2 },
          { id: 'q3', type: 'text', title: 'Q3', order: 3 },
        ] as SurveyQuestion[];

        const result = validateQuestionOrder(questions);
        expect(result.success).toBe(true);
      });

      it('should fail validation for duplicate orders', () => {
        const questions = [
          { id: 'q1', type: 'text', title: 'Q1', order: 1 },
          { id: 'q2', type: 'text', title: 'Q2', order: 1 }, // duplicate order
          { id: 'q3', type: 'text', title: 'Q3', order: 3 },
        ] as SurveyQuestion[];

        const result = validateQuestionOrder(questions);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Question orders must be unique');
      });
    });
  });
});

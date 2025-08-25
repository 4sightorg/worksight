import { UserRole } from '@/auth/types';
import {
  validateCreateUser,
  validateUpdateUser,
  validateUser,
  validateUserArray,
  validateUserFilters,
  validateUserWithMetrics,
  type CreateUser,
  type UpdateUser,
  type UserWithMetrics,
} from '@/schemas/user';

describe('User Schema Validation', () => {
  describe('UserSchema', () => {
    const validUser = {
      id: 'user123',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: UserRole.EMPLOYEE,
      department: 'Engineering',
      team: 'Frontend',
    };

    it('should validate a complete user', () => {
      const result = validateUser(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('should reject user with invalid email', () => {
      const invalidUser = {
        ...validUser,
        email: 'invalid-email',
      };

      const result = validateUser(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user with short name', () => {
      const invalidUser = {
        ...validUser,
        name: 'A', // too short
      };

      const result = validateUser(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user with long name', () => {
      const invalidUser = {
        ...validUser,
        name: 'a'.repeat(101), // too long
      };

      const result = validateUser(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user with invalid role', () => {
      const invalidUser = {
        ...validUser,
        role: 'INVALID_ROLE',
      };

      const result = validateUser(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user without required fields', () => {
      const requiredFields = ['id', 'name', 'email', 'role', 'department', 'team'];

      requiredFields.forEach((field) => {
        const invalidUser = { ...validUser };
        delete invalidUser[field as keyof typeof invalidUser];

        const result = validateUser(invalidUser);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('UserWithMetricsSchema', () => {
    const validUserWithMetrics: UserWithMetrics = {
      id: 'user123',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: UserRole.EMPLOYEE,
      department: 'Engineering',
      team: 'Frontend',
      burnoutScore: 3.5,
      lastActive: '2 hours ago',
      surveyCompleted: true,
      riskLevel: 'low',
      tasksCompleted: 24,
    };

    it('should validate complete user with metrics', () => {
      const result = validateUserWithMetrics(validUserWithMetrics);
      expect(result.success).toBe(true);
    });

    it('should reject user with negative burnout score', () => {
      const invalidUser = {
        ...validUserWithMetrics,
        burnoutScore: -1,
      };

      const result = validateUserWithMetrics(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user with burnout score exceeding 10', () => {
      const invalidUser = {
        ...validUserWithMetrics,
        burnoutScore: 11,
      };

      const result = validateUserWithMetrics(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user with invalid risk level', () => {
      const invalidUser = {
        ...validUserWithMetrics,
        riskLevel: 'invalid' as unknown as 'low' | 'medium' | 'high',
      };

      const result = validateUserWithMetrics(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user with negative tasks completed', () => {
      const invalidUser = {
        ...validUserWithMetrics,
        tasksCompleted: -5,
      };

      const result = validateUserWithMetrics(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should accept all valid risk levels', () => {
      const riskLevels = ['low', 'medium', 'high'] as const;

      riskLevels.forEach((level) => {
        const user = {
          ...validUserWithMetrics,
          riskLevel: level,
        };

        const result = validateUserWithMetrics(user);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('CreateUserSchema', () => {
    const validCreateUser: CreateUser = {
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: UserRole.TEAM_LEAD,
      department: 'Marketing',
      team: 'Content',
      password: 'securePassword123',
    };

    it('should validate complete user creation', () => {
      const result = validateCreateUser(validCreateUser);
      expect(result.success).toBe(true);
    });

    it('should reject user creation with short password', () => {
      const invalidUser = {
        ...validCreateUser,
        password: '123', // too short
      };

      const result = validateCreateUser(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user creation with long password', () => {
      const invalidUser = {
        ...validCreateUser,
        password: 'a'.repeat(129), // too long
      };

      const result = validateCreateUser(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user creation without required fields', () => {
      const requiredFields = ['name', 'email', 'role', 'department', 'team', 'password'];

      requiredFields.forEach((field) => {
        const invalidUser = { ...validCreateUser };
        delete invalidUser[field as keyof typeof invalidUser];

        const result = validateCreateUser(invalidUser);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('UpdateUserSchema', () => {
    const validUpdateUser: UpdateUser = {
      id: 'user123',
      name: 'Updated Name',
      email: 'updated.email@company.com',
      role: UserRole.MANAGER,
      department: 'Updated Department',
      team: 'Updated Team',
    };

    it('should validate complete user update', () => {
      const result = validateUpdateUser(validUpdateUser);
      expect(result.success).toBe(true);
    });

    it('should validate partial user update', () => {
      const partialUpdate = {
        id: 'user123',
        name: 'Only Name Updated',
      };

      const result = validateUpdateUser(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should require ID field', () => {
      const updateWithoutId = {
        name: 'Updated Name',
        email: 'updated@company.com',
      };

      const result = validateUpdateUser(updateWithoutId);
      expect(result.success).toBe(false);
    });

    it('should reject update with invalid email', () => {
      const invalidUpdate = {
        id: 'user123',
        email: 'invalid-email',
      };

      const result = validateUpdateUser(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('UserFiltersSchema', () => {
    it('should validate default filters', () => {
      const result = validateUserFilters({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.searchTerm).toBe('');
        expect(result.data.department).toBe('all');
        expect(result.data.riskLevel).toBe('all');
        expect(result.data.role).toBe('all');
      }
    });

    it('should validate complete filters', () => {
      const filters = {
        searchTerm: 'john',
        department: 'Engineering',
        riskLevel: 'high',
        role: UserRole.EMPLOYEE,
      };

      const result = validateUserFilters(filters);
      expect(result.success).toBe(true);
    });

    it('should reject filters with long search term', () => {
      const filters = {
        searchTerm: 'a'.repeat(101),
      };

      const result = validateUserFilters(filters);
      expect(result.success).toBe(false);
    });

    it('should accept all valid risk levels in filters', () => {
      const riskLevels = ['all', 'low', 'medium', 'high'] as const;

      riskLevels.forEach((level) => {
        const filters = { riskLevel: level };
        const result = validateUserFilters(filters);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('validateUserArray', () => {
    const validUsers: UserWithMetrics[] = [
      {
        id: 'user1',
        name: 'John Doe',
        email: 'john@company.com',
        role: UserRole.EMPLOYEE,
        department: 'Engineering',
        team: 'Frontend',
        burnoutScore: 3.5,
        lastActive: '2 hours ago',
        surveyCompleted: true,
        riskLevel: 'low',
        tasksCompleted: 24,
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        email: 'jane@company.com',
        role: UserRole.MANAGER,
        department: 'Marketing',
        team: 'Content',
        burnoutScore: 7.2,
        lastActive: '1 hour ago',
        surveyCompleted: false,
        riskLevel: 'high',
        tasksCompleted: 18,
      },
    ];

    it('should validate array of valid users', () => {
      const result = validateUserArray(validUsers);

      expect(result.allValid).toBe(true);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    it('should handle mixed valid and invalid users', () => {
      const mixedUsers = [
        validUsers[0], // valid
        {
          id: 'user3',
          name: 'Invalid User',
          email: 'invalid-email', // invalid email
          role: UserRole.EMPLOYEE,
          department: 'Engineering',
          team: 'Backend',
          burnoutScore: 15, // invalid score
          lastActive: '1 day ago',
          surveyCompleted: true,
          riskLevel: 'medium',
          tasksCompleted: 10,
        },
        validUsers[1], // valid
      ];

      const result = validateUserArray(mixedUsers);

      expect(result.allValid).toBe(false);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0].index).toBe(1);
      expect(result.invalid[0].errors).toBeDefined();
    });

    it('should handle empty array', () => {
      const result = validateUserArray([]);

      expect(result.allValid).toBe(true);
      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    it('should provide detailed error information for invalid users', () => {
      const invalidUsers = [
        {
          id: '', // invalid
          name: 'A', // too short
          email: 'invalid', // invalid format
          role: 'INVALID_ROLE', // invalid role
          department: '',
          team: '',
          burnoutScore: -1, // negative
          lastActive: '',
          surveyCompleted: true,
          riskLevel: 'invalid',
          tasksCompleted: -5, // negative
        },
      ];

      const result = validateUserArray(invalidUsers);

      expect(result.allValid).toBe(false);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0].errors).toBeDefined();
      expect(result.invalid[0].errors?.length).toBeGreaterThan(0);
    });
  });

  describe('User Role Validation', () => {
    it('should accept all valid user roles', () => {
      const roles = Object.values(UserRole);

      roles.forEach((role) => {
        const user = {
          id: 'user123',
          name: 'Test User',
          email: 'test@company.com',
          role,
          department: 'Test Department',
          team: 'Test Team',
        };

        const result = validateUser(user);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid user roles', () => {
      const user = {
        id: 'user123',
        name: 'Test User',
        email: 'test@company.com',
        role: 'SUPER_ADMIN' as unknown as UserRole, // not a valid role
        department: 'Test Department',
        team: 'Test Team',
      };

      const result = validateUser(user);
      expect(result.success).toBe(false);
    });
  });
});

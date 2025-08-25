import { User, UserRole } from './types';

// Admin role checking utilities
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  const role = user.role || user.user_metadata?.role;
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
};

export const isManager = (user: User | null): boolean => {
  if (!user) return false;
  const role = user.role || user.user_metadata?.role;
  return role === UserRole.MANAGER || isAdmin(user);
};

export const isTeamLead = (user: User | null): boolean => {
  if (!user) return false;
  const role = user.role || user.user_metadata?.role;
  return role === UserRole.TEAM_LEAD || isManager(user);
};

export const canViewTeamData = (user: User | null): boolean => {
  return isTeamLead(user);
};

export const canManageUsers = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canManageSurveys = (user: User | null): boolean => {
  return isManager(user);
};

export const canViewAllReports = (user: User | null): boolean => {
  return isAdmin(user);
};

export const getUserRoleDisplay = (role: UserRole | string | undefined): string => {
  if (!role) return 'Employee';

  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Super Admin';
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.MANAGER:
      return 'Manager';
    case UserRole.TEAM_LEAD:
      return 'Team Lead';
    case UserRole.EMPLOYEE:
    default:
      return 'Employee';
  }
};

export const getRoleColor = (role: UserRole | string | undefined): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'bg-red-500';
    case UserRole.ADMIN:
      return 'bg-purple-500';
    case UserRole.MANAGER:
      return 'bg-blue-500';
    case UserRole.TEAM_LEAD:
      return 'bg-green-500';
    case UserRole.EMPLOYEE:
    default:
      return 'bg-gray-500';
  }
};

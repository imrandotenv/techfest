'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  BTechBranch, 
  BranchInfo, 
  SubjectItem, 
  getBranchDetails, 
  getSemesterSubjects, 
  getSuggestedPassoutYear 
} from '@/config/curriculum';

export interface AcademicProfile {
  id?: string;
  clerkId?: string;
  email?: string;
  fullName?: string;
  role?: string;
  degree: string;
  branch: BTechBranch;
  semester: number;
  passoutYear: number;
  universityRoll?: string;
  onboardingCompleted: boolean;
}

const DEFAULT_PROFILE: AcademicProfile = {
  degree: 'B.Tech',
  branch: 'CSE',
  semester: 3,
  passoutYear: 2028,
  onboardingCompleted: false,
};

export function useAcademicProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [profile, setProfile] = useState<AcademicProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize or fetch profile
  const fetchProfile = useCallback(async () => {
    if (!isLoaded) return;

    // 1. First, check Clerk publicMetadata for instant zero-latency rendering
    if (isSignedIn && user) {
      const meta = (user.publicMetadata || {}) as {
        degree?: string;
        branch?: string;
        semester?: number;
        passoutYear?: number;
        universityRoll?: string;
        onboardingCompleted?: boolean;
        role?: string;
      };

      if (meta.branch) {
        const branch = (meta.branch.toUpperCase() as BTechBranch) || 'CSE';
        const semester = Number(meta.semester) || 3;
        const passoutYear = Number(meta.passoutYear) || getSuggestedPassoutYear(semester);
        
        setProfile({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
          role: meta.role || 'STUDENT',
          degree: meta.degree || 'B.Tech',
          branch,
          semester,
          passoutYear,
          universityRoll: meta.universityRoll,
          onboardingCompleted: Boolean(meta.onboardingCompleted),
        });
      }
    }

    // 2. Fetch full DB state from /api/profile
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setProfile({
            id: data.user.id,
            clerkId: data.user.clerkId,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role,
            degree: data.user.degree || 'B.Tech',
            branch: (data.user.branch?.toUpperCase() as BTechBranch) || 'CSE',
            semester: Number(data.user.semester) || 3,
            passoutYear: Number(data.user.passoutYear) || getSuggestedPassoutYear(Number(data.user.semester) || 3),
            universityRoll: data.user.universityRoll,
            onboardingCompleted: Boolean(data.user.onboardingCompleted),
          });
        }
      }
    } catch (err) {
      console.warn('[useAcademicProfile] Error fetching DB profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile handler (calls PATCH /api/profile)
  const updateProfile = async (updates: Partial<{ branch: BTechBranch; semester: number; passoutYear: number; universityRoll: string; fullName: string }>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update academic profile');
      }

      const result = await res.json();
      if (result?.user) {
        setProfile((prev) => ({
          ...prev,
          branch: (result.user.branch?.toUpperCase() as BTechBranch) || prev.branch,
          semester: Number(result.user.semester) || prev.semester,
          passoutYear: Number(result.user.passoutYear) || prev.passoutYear,
          universityRoll: result.user.universityRoll || prev.universityRoll,
          fullName: result.user.fullName || prev.fullName,
        }));
      }
      return { success: true };
    } catch (err: any) {
      console.error('[useAcademicProfile] Update failed:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const branchDetails: BranchInfo = getBranchDetails(profile.branch);
  const semesterSubjects: SubjectItem[] = getSemesterSubjects(profile.branch, profile.semester);

  return {
    profile,
    isLoading,
    branchDetails,
    semesterSubjects,
    updateProfile,
    refetch: fetchProfile,
  };
}

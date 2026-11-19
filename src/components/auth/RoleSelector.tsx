'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { GraduationCap, Building2, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { CustomUserRole } from '@/types';
import { getResolvedRole, setUserRole, ROLE_CONFIGS, getDisplayRole } from '@/lib/auth-client';
import Link from 'next/link';

interface RoleSelectorProps {
  onRoleSelected?: (role: CustomUserRole) => void;
  showSignedInProfile?: boolean;
}

export function RoleSelector({ onRoleSelected, showSignedInProfile = true }: RoleSelectorProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [selectedRole, setSelectedRole] = useState<CustomUserRole>('student');
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Sync role from user on mount / user load
  useEffect(() => {
    if (isLoaded) {
      const resolved = getResolvedRole(user);
      setSelectedRole(resolved);
    }
  }, [isLoaded, user]);

  const handleSelectRole = async (role: CustomUserRole) => {
    setSelectedRole(role);
    if (onRoleSelected) {
      onRoleSelected(role);
    }

    if (isSignedIn && user) {
      setIsUpdating(true);
      await setUserRole(user, role);
      setIsUpdating(false);
      setSyncStatus(`Role updated to ${getDisplayRole(role)}!`);
      setTimeout(() => setSyncStatus(null), 3000);
    } else {
      // Persist in localStorage for when user signs up / signs in
      if (typeof window !== 'undefined') {
        localStorage.setItem('sanakahub_preferred_role', role);
      }
      setSyncStatus(`Onboarding role set to ${getDisplayRole(role)}`);
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const roles = [
    {
      key: 'student' as CustomUserRole,
      label: 'Student',
      sublabel: 'Notes & Q&A',
      icon: GraduationCap,
    },
    {
      key: 'college' as CustomUserRole,
      label: 'Faculty',
      sublabel: 'Upload & Verify',
      icon: Building2,
    },
    {
      key: 'admin' as CustomUserRole,
      label: 'Admin',
      sublabel: 'Console Desk',
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* If Signed In: Profile Card */}
      {showSignedInProfile && isSignedIn && user && (
        <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
              {user.firstName?.[0] || user.username?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#0F172A] truncate">
                {user.fullName || user.primaryEmailAddress?.emailAddress || 'Sanaka Member'}
              </div>
              <div className="text-[10px] font-mono text-[#475569] flex items-center gap-1">
                <span>Active Role:</span>
                <span className={`px-1.5 py-0.2 rounded font-semibold ${ROLE_CONFIGS[selectedRole]?.badgeClass || ''}`}>
                  {getDisplayRole(selectedRole)}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/notes"
            className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#2563EB] hover:underline shrink-0"
          >
            <span>Vault</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Role Picker Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#475569]">
          <span className="uppercase font-semibold tracking-wider">Select Onboarding Role</span>
          {syncStatus && (
            <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {syncStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.key;
            return (
              <button
                key={r.key}
                type="button"
                disabled={isUpdating}
                onClick={() => handleSelectRole(r.key)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#0F172A] bg-slate-900 text-white shadow-xs'
                    : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#475569]'}`} />
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>
                <div className={`text-xs font-semibold font-sans ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                  {r.label}
                </div>
                <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-slate-300' : 'text-[#475569]'}`}>
                  {r.sublabel}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] font-sans text-[#475569] leading-relaxed">
          {ROLE_CONFIGS[selectedRole]?.description}
        </p>
      </div>
    </div>
  );
}

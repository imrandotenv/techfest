'use client';

import React, { useState } from 'react';
import { CustomUserRole, UserRoleRecord } from '../types';
import { RoleBadge } from './RoleBadge';
import { updateUserRoleAction } from '../actions';
import { Search, ShieldAlert, Check, UserCheck, GraduationCap, ShieldCheck } from 'lucide-react';

interface UserRoleSwitcherProps {
  initialUsers: UserRoleRecord[];
}

export function UserRoleSwitcher({ initialUsers }: UserRoleSwitcherProps) {
  const [users, setUsers] = useState<UserRoleRecord[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | CustomUserRole>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesFilter;
  });

  const handleRoleChange = async (userId: string, newRole: CustomUserRole) => {
    setUpdatingId(userId);
    setActionFeedback(null);

    try {
      const res = await updateUserRoleAction({ targetUserId: userId, newRole });
      if (res.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, role: newRole, isSuperAdmin: newRole === 'admin' }
              : user
          )
        );
        setActionFeedback(`Updated ${userId} to ${newRole}`);
      } else {
        setActionFeedback(`Error: ${res.message}`);
      }
    } catch (err: any) {
      setActionFeedback(`Failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-zinc-200 bg-zinc-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Institutional User Directory & RBAC Roles
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Promote or reassign student, faculty, and administrative permissions across SETGOI.
            </p>
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-zinc-200 text-xs font-mono">
            {(['all', 'student', 'college', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  roleFilter === r
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {r === 'college' ? 'Faculty' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, SETGOI email, or registration ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-zinc-200 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
          />
        </div>
      </div>

      {actionFeedback && (
        <div className="px-5 py-2 text-xs font-mono bg-zinc-100 border-b border-zinc-200 text-zinc-800 flex items-center justify-between">
          <span>{actionFeedback}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-zinc-400 hover:text-zinc-600 text-xs"
          >
            ×
          </button>
        </div>
      )}

      {/* Swiss Minimalist Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
              <th className="py-2.5 px-4 font-medium">User Profile</th>
              <th className="py-2.5 px-4 font-medium">Department / ID</th>
              <th className="py-2.5 px-4 font-medium">Current Role</th>
              <th className="py-2.5 px-4 font-medium text-right">Assign RBAC Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-400 font-mono">
                  No members found matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isBusy = updatingId === user.id;

                return (
                  <tr key={user.id} className="hover:bg-zinc-50/75 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-900">{user.fullName}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-zinc-800 font-medium">
                        {user.department || 'General Academic'}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {user.studentId || user.id.slice(0, 10)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadge role={user.role} isSuperAdmin={user.isSuperAdmin} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          disabled={isBusy || user.role === 'student'}
                          onClick={() => handleRoleChange(user.id, 'student')}
                          title="Set as Student"
                          className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                            user.role === 'student'
                              ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-default'
                              : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          Student
                        </button>

                        <button
                          disabled={isBusy || user.role === 'college'}
                          onClick={() => handleRoleChange(user.id, 'college')}
                          title="Set as College Faculty"
                          className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                            user.role === 'college'
                              ? 'bg-sky-50 text-sky-400 border-sky-200 cursor-default'
                              : 'border-zinc-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 text-zinc-700'
                          }`}
                        >
                          Faculty
                        </button>

                        <button
                          disabled={isBusy || user.role === 'admin'}
                          onClick={() => handleRoleChange(user.id, 'admin')}
                          title="Set as Administrator"
                          className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                            user.role === 'admin'
                              ? 'bg-indigo-50 text-indigo-400 border-indigo-200 cursor-default'
                              : 'border-zinc-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-zinc-700'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-zinc-500 font-mono text-[11px]">
        <span>Showing {filteredUsers.length} of {users.length} enrolled members</span>
        <span className="flex items-center gap-1 text-emerald-600">
          <Check className="w-3.5 h-3.5" /> Direct Clerk & DB Synchronization
        </span>
      </div>
    </div>
  );
}

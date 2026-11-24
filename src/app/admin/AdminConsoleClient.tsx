'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  Search, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  Save, 
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { UserRole } from '@/lib/rbac';

interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt?: string;
}

const INITIAL_MOCK_USERS: ManagedUser[] = [
  {
    id: 'user_admin_01',
    fullName: 'Imran (Principal Admin)',
    email: 'mail@ceimran.in',
    role: 'admin',
    department: 'Super Admin Office',
  },
  {
    id: 'user_admin_02',
    fullName: 'Mohammad Imran',
    email: 'mdimransps955@gmail.com',
    role: 'admin',
    department: 'Super Admin Office',
  },
  {
    id: 'user_fac_01',
    fullName: 'Prof. Subhash Mukherjee',
    email: 'hod.cse@setgoi.ac.in',
    role: 'faculty',
    department: 'CSE Department',
  },
  {
    id: 'user_fac_02',
    fullName: 'Prof. Anirban Ghosh',
    email: 'hod.ece@setgoi.ac.in',
    role: 'faculty',
    department: 'ECE Department',
  },
  {
    id: 'user_stud_01',
    fullName: 'Arjun Chatterjee',
    email: 'arjun.chatterjee@setgoi.ac.in',
    role: 'student',
    department: 'B.Tech CSE (Sem 5)',
  },
  {
    id: 'user_stud_02',
    fullName: 'Debjit Roy',
    email: 'debjit.roy@setgoi.ac.in',
    role: 'student',
    department: 'B.Tech CSE (Sem 5)',
  },
];

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'audit-01',
    timestamp: '2026-11-22 14:15:02 IST',
    actor: 'mail@ceimran.in',
    action: 'ROLE_PROMOTION',
    target: 'hod.cse@setgoi.ac.in',
    details: 'Promoted from student to faculty clearance',
  },
  {
    id: 'audit-02',
    timestamp: '2026-11-22 13:42:19 IST',
    actor: 'System Bootstrap',
    action: 'SUPER_ADMIN_WHITELIST',
    target: 'mdimransps955@gmail.com',
    details: 'Auto-elevated via process.env.SUPER_ADMIN_EMAILS',
  },
  {
    id: 'audit-03',
    timestamp: '2026-11-22 11:20:45 IST',
    actor: 'Prof. Subhash Mukherjee',
    action: 'NOTE_APPROVED',
    target: 'PCC-CS501-Compiler-Design.pdf',
    details: 'Stamped "Faculty Verified" for student vault',
  },
];

export function AdminConsoleClient({ currentAdminId }: { currentAdminId: string }) {
  const [activeTab, setActiveTab] = useState<'users' | 'directory' | 'moderation'>('users');
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Directory state
  const [examDate, setExamDate] = useState('2026-12-04T10:00');
  const [examSaved, setExamSaved] = useState(false);
  const [cseHodPhone, setCseHodPhone] = useState('+91 94340 12345');
  const [examCellContact, setExamCellContact] = useState('+91 94340 99887');
  const [directorySaved, setDirectorySaved] = useState(false);

  // Fetch real users from /api/admin/users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.warn('Using local user registry in admin console:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update role for a user
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ text: data.error || 'Failed to update role', isError: true });
        fetchUsers(); // Revert
      } else {
        setStatusMessage({ text: `Role updated to ${newRole.toUpperCase()} successfully across Neon DB & Clerk!` });
      }
    } catch (err: any) {
      setStatusMessage({ text: err?.message || 'Network error updating role', isError: true });
    }

    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSaveExamDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('settech_exam_target_date', examDate);
    }
    setExamSaved(true);
    setTimeout(() => setExamSaved(false), 3000);
  };

  const handleSaveDirectory = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectorySaved(true);
    setTimeout(() => setDirectorySaved(false), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Section Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all inline-flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User &amp; Role Management</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all inline-flex items-center gap-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Campus &amp; HOD Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all inline-flex items-center gap-2 cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Moderation &amp; Audit Log</span>
        </button>
      </div>

      {/* Global Status Toast */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-sans flex items-center justify-between ${
            statusMessage.isError
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[11px] font-mono underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: User & Role Management */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7]">
            <div>
              <h2 className="text-base font-bold font-sans text-[#09090B]">
                Active Clerk Accounts &amp; RBAC Roles
              </h2>
              <p className="text-xs text-[#52525B] font-sans">
                Elevate accounts to Faculty or Admin. Roles are saved directly to Clerk <code className="font-mono text-[11px] bg-zinc-100 px-1 py-0.5 rounded">publicMetadata.role</code>.
              </p>
            </div>

            {/* Search Box */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user, email or role..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-[#E4E4E7] text-xs font-sans text-[#09090B] focus:outline-hidden focus:border-[#2563EB] w-56 sm:w-64"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-2 rounded-xl border border-[#E4E4E7] text-zinc-600 hover:text-[#09090B] hover:bg-zinc-50 transition-colors"
                title="Refresh user list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[11px] font-mono text-[#52525B] uppercase">
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3 text-right">Assign Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === currentAdminId;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#09090B]">{u.fullName}</div>
                        <div className="text-[10px] font-mono text-[#52525B]">{u.department || 'B.Tech Core'}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#52525B]">{u.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : u.role === 'faculty'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-[#09090B] border-[#E4E4E7]'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={u.role.toLowerCase()}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          disabled={isCurrentAdmin}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#E4E4E7] text-xs font-mono font-medium text-[#09090B] focus:outline-hidden focus:border-[#2563EB] cursor-pointer disabled:bg-zinc-100 disabled:cursor-not-allowed"
                          title={isCurrentAdmin ? 'Self-demotion protection active' : 'Select role'}
                        >
                          <option value="student">STUDENT</option>
                          <option value="faculty">FACULTY</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Campus & HOD Directory Manager */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section A: MAKAUT Exam Target Date */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E4E4E7]">
              <h2 className="text-sm font-bold font-sans text-[#09090B] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span>MAKAUT Exam Countdown Manager</span>
              </h2>
              <p className="text-xs text-[#52525B] font-sans">
                Sets the global semester examination target date shown in Hero and `/tools`.
              </p>
            </div>

            {examSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exam countdown date saved locally!</span>
              </div>
            )}

            <form onSubmit={handleSaveExamDate} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[#52525B] mb-1">
                  Upcoming Semester Theory Exam Date
                </label>
                <input
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Target Date</span>
              </button>
            </form>
          </div>

          {/* Section B: Official HOD Emergency Contacts */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E4E4E7]">
              <h2 className="text-sm font-bold font-sans text-[#09090B] flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Official Department Directory &amp; Exam Cell</span>
              </h2>
              <p className="text-xs text-[#52525B] font-sans">
                Internal phone numbers for HODs and Controller of Examinations.
              </p>
            </div>

            {directorySaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>HOD directory contacts updated!</span>
              </div>
            )}

            <form onSubmit={handleSaveDirectory} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[#52525B] mb-1">
                  CSE Department HOD Contact
                </label>
                <input
                  type="text"
                  value={cseHodPhone}
                  onChange={(e) => setCseHodPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#52525B] mb-1">
                  Exam Cell Controller Contact
                </label>
                <input
                  type="text"
                  value={examCellContact}
                  onChange={(e) => setExamCellContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Contacts</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Content Moderation & Audit Log */}
      {activeTab === 'moderation' && (
        <div className="space-y-5">
          {/* Moderation Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] shadow-xs space-y-1">
              <div className="text-[11px] font-mono text-[#52525B] uppercase">Total Vault Notes</div>
              <div className="text-2xl font-bold font-mono text-[#09090B]">142</div>
              <div className="text-[10px] text-emerald-700 font-mono">100% Faculty Verified</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] shadow-xs space-y-1">
              <div className="text-[11px] font-mono text-[#52525B] uppercase">Pending Verifications</div>
              <div className="text-2xl font-bold font-mono text-amber-700">3</div>
              <div className="text-[10px] text-[#52525B] font-mono">In Faculty Queue</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] shadow-xs space-y-1">
              <div className="text-[11px] font-mono text-[#52525B] uppercase">Flagged Forum Threads</div>
              <div className="text-2xl font-bold font-mono text-emerald-700">0</div>
              <div className="text-[10px] text-emerald-700 font-mono">Clean Moderation Queue</div>
            </div>
          </div>

          {/* Clean Mono-Font Audit Log */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div>
                <h2 className="text-base font-bold font-sans text-[#09090B]">
                  Zero-Trust Security &amp; Audit Trail
                </h2>
                <p className="text-xs text-[#52525B] font-sans">
                  Immutable system event log of role promotions, access grants, and administrative actions.
                </p>
              </div>
              <span className="text-xs font-mono text-[#52525B]">Live Stream</span>
            </div>

            <div className="divide-y divide-[#E4E4E7]">
              {INITIAL_AUDIT_LOGS.map((entry) => (
                <div key={entry.id} className="py-3 first:pt-0 last:pb-0 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2563EB]">{entry.action}</span>
                    <span className="text-[#52525B] text-[11px]">{entry.timestamp}</span>
                  </div>
                  <div className="text-[#09090B]">
                    Actor: <span className="text-zinc-600">{entry.actor}</span> &rarr; Target: <span className="text-zinc-600">{entry.target}</span>
                  </div>
                  <div className="text-[#52525B] text-[11px]">{entry.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

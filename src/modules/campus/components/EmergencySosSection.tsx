'use client';

import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Clock, 
  HeartPulse, 
  ShieldCheck, 
  AlertOctagon, 
  Sparkles,
  Info
} from 'lucide-react';
import { EmergencyContact } from '@/types';

interface EmergencySosSectionProps {
  emergencyContacts: EmergencyContact[];
}

export function EmergencySosSection({ emergencyContacts }: EmergencySosSectionProps) {
  return (
    <div className="w-full space-y-6">
      {/* Alert Header Box */}
      <div className="p-5 bg-red-50/70 border border-red-200 rounded-lg shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-red-600 text-white shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-red-950 tracking-tight flex items-center gap-2">
              SETGOI Emergency SOS & Crisis Response Hotlines
            </h2>
            <p className="text-xs text-red-800/90 mt-0.5 leading-relaxed">
              Immediate 24/7 assistance for first-aid emergencies, campus security, anti-ragging intervention, and student safety.
            </p>
          </div>
        </div>

        {/* Rapid Emergency Dial */}
        <a
          href="tel:+919434000001"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold transition-colors shrink-0 shadow-xs"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call Ambulance (+91 94340 00001)</span>
        </a>
      </div>

      {/* Grid of Emergency Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyContacts.map((contact) => {
          const isEmergencyHealth = contact.id === 'em-1' || contact.id === 'sos-first-aid';
          const isSecurity = contact.id === 'em-2' || contact.id === 'sos-security';
          const isAntiRagging = contact.id === 'em-3';
          const isWomenCell = contact.id === 'em-4';

          return (
            <div
              key={contact.id}
              className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all"
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isEmergencyHealth
                          ? 'bg-red-500 animate-pulse'
                          : isSecurity
                          ? 'bg-amber-500'
                          : isAntiRagging
                          ? 'bg-rose-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <span className="text-[11px] font-mono uppercase text-zinc-500 font-semibold">
                      {contact.department}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {contact.availableHours}
                  </span>
                </div>

                {/* Service Name */}
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight mb-2">
                  {contact.service}
                </h3>

                {/* Physical Location on Campus */}
                <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5 mb-4 text-xs text-zinc-600 flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase text-zinc-400 block">Physical Outpost:</span>
                    <span className="font-medium text-zinc-800">{contact.location}</span>
                  </div>
                </div>
              </div>

              {/* Call Action Bar */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                <div className="font-mono text-sm font-bold text-zinc-900">
                  {contact.phone}
                </div>

                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors border ${
                    isEmergencyHealth
                      ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>One-Tap Dial</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Protocol Quick Reference Card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 space-y-3">
        <h4 className="text-xs font-mono uppercase font-semibold text-zinc-800 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500" />
          Campus Incident Response Guidelines
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-600">
          <div className="p-3 bg-white border border-zinc-200 rounded">
            <strong className="text-zinc-900 block font-semibold mb-1">First-Aid & Health Emergencies</strong>
            Dial the Campus First-Aid Centre directly. The on-campus ambulance is stationed at the Main Administrative Complex.
          </div>
          <div className="p-3 bg-white border border-zinc-200 rounded">
            <strong className="text-zinc-900 block font-semibold mb-1">Anti-Ragging Zero Tolerance</strong>
            Ragging in any form is prohibited under Supreme Court & MAKAUT mandates. Call the 24-hr toll-free helpline anonymously.
          </div>
          <div className="p-3 bg-white border border-zinc-200 rounded">
            <strong className="text-zinc-900 block font-semibold mb-1">Night Perimeter Security</strong>
            For campus security patrols and night transit assistance across engineering blocks, call the Chief Security Officer.
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Bus, 
  Clock, 
  Phone, 
  MapPin, 
  Search, 
  ArrowRight, 
  Navigation, 
  CalendarDays,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { BusRoute } from '@/types';

interface BusTimingsDirectoryProps {
  busRoutes: BusRoute[];
}

export function BusTimingsDirectory({ busRoutes }: BusTimingsDirectoryProps) {
  const [activeRouteId, setActiveRouteId] = useState<string>(busRoutes[0]?.id || '');
  const [searchStop, setSearchStop] = useState('');

  const currentRoute = busRoutes.find((r) => r.id === activeRouteId) || busRoutes[0];

  // Stop filtering for stop finder
  const matchingStopsAcrossRoutes = searchStop.trim()
    ? busRoutes.flatMap((route) =>
        route.stops
          .filter((s) => s.stopName.toLowerCase().includes(searchStop.toLowerCase()))
          .map((s) => ({ ...s, routeNumber: route.routeNumber, routeName: route.routeName }))
      )
    : [];

  return (
    <div className="w-full space-y-6">
      {/* Route Switcher & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-lg shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <Bus className="w-4 h-4 text-sky-600" />
            SETGOI Daily College Shuttle Transit
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Official daily bus services connecting Asansol, Raniganj, Andal, and Durgapur Station to campus.
          </p>
        </div>

        {/* Route Select Tabs */}
        <div className="flex items-center gap-1.5 shrink-0">
          {busRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => setActiveRouteId(route.id)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors border ${
                activeRouteId === route.id
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {route.routeNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Stop Search Input */}
      <div className="p-3 bg-white border border-zinc-200 rounded-lg shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchStop}
            onChange={(e) => setSearchStop(e.target.value)}
            placeholder="Search your boarding point or landmark (e.g. 'City Centre', 'Raniganj', 'Muchipara')..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Search Results Preview if user typed */}
        {searchStop.trim() && (
          <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2">
            <div className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">
              Search Results Across All Bus Routes:
            </div>
            {matchingStopsAcrossRoutes.length === 0 ? (
              <p className="text-xs text-zinc-500 py-1">No matching bus stops found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingStopsAcrossRoutes.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">{st.stopName}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {st.routeNumber} • {st.routeName}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <div className="text-emerald-700 font-medium">Pickup: {st.timeMorning}</div>
                      <div className="text-amber-700">Drop: {st.timeEvening}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Route Detailed View */}
      {currentRoute && (
        <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xs space-y-6">
          {/* Route Overview Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-zinc-900 text-white">
                  {currentRoute.routeNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                  Bus: {currentRoute.busNumber}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                {currentRoute.routeName}
              </h3>
            </div>

            {/* Assigned Driver Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3 flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Assigned Driver:</span>
                <span className="font-semibold text-zinc-900 text-xs">{currentRoute.driverName}</span>
              </div>
              <a
                href={`tel:${currentRoute.driverContact}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-mono font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Driver</span>
              </a>
            </div>
          </div>

          {/* Timetable / Stops Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase font-semibold text-zinc-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Scheduled Stops & Pickup Timings
              </span>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Morning Pickup
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Evening Drop
                </span>
              </div>
            </div>

            {/* Table of stops */}
            <div className="border border-zinc-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-mono text-zinc-500 uppercase text-[11px]">
                    <th className="py-2.5 px-4 font-semibold w-12">#</th>
                    <th className="py-2.5 px-4 font-semibold">Boarding Point / Stop Name</th>
                    <th className="py-2.5 px-4 font-semibold text-emerald-700">Morning Pickup</th>
                    <th className="py-2.5 px-4 font-semibold text-amber-700">Evening Return Drop</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Destination Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {currentRoute.stops.map((stop, index) => {
                    const isCampus = stop.stopName.toLowerCase().includes('campus');
                    return (
                      <tr
                        key={index}
                        className={`transition-colors ${
                          isCampus ? 'bg-sky-50/50 font-medium' : 'hover:bg-zinc-50/70'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-zinc-400">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4 font-medium text-zinc-900 flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isCampus ? 'text-sky-600' : 'text-zinc-400'}`} />
                          <span>{stop.stopName}</span>
                          {isCampus && (
                            <span className="ml-1 text-[10px] font-mono uppercase px-1.5 py-0.2 bg-sky-100 text-sky-800 rounded border border-sky-200">
                              Terminal Campus
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-emerald-800">
                          {stop.timeMorning}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-amber-800">
                          {stop.timeEvening}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[11px] text-zinc-500">
                          {index === 0
                            ? 'Starting Station'
                            : isCampus
                            ? 'Arrival SETGOI'
                            : 'En-route Stop'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transit Pass Notice */}
          <div className="bg-zinc-50 border border-zinc-200 rounded p-3 text-xs text-zinc-600 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Valid SETGOI Transport ID Card or Semester Bus Pass mandatory for boarding.</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 shrink-0">Transport Desk Ext. 402</span>
          </div>
        </div>
      )}
    </div>
  );
}

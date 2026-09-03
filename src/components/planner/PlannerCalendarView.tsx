"use client";

import React, { useState, useMemo } from "react";
import { PlannedExam, ExamType } from "@/data/plannerData";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Target,
  Plus,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface PlannerCalendarViewProps {
  exams: PlannedExam[];
  onSelectDate: (dateStr: string) => void;
  selectedDate: string;
  onOpenAddModal: (dateStr?: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteExam: (id: string) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function PlannerCalendarView({
  exams,
  onSelectDate,
  selectedDate,
  onOpenAddModal,
  onToggleStatus,
  onDeleteExam,
}: PlannerCalendarViewProps) {
  // Find month of selected date or default to next upcoming exam
  const initialDate = useMemo(() => {
    if (selectedDate) return new Date(selectedDate);
    const sorted = [...exams].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const next = sorted.find((e) => new Date(e.startDate) >= new Date());
    return next ? new Date(next.startDate) : new Date();
  }, [exams, selectedDate]);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  // Map dates to events
  const dateEventsMap = useMemo(() => {
    const map = new Map<string, PlannedExam[]>();
    exams.forEach((ex) => {
      // Add start date
      const list = map.get(ex.startDate) || [];
      list.push(ex);
      map.set(ex.startDate, list);

      // If multi-day window (e.g. JEE Session)
      if (ex.endDate && ex.endDate !== ex.startDate) {
        const start = new Date(ex.startDate);
        const end = new Date(ex.endDate);
        const cur = new Date(start);
        cur.setDate(cur.getDate() + 1);

        while (cur <= end) {
          const dateKey = cur.toISOString().split("T")[0];
          const subList = map.get(dateKey) || [];
          if (!subList.some((e) => e.id === ex.id)) {
            subList.push(ex);
            map.set(dateKey, subList);
          }
          cur.setDate(cur.getDate() + 1);
        }
      }
    });
    return map;
  }, [exams]);

  // Calendar cells generation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const dateStr = prevDate.toISOString().split("T")[0];
      days.push({ dateStr, dayNum, isCurrentMonth: false });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const curDate = new Date(currentYear, currentMonth, dayNum);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      days.push({ dateStr, dayNum, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextDate = new Date(currentYear, currentMonth + 1, dayNum);
      const dateStr = nextDate.toISOString().split("T")[0];
      days.push({ dateStr, dayNum, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToNextExam = () => {
    const nowStr = new Date().toISOString().split("T")[0];
    const upcoming = [...exams]
      .filter((e) => e.startDate >= nowStr)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

    if (upcoming) {
      const d = new Date(upcoming.startDate);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      onSelectDate(upcoming.startDate);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const selectedDayEvents = dateEventsMap.get(selectedDate) || [];

  return (
    <div className="space-y-6">
      {/* Calendar Card Container */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        {/* Month Header Bar */}
        <div className="bg-black text-white p-3.5 sm:p-4 border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF4D00] text-black border border-black flex items-center justify-center font-headline text-sm font-bold shadow-[2px_2px_0px_0px_#FFFFFF]">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                <span>{MONTH_NAMES[currentMonth]}</span>
                <span className="text-[#FF4D00]">{currentYear}</span>
              </h3>
              <p className="font-meta text-[10px] text-neutral-400">
                Click on any date to inspect scheduled shifts, mocks, and syllabus milestones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleJumpToNextExam}
              className="px-3 py-1.5 bg-[#FF4D00] text-black hover:bg-white border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
            >
              NEXT MAJOR EXAM →
            </button>

            <div className="flex items-center border-2 border-black bg-white text-black">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[#FF4D00] transition-colors border-r border-black cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-[#FF4D00] transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="bg-neutral-100 border-b-2 border-black px-4 py-2 flex items-center gap-4 text-[10px] font-meta font-bold flex-wrap overflow-x-auto">
          <span className="text-neutral-500 uppercase">// EXAM KEY:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF4D00] border border-black inline-block"></span>
            <span>National NTA (JEE / BITSAT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-black border border-black inline-block"></span>
            <span>CBSE 12 Board Theory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 border border-black inline-block"></span>
            <span>School Pre-Boards</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-600 border border-black inline-block"></span>
            <span>Mock Drills / Practicals</span>
          </div>
        </div>

        {/* Weekday Grid Header */}
        <div className="grid grid-cols-7 border-b border-black bg-neutral-50 text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className={`py-2 text-[11px] font-meta font-bold border-r last:border-r-0 border-neutral-200 ${
                day === "SUN" ? "text-[#FF4D00]" : "text-black"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 auto-rows-fr bg-neutral-200 gap-[1px]">
          {calendarDays.map(({ dateStr, dayNum, isCurrentMonth }, idx) => {
            const dayEvents = dateEventsMap.get(dateStr) || [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(dateStr)}
                className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-orange-50 ring-2 ring-black ring-inset z-10"
                    : isCurrentMonth
                    ? "bg-white hover:bg-neutral-50"
                    : "bg-neutral-100/70 text-neutral-400 hover:bg-neutral-100"
                }`}
              >
                {/* Date header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-headline ${
                      isToday
                        ? "w-6 h-6 bg-[#FF4D00] text-black border border-black flex items-center justify-center font-bold"
                        : isCurrentMonth
                        ? "text-black"
                        : "text-neutral-400"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="font-meta text-[9px] font-bold px-1 bg-black text-[#FF4D00] border border-black">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Chips */}
                <div className="space-y-1 my-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => {
                    return (
                      <div
                        key={ev.id}
                        style={{
                          borderLeftColor: ev.color,
                        }}
                        className={`text-[9px] font-meta font-bold px-1 py-0.5 border-l-2 bg-neutral-50 border border-neutral-200 truncate ${
                          ev.examType === "national"
                            ? "text-[#FF4D00]"
                            : ev.examType === "cbse-board"
                            ? "text-black"
                            : "text-blue-700"
                        }`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <span className="text-[8px] font-meta text-neutral-500 font-bold block">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>

                {/* Day status indicator */}
                <div className="h-1 flex gap-0.5">
                  {dayEvents.map((ev, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: ev.color }}
                      className="flex-1 h-full"
                    ></span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Panel */}
      <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-black gap-2">
          <div>
            <span className="font-meta text-[10px] font-bold text-[#FF4D00] uppercase tracking-wider">
              // DAY SCHEDULE INSPECTOR
            </span>
            <h4 className="font-headline text-lg sm:text-xl text-black">
              {new Date(selectedDate).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h4>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModal(selectedDate)}
            className="px-3.5 py-1.5 bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-[2px_2px_0px_0px_#000000]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD PLAN FOR THIS DAY</span>
          </button>
        </div>

        {/* Selected Day Content */}
        <div className="pt-4">
          {selectedDayEvents.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-neutral-300 bg-neutral-50">
              <CalendarIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="font-headline text-sm text-neutral-700">NO EXAMS OR MILESTONES SCHEDULED ON THIS DAY</p>
              <p className="font-meta text-xs text-neutral-500 mt-1">
                Ideal date for an undisturbed high-intensity revision sprint or full PYQ mock test.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  style={{ borderLeftColor: ev.color }}
                  className="p-3.5 sm:p-4 border-2 border-black border-l-6 bg-white shadow-[2px_2px_0px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        style={{ backgroundColor: ev.color }}
                        className="font-meta text-[9px] text-white px-2 py-0.5 font-bold uppercase"
                      >
                        {ev.badgeLabel}
                      </span>
                      {ev.timeSlot && (
                        <span className="font-meta text-[10px] text-neutral-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.timeSlot}
                        </span>
                      )}
                      {ev.targetScore && (
                        <span className="font-meta text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 font-bold flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {ev.targetScore}
                        </span>
                      )}
                    </div>

                    <h5 className="font-headline text-base text-black">{ev.title}</h5>

                    {ev.notes && (
                      <p className="text-xs font-sans text-neutral-600 leading-relaxed max-w-2xl">
                        {ev.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {ev.subjects.map((s) => (
                        <span
                          key={s}
                          className="font-meta text-[9px] bg-neutral-100 border border-black px-1.5 py-0.5 text-black font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(ev.id)}
                      className={`px-3 py-1.5 border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        ev.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-black hover:bg-neutral-100"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ev.status === "completed" ? "COMPLETED" : "MARK DONE"}</span>
                    </button>

                    {!ev.isOfficial && (
                      <button
                        type="button"
                        onClick={() => onDeleteExam(ev.id)}
                        className="p-1.5 border-2 border-black bg-white hover:bg-red-500 hover:text-white text-black transition-colors cursor-pointer"
                        title="Delete Custom Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

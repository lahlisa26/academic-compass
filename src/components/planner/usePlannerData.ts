import { useEffect, useState } from "react";

export type ClassInfo = {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
};

export type ScheduleSlot = {
  id: string;
  day: string;
  time: string;
  subject: string;
};

export type Assignment = {
  id: string;
  name: string;
  subject: string;
  due: string;
  status: "todo" | "doing" | "done";
};

export type Grade = {
  id: string;
  subject: string;
  title: string;
  score: string;
  weight: string;
};

export type StudySession = {
  id: string;
  date: string;
  subject: string;
  minutes: number;
  topic: string;
};

export type ReadingItem = {
  id: string;
  title: string;
  author: string;
  pages: number;
  done: boolean;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  subject: string;
  updated: string;
};

export type PlannerData = {
  classes: ClassInfo[];
  schedule: ScheduleSlot[];
  assignments: Assignment[];
  grades: Grade[];
  study: StudySession[];
  reading: ReadingItem[];
  notes: Note[];
  semesterOverview: Record<string, string>;
  planner: Record<string, string>;
};

const STORAGE_KEY = "academic-compass:v1";

const defaultData: PlannerData = {
  classes: [],
  schedule: [],
  assignments: [],
  grades: [],
  study: [],
  reading: [],
  notes: [],
  semesterOverview: {},
  planner: {},
};

export function usePlannerData() {
  const [data, setData] = useState<PlannerData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...defaultData, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, hydrated]);

  return { data, setData };
}

export const uid = () => Math.random().toString(36).slice(2, 10);

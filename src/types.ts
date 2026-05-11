/**
 * Výčtový typ pro druhy kardio aktivit.
 * Každá hodnota odpovídá jednomu sportu s vlastní MET hodnotou.
 */
export enum CardioType {
  RUN   = 'Běh',
  CYCLE = 'Kolo',
  SWIM  = 'Plavání',
  ROW   = 'Veslování',
}

/**
 * Výčtový typ obtížnosti silového tréninku.
 * Ovlivňuje koeficient při výpočtu kalorií.
 */
export enum Difficulty {
  EASY   = 'Lehký',
  MEDIUM = 'Střední',
  HARD   = 'Těžký',
}

/** Souhrnné statistiky tréninkového plánu. */
export interface PlanStats {
  totalWorkouts: number;
  totalCalories: number;
  avgDurationMinutes: number;
  cardioCount: number;
  strengthCount: number;
}

/** Tvar surového záznamu kardio tréninku v číselníku dat. */
export interface RawCardioData {
  name: string;
  durationMinutes: number;
  date: Date;
  distanceKm: number;
  avgHeartRate: number;
  cardioType: CardioType;
  userWeightKg: number;
  notes?: string;
}

/** Tvar surového záznamu cviku v číselníku dat. */
export interface RawExerciseData {
  exerciseName: string;
  sets: number;
  reps: number;
  weightKg: number;
}

/** Tvar surového záznamu silového tréninku v číselníku dat. */
export interface RawStrengthData {
  name: string;
  durationMinutes: number;
  date: Date;
  difficulty: Difficulty;
  restBetweenSets: number;
  notes?: string;
  exercises: RawExerciseData[];
}

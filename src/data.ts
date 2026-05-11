import { CardioType, Difficulty, RawCardioData, RawStrengthData } from './types';

/**
 * Číselník kardio tréninků – pole prostých datových objektů.
 * V main.ts jsou z těchto dat vytvořeny instance třídy CardioWorkout.
 */
export const rawCardioWorkouts: RawCardioData[] = [
  {
    name: 'Ranní běh v parku',
    durationMinutes: 45,
    date: new Date('2025-05-01'),
    distanceKm: 7.5,
    avgHeartRate: 145,
    cardioType: CardioType.RUN,
    userWeightKg: 75,
    notes: 'Příjemné tempo, krásné počasí',
  },
  {
    name: 'Cyklovýlet mimo město',
    durationMinutes: 90,
    date: new Date('2025-05-03'),
    distanceKm: 35.0,
    avgHeartRate: 128,
    cardioType: CardioType.CYCLE,
    userWeightKg: 75,
  },
  {
    name: 'Interval plavání',
    durationMinutes: 60,
    date: new Date('2025-05-05'),
    distanceKm: 2.0,
    avgHeartRate: 158,
    cardioType: CardioType.SWIM,
    userWeightKg: 75,
    notes: 'Střídání sprint / odpočinek 4×',
  },
  {
    name: 'Veslování na ergometru',
    durationMinutes: 30,
    date: new Date('2025-05-07'),
    distanceKm: 6.0,
    avgHeartRate: 162,
    cardioType: CardioType.ROW,
    userWeightKg: 75,
    notes: 'Maximální intenzita',
  },
];

/**
 * Číselník silových tréninků – pole prostých datových objektů.
 * V main.ts jsou z těchto dat vytvořeny instance třídy StrengthWorkout
 * spolu s instances třídy Exercise pro každý cvik.
 */
export const rawStrengthWorkouts: RawStrengthData[] = [
  {
    name: 'Trénink horní části těla',
    durationMinutes: 60,
    date: new Date('2025-05-02'),
    difficulty: Difficulty.MEDIUM,
    restBetweenSets: 90,
    exercises: [
      { exerciseName: 'Bench press',        sets: 4, reps: 8,  weightKg: 80 },
      { exerciseName: 'Přítahy na hrazdě', sets: 4, reps: 8,  weightKg: 10 },
      { exerciseName: 'Tlaky s činkami',   sets: 3, reps: 10, weightKg: 22 },
      { exerciseName: 'Bicepsové zdvihy',  sets: 3, reps: 12, weightKg: 15 },
    ],
  },
  {
    name: 'Trénink dolní části těla',
    durationMinutes: 75,
    date: new Date('2025-05-04'),
    difficulty: Difficulty.HARD,
    restBetweenSets: 120,
    notes: 'Maximální váhy – den síly',
    exercises: [
      { exerciseName: 'Dřep',                  sets: 5, reps: 5,  weightKg: 100 },
      { exerciseName: 'Rumunský mrtvý tah',    sets: 4, reps: 8,  weightKg: 90  },
      { exerciseName: 'Leg press',             sets: 3, reps: 12, weightKg: 140 },
      { exerciseName: 'Výpady s činkami',      sets: 3, reps: 10, weightKg: 20  },
    ],
  },
  {
    name: 'Celotělový trénink',
    durationMinutes: 50,
    date: new Date('2025-05-06'),
    difficulty: Difficulty.EASY,
    restBetweenSets: 60,
    notes: 'Regenerační trénink – nízká intenzita',
    exercises: [
      { exerciseName: 'Kliky',             sets: 3, reps: 15, weightKg: 0  },
      { exerciseName: 'Dřep s vlastní váhou', sets: 3, reps: 20, weightKg: 0 },
      { exerciseName: 'Plank',             sets: 3, reps: 1,  weightKg: 0  },
    ],
  },
];

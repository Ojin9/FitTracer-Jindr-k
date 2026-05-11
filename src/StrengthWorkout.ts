import { WorkoutItem } from './WorkoutItem';
import { Difficulty } from './types';
import { Exercise } from './Exercise';

/**
 * Koeficienty obtížnosti pro odhad kalorického výdeje.
 * Vynásobí se celkovým zdvižným objemem.
 */
const DIFFICULTY_COEF: Record<Difficulty, number> = {
  [Difficulty.EASY]:   0.03,
  [Difficulty.MEDIUM]: 0.05,
  [Difficulty.HARD]:   0.07,
};

/**
 * Konkrétní třída pro silový trénink s činkami.
 * Dědí z WorkoutItem a spravuje seznam cviků (Exercise[]).
 */
export class StrengthWorkout extends WorkoutItem {
  private readonly exercises: Exercise[] = [];
  private readonly restBetweenSets: number;
  private readonly difficulty: Difficulty;

  /**
   * @param name             Název tréninku
   * @param durationMinutes  Délka v minutách
   * @param date             Datum
   * @param difficulty       Obtížnost tréninku (EASY | MEDIUM | HARD)
   * @param restBetweenSets  Pauza mezi sériemi v sekundách (≥ 0)
   * @param notes            Volitelná poznámka
   */
  constructor(
    name: string,
    durationMinutes: number,
    date: Date,
    difficulty: Difficulty,
    restBetweenSets: number,
    notes = '',
  ) {
    super(name, durationMinutes, date, notes);
    if (restBetweenSets < 0) throw new Error('Pauza mezi sériemi nesmí být záporná.');

    this.difficulty      = difficulty;
    this.restBetweenSets = restBetweenSets;
  }

  /** Přidá cvik do seznamu tréninku. */
  addExercise(exercise: Exercise): void {
    this.exercises.push(exercise);
  }

  /** Celkový zdvižený objem – součet objemů všech cviků (kg). */
  getTotalVolume(): number {
    return this.exercises.reduce((sum, ex) => sum + ex.getVolume(), 0);
  }

  /**
   * Odhad spálených kalorií ze vzorce:
   * kalorie = celkový_objem(kg) × koeficient_obtížnosti
   */
  calculateCalories(): number {
    return Math.round(this.getTotalVolume() * DIFFICULTY_COEF[this.difficulty]);
  }

  /**
   * Odhadované 1RM pro zadaný cvik dle Epleyho vzorce:
   * 1RM = váha × (1 + opakování / 30)
   *
   * @param exerciseName Název cviku (porovnání bez rozlišení velkých/malých písmen)
   * @returns Odhadované 1RM v kg, nebo 0 pokud cvik není nalezen
   */
  getOneRepMax(exerciseName: string): number {
    const ex = this.exercises.find(
      e => e.getExerciseName().toLowerCase() === exerciseName.toLowerCase(),
    );
    if (!ex) return 0;
    return Math.round(ex.getWeightKg() * (1 + ex.getReps() / 30));
  }

  /** Vrátí kopii pole cviků (zapouzdření – zabraňuje přímé mutaci). */
  getExercises(): Exercise[] { return [...this.exercises]; }
  getDifficulty(): Difficulty { return this.difficulty; }
  getRestBetweenSets(): number { return this.restBetweenSets; }

  /** Vrátí formátovaný souhrn silového tréninku pro výpis do konzole. */
  getSummary(): string {
    const exerciseLines = this.exercises.length > 0
      ? this.exercises.map(ex => `    • ${ex.toString()}`).join('\n')
      : '    (žádné cviky)';

    const lines = [
      `[SILOVÝ] ${this.name} – ${this.difficulty}`,
      `  Datum:             ${this.date.toLocaleDateString('cs-CZ')}`,
      `  Délka:             ${this.durationMinutes} min | Pauza: ${this.restBetweenSets} s`,
      `  Cviky:`,
      exerciseLines,
      `  Celkový objem:     ${this.getTotalVolume()} kg`,
      `  Spálené kalorie:   ${this.calculateCalories()} kcal`,
    ];
    if (this.notes) lines.push(`  Poznámky:          ${this.notes}`);
    return lines.join('\n');
  }
}

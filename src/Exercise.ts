/**
 * Hodnotový objekt reprezentující jeden cvik v silovém tréninku.
 * Uchovává název, počet sérií, opakování a váhu.
 */
export class Exercise {
  private readonly exerciseName: string;
  private readonly sets: number;
  private readonly reps: number;
  private readonly weightKg: number;

  /**
   * @param exerciseName Název cviku (nesmí být prázdný)
   * @param sets         Počet sérií (musí být > 0)
   * @param reps         Počet opakování v sérii (musí být > 0)
   * @param weightKg     Použitá váha v kg (nesmí být záporná)
   */
  constructor(exerciseName: string, sets: number, reps: number, weightKg: number) {
    if (!exerciseName.trim()) throw new Error('Název cviku nesmí být prázdný.');
    if (sets <= 0)           throw new Error('Počet sérií musí být kladný.');
    if (reps <= 0)           throw new Error('Počet opakování musí být kladný.');
    if (weightKg < 0)        throw new Error('Váha nesmí být záporná.');

    this.exerciseName = exerciseName.trim();
    this.sets         = sets;
    this.reps         = reps;
    this.weightKg     = weightKg;
  }

  /** Celkový zdvižený objem: série × opakování × váha (kg). */
  getVolume(): number {
    return this.sets * this.reps * this.weightKg;
  }

  getExerciseName(): string { return this.exerciseName; }
  getSets(): number         { return this.sets; }
  getReps(): number         { return this.reps; }
  getWeightKg(): number     { return this.weightKg; }

  /** Textová reprezentace cviku pro výpis do konzole. */
  toString(): string {
    return `${this.exerciseName}: ${this.sets}×${this.reps} @ ${this.weightKg} kg (objem: ${this.getVolume()} kg)`;
  }
}

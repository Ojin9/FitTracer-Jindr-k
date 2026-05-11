import { WorkoutItem } from './WorkoutItem';
import { CardioType } from './types';

/**
 * MET (Metabolický ekvivalent) hodnoty pro každý typ kardio aktivity.
 * Zdroj: Compendium of Physical Activities.
 */
const MET_VALUES: Record<CardioType, number> = {
  [CardioType.RUN]:   9.8,
  [CardioType.CYCLE]: 7.5,
  [CardioType.SWIM]:  8.0,
  [CardioType.ROW]:   7.0,
};

/**
 * Konkrétní třída pro kardio trénink (běh, kolo, plavání, veslování).
 * Dědí z WorkoutItem a přidává atributy a metody specifické pro vytrvalostní aktivity.
 */
export class CardioWorkout extends WorkoutItem {
  private readonly distanceKm: number;
  private readonly avgHeartRate: number;
  private readonly cardioType: CardioType;
  private readonly userWeightKg: number;

  /**
   * @param name            Název tréninku
   * @param durationMinutes Délka v minutách
   * @param date            Datum
   * @param distanceKm      Ujetá/uplavená vzdálenost v km (musí být > 0)
   * @param avgHeartRate    Průměrná tepová frekvence v bpm (1–250)
   * @param cardioType      Typ aktivity (RUN | CYCLE | SWIM | ROW)
   * @param userWeightKg    Hmotnost uživatele v kg (musí být > 0)
   * @param notes           Volitelná poznámka
   */
  constructor(
    name: string,
    durationMinutes: number,
    date: Date,
    distanceKm: number,
    avgHeartRate: number,
    cardioType: CardioType,
    userWeightKg: number,
    notes = '',
  ) {
    super(name, durationMinutes, date, notes);
    if (distanceKm <= 0)                       throw new Error('Vzdálenost musí být kladná.');
    if (avgHeartRate <= 0 || avgHeartRate > 250) throw new Error('Tepová frekvence musí být v rozsahu 1–250 bpm.');
    if (userWeightKg <= 0)                     throw new Error('Hmotnost uživatele musí být kladná.');

    this.distanceKm   = distanceKm;
    this.avgHeartRate = avgHeartRate;
    this.cardioType   = cardioType;
    this.userWeightKg = userWeightKg;
  }

  /**
   * Výpočet spálených kalorií pomocí MET vzorce:
   * kalorie = MET × hmotnost(kg) × čas(hod)
   */
  calculateCalories(): number {
    const hours = this.durationMinutes / 60;
    return Math.round(MET_VALUES[this.cardioType] * this.userWeightKg * hours);
  }

  /**
   * Tempo v minutách na km (čas / vzdálenost).
   * @returns Tempo jako desetinné číslo (celá část = minuty, desetiny × 60 = sekundy)
   */
  getPace(): number {
    return this.durationMinutes / this.distanceKm;
  }

  /**
   * Srdeční zóna na základě průměrné tepové frekvence.
   * Pásma jsou orientační – nezohledňují věk uživatele.
   */
  getCardioZone(): string {
    if (this.avgHeartRate < 120) return 'Zotavovací (< 120 bpm)';
    if (this.avgHeartRate < 140) return 'Aerobní (120–139 bpm)';
    if (this.avgHeartRate < 160) return 'Anaerobní (140–159 bpm)';
    return 'Maximální výkon (≥ 160 bpm)';
  }

  getDistanceKm(): number   { return this.distanceKm; }
  getAvgHeartRate(): number { return this.avgHeartRate; }
  getCardioType(): CardioType { return this.cardioType; }

  /** Formátuje tempo jako MM:SS min/km. */
  private formatPace(): string {
    const pace   = this.getPace();
    const min    = Math.floor(pace);
    const sec    = Math.round((pace - min) * 60);
    return `${min}:${sec.toString().padStart(2, '0')} min/km`;
  }

  /** Vrátí formátovaný souhrn kardio tréninku pro výpis do konzole. */
  getSummary(): string {
    const lines = [
      `[KARDIO] ${this.name} – ${this.cardioType}`,
      `  Datum:             ${this.date.toLocaleDateString('cs-CZ')}`,
      `  Délka:             ${this.durationMinutes} min`,
      `  Vzdálenost:        ${this.distanceKm} km`,
      `  Tempo:             ${this.formatPace()}`,
      `  Tep. frekvence:    ${this.avgHeartRate} bpm → ${this.getCardioZone()}`,
      `  Spálené kalorie:   ${this.calculateCalories()} kcal`,
    ];
    if (this.notes) lines.push(`  Poznámky:          ${this.notes}`);
    return lines.join('\n');
  }
}

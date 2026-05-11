import { WorkoutItem } from './WorkoutItem';
import { CardioWorkout } from './CardioWorkout';
import { StrengthWorkout } from './StrengthWorkout';
import { PlanStats } from './types';

/**
 * Agregátor tréninkových jednotek – správce tréninkového plánu.
 *
 * Uchovává pole WorkoutItem[], tedy libovolnou kombinaci CardioWorkout
 * a StrengthWorkout objektů. Metody pracují polymorfně – volají
 * calculateCalories() a getSummary() bez znalosti konkrétního podtypu.
 */
export class WorkoutPlan {
  private readonly items: WorkoutItem[] = [];
  private readonly name: string;

  /** @param name Název tréninkového plánu (nesmí být prázdný) */
  constructor(name: string) {
    if (!name.trim()) throw new Error('Název plánu nesmí být prázdný.');
    this.name = name.trim();
  }

  /** Přidá trénink do plánu. */
  addItem(item: WorkoutItem): void {
    this.items.push(item);
  }

  /**
   * Celkové spálené kalorie – polymorfní průchod polem.
   * Každý objekt spustí svůj vlastní calculateCalories() vzorec.
   */
  getTotalCalories(): number {
    return this.items.reduce((sum, item) => sum + item.calculateCalories(), 0);
  }

  /** Vypočítá souhrnné statistiky celého plánu. */
  getStats(): PlanStats {
    const totalWorkouts = this.items.length;
    const totalCalories = this.getTotalCalories();
    const avgDurationMinutes = totalWorkouts > 0
      ? Math.round(this.items.reduce((s, i) => s + i.getDurationMinutes(), 0) / totalWorkouts)
      : 0;
    const cardioCount    = this.items.filter(i => i instanceof CardioWorkout).length;
    const strengthCount  = this.items.filter(i => i instanceof StrengthWorkout).length;

    return { totalWorkouts, totalCalories, avgDurationMinutes, cardioCount, strengthCount };
  }

  /** Vrátí formátovaný souhrnný výpis statistik plánu. */
  getSummary(): string {
    const s = this.getStats();
    return [
      `${'='.repeat(55)}`,
      `  Tréninkový plán: ${this.name}`,
      `${'='.repeat(55)}`,
      `  Celkem tréninků:       ${s.totalWorkouts}  (Kardio: ${s.cardioCount}, Silový: ${s.strengthCount})`,
      `  Celkové kalorie:       ${s.totalCalories} kcal`,
      `  Průměrná délka:        ${s.avgDurationMinutes} min`,
      `${'='.repeat(55)}`,
    ].join('\n');
  }

  /** Vrátí kopii pole tréninků (zapouzdření). */
  getItems(): WorkoutItem[] { return [...this.items]; }
  getName(): string { return this.name; }
}

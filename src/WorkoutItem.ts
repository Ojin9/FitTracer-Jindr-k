/**
 * Abstraktní bázová třída pro všechny typy tréninku.
 *
 * Definuje společné chráněné atributy (id, name, durationMinutes, date, notes)
 * a předepisuje dvě abstraktní metody, které musí každý potomek implementovat:
 *   - calculateCalories() – vlastní výpočetní vzorec
 *   - getSummary()        – formátovaný textový výstup
 */
export abstract class WorkoutItem {
  protected readonly id: string;
  protected readonly name: string;
  protected readonly durationMinutes: number;
  protected readonly date: Date;
  protected readonly notes: string;

  /**
   * @param name            Název tréninku (nesmí být prázdný)
   * @param durationMinutes Délka tréninku v minutách (musí být > 0)
   * @param date            Datum provedení tréninku
   * @param notes           Volitelná poznámka
   */
  constructor(name: string, durationMinutes: number, date: Date, notes = '') {
    if (!name.trim())        throw new Error('Název tréninku nesmí být prázdný.');
    if (durationMinutes <= 0) throw new Error('Délka tréninku musí být kladná.');

    // Jednoduché unikátní ID bez externích závislostí
    this.id              = `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    this.name            = name.trim();
    this.durationMinutes = durationMinutes;
    this.date            = date;
    this.notes           = notes;
  }

  /** Každý potomek implementuje vlastní vzorec pro výpočet spálených kalorií. */
  abstract calculateCalories(): number;

  /** Každý potomek formátuje vlastní textový souhrn tréninku. */
  abstract getSummary(): string;

  getId(): string             { return this.id; }
  getName(): string           { return this.name; }
  getDurationMinutes(): number { return this.durationMinutes; }
  getDate(): Date             { return this.date; }
  getNotes(): string          { return this.notes; }
}

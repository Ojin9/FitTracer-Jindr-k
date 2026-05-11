/**
 * FitTracker Pro – zkompilovaný JS výstup
 * Zdrojový TypeScript je v src/ (přesně odpovídá UML diagramu z dokumentu)
 * Tento soubor načítá index.html a výstup se zobrazuje v konzoli prohlížeče (F12)
 */

// ═══════════════════════════════════════════════════════
// ENUMERACE
// ═══════════════════════════════════════════════════════

/** Typy kardio aktivit (odpovídá enum CardioType v src/types.ts) */
const CardioType = Object.freeze({
  RUN:   'Běh',
  CYCLE: 'Kolo',
  SWIM:  'Plavání',
  ROW:   'Veslování',
});

/** Obtížnost silového tréninku (odpovídá enum Difficulty v src/types.ts) */
const Difficulty = Object.freeze({
  EASY:   'Lehký',
  MEDIUM: 'Střední',
  HARD:   'Těžký',
});

// ═══════════════════════════════════════════════════════
// EXERCISE – hodnotový objekt
// ═══════════════════════════════════════════════════════

/**
 * Hodnotový objekt reprezentující jeden cvik v silovém tréninku.
 * Uchovává název, počet sérií, opakování a váhu.
 */
class Exercise {
  // Soukromá pole zajišťují zapouzdření (encapsulation)
  #exerciseName;
  #sets;
  #reps;
  #weightKg;

  constructor(exerciseName, sets, reps, weightKg) {
    if (!exerciseName.trim()) throw new Error('Název cviku nesmí být prázdný.');
    if (sets <= 0)            throw new Error('Počet sérií musí být kladný.');
    if (reps <= 0)            throw new Error('Počet opakování musí být kladný.');
    if (weightKg < 0)         throw new Error('Váha nesmí být záporná.');

    this.#exerciseName = exerciseName.trim();
    this.#sets         = sets;
    this.#reps         = reps;
    this.#weightKg     = weightKg;
  }

  /** Celkový zdvižený objem: série × opakování × váha (kg) */
  getVolume()       { return this.#sets * this.#reps * this.#weightKg; }

  getExerciseName() { return this.#exerciseName; }
  getSets()         { return this.#sets; }
  getReps()         { return this.#reps; }
  getWeightKg()     { return this.#weightKg; }

  toString() {
    return `${this.#exerciseName}: ${this.#sets}×${this.#reps} @ ${this.#weightKg} kg (objem: ${this.getVolume()} kg)`;
  }
}

// ═══════════════════════════════════════════════════════
// WORKOUTITEM – abstraktní bázová třída
// ═══════════════════════════════════════════════════════

/**
 * Abstraktní bázová třída pro všechny typy tréninku.
 * Definuje společné atributy a předepisuje abstraktní metody
 * calculateCalories() a getSummary(), které musí implementovat každý potomek.
 *
 * TypeScript verze: src/WorkoutItem.ts  (abstract class WorkoutItem)
 */
class WorkoutItem {
  // Chráněné atributy – přístupné potomkům
  _id;
  _name;
  _durationMinutes;
  _date;
  _notes;

  constructor(name, durationMinutes, date, notes = '') {
    // Abstraktní třída – přímá instanciace je zakázána
    if (new.target === WorkoutItem) {
      throw new Error('WorkoutItem je abstraktní třída – nelze přímo instanciovat.');
    }
    if (!name.trim())         throw new Error('Název tréninku nesmí být prázdný.');
    if (durationMinutes <= 0) throw new Error('Délka tréninku musí být kladná.');

    this._id              = `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    this._name            = name.trim();
    this._durationMinutes = durationMinutes;
    this._date            = date;
    this._notes           = notes;
  }

  /** Abstraktní metoda – každý potomek implementuje vlastní vzorec kalorií */
  calculateCalories() { throw new Error('calculateCalories() musí implementovat potomek.'); }

  /** Abstraktní metoda – každý potomek formátuje vlastní textový souhrn */
  getSummary()        { throw new Error('getSummary() musí implementovat potomek.'); }

  getId()              { return this._id; }
  getName()            { return this._name; }
  getDurationMinutes() { return this._durationMinutes; }
  getDate()            { return this._date; }
  getNotes()           { return this._notes; }
}

// ═══════════════════════════════════════════════════════
// CARDIOWORKOUT – potomek WorkoutItem
// ═══════════════════════════════════════════════════════

/**
 * MET hodnoty pro výpočet kalorií dle typu aktivity.
 * Zdroj: Compendium of Physical Activities.
 */
const MET_VALUES = {
  [CardioType.RUN]:   9.8,
  [CardioType.CYCLE]: 7.5,
  [CardioType.SWIM]:  8.0,
  [CardioType.ROW]:   7.0,
};

/**
 * Konkrétní třída pro kardio trénink (běh, kolo, plavání, veslování).
 * Dědí z WorkoutItem, přidává vzdálenost, tepovou frekvenci a typ aktivity.
 *
 * TypeScript verze: src/CardioWorkout.ts  (class CardioWorkout extends WorkoutItem)
 */
class CardioWorkout extends WorkoutItem {
  #distanceKm;
  #avgHeartRate;
  #cardioType;
  #userWeightKg;

  constructor(name, durationMinutes, date, distanceKm, avgHeartRate, cardioType, userWeightKg, notes = '') {
    super(name, durationMinutes, date, notes);
    if (distanceKm <= 0)                        throw new Error('Vzdálenost musí být kladná.');
    if (avgHeartRate <= 0 || avgHeartRate > 250) throw new Error('Tepová frekvence musí být v rozsahu 1–250 bpm.');
    if (userWeightKg <= 0)                      throw new Error('Hmotnost uživatele musí být kladná.');

    this.#distanceKm   = distanceKm;
    this.#avgHeartRate = avgHeartRate;
    this.#cardioType   = cardioType;
    this.#userWeightKg = userWeightKg;
  }

  /**
   * Výpočet kalorií pomocí MET vzorce:
   * kalorie = MET × hmotnost(kg) × čas(hod)
   */
  calculateCalories() {
    const hours = this._durationMinutes / 60;
    return Math.round(MET_VALUES[this.#cardioType] * this.#userWeightKg * hours);
  }

  /** Tempo v minutách na km */
  getPace() { return this._durationMinutes / this.#distanceKm; }

  /**
   * Srdeční zóna dle průměrné tepové frekvence.
   * Pásma jsou orientační – nezohledňují věk.
   */
  getCardioZone() {
    if (this.#avgHeartRate < 120) return 'Zotavovací (< 120 bpm)';
    if (this.#avgHeartRate < 140) return 'Aerobní (120–139 bpm)';
    if (this.#avgHeartRate < 160) return 'Anaerobní (140–159 bpm)';
    return 'Maximální výkon (≥ 160 bpm)';
  }

  getDistanceKm()   { return this.#distanceKm; }
  getAvgHeartRate() { return this.#avgHeartRate; }
  getCardioType()   { return this.#cardioType; }

  #formatPace() {
    const pace = this.getPace();
    const min  = Math.floor(pace);
    const sec  = Math.round((pace - min) * 60).toString().padStart(2, '0');
    return `${min}:${sec} min/km`;
  }

  getSummary() {
    const lines = [
      `[KARDIO] ${this._name} – ${this.#cardioType}`,
      `  Datum:             ${this._date.toLocaleDateString('cs-CZ')}`,
      `  Délka:             ${this._durationMinutes} min`,
      `  Vzdálenost:        ${this.#distanceKm} km`,
      `  Tempo:             ${this.#formatPace()}`,
      `  Tep. frekvence:    ${this.#avgHeartRate} bpm → ${this.getCardioZone()}`,
      `  Spálené kalorie:   ${this.calculateCalories()} kcal`,
    ];
    if (this._notes) lines.push(`  Poznámky:          ${this._notes}`);
    return lines.join('\n');
  }
}

// ═══════════════════════════════════════════════════════
// STRENGTHWORKOUT – potomek WorkoutItem
// ═══════════════════════════════════════════════════════

/** Koeficienty obtížnosti pro odhad kalorického výdeje */
const DIFFICULTY_COEF = {
  [Difficulty.EASY]:   0.03,
  [Difficulty.MEDIUM]: 0.05,
  [Difficulty.HARD]:   0.07,
};

/**
 * Konkrétní třída pro silový trénink s činkami.
 * Dědí z WorkoutItem, spravuje seznam cviků (Exercise[]).
 *
 * TypeScript verze: src/StrengthWorkout.ts  (class StrengthWorkout extends WorkoutItem)
 */
class StrengthWorkout extends WorkoutItem {
  #exercises = [];
  #restBetweenSets;
  #difficulty;

  constructor(name, durationMinutes, date, difficulty, restBetweenSets, notes = '') {
    super(name, durationMinutes, date, notes);
    if (restBetweenSets < 0) throw new Error('Pauza mezi sériemi nesmí být záporná.');

    this.#difficulty      = difficulty;
    this.#restBetweenSets = restBetweenSets;
  }

  /** Přidá cvik do tréninku */
  addExercise(exercise) { this.#exercises.push(exercise); }

  /** Celkový zdvižený objem – součet objemů všech cviků (kg) */
  getTotalVolume() {
    return this.#exercises.reduce((sum, ex) => sum + ex.getVolume(), 0);
  }

  /**
   * Odhad spálených kalorií:
   * kalorie = celkový_objem(kg) × koeficient_obtížnosti
   */
  calculateCalories() {
    return Math.round(this.getTotalVolume() * DIFFICULTY_COEF[this.#difficulty]);
  }

  /**
   * Odhadované 1RM dle Epleyho vzorce:
   * 1RM = váha × (1 + opakování / 30)
   */
  getOneRepMax(exerciseName) {
    const ex = this.#exercises.find(
      e => e.getExerciseName().toLowerCase() === exerciseName.toLowerCase()
    );
    if (!ex) return 0;
    return Math.round(ex.getWeightKg() * (1 + ex.getReps() / 30));
  }

  getExercises()      { return [...this.#exercises]; }  // kopie – zapouzdření
  getDifficulty()     { return this.#difficulty; }
  getRestBetweenSets() { return this.#restBetweenSets; }

  getSummary() {
    const exLines = this.#exercises.length > 0
      ? this.#exercises.map(ex => `    • ${ex.toString()}`).join('\n')
      : '    (žádné cviky)';

    const lines = [
      `[SILOVÝ] ${this._name} – ${this.#difficulty}`,
      `  Datum:             ${this._date.toLocaleDateString('cs-CZ')}`,
      `  Délka:             ${this._durationMinutes} min | Pauza: ${this.#restBetweenSets} s`,
      `  Cviky:`,
      exLines,
      `  Celkový objem:     ${this.getTotalVolume()} kg`,
      `  Spálené kalorie:   ${this.calculateCalories()} kcal`,
    ];
    if (this._notes) lines.push(`  Poznámky:          ${this._notes}`);
    return lines.join('\n');
  }
}

// ═══════════════════════════════════════════════════════
// WORKOUTPLAN – agregátor tréninků
// ═══════════════════════════════════════════════════════

/**
 * Agregátor tréninkových jednotek – správce tréninkového plánu.
 * Uchovává pole WorkoutItem[] a pracuje polymorfně.
 *
 * TypeScript verze: src/WorkoutPlan.ts  (class WorkoutPlan)
 */
class WorkoutPlan {
  #items = [];
  #name;

  constructor(name) {
    if (!name.trim()) throw new Error('Název plánu nesmí být prázdný.');
    this.#name = name.trim();
  }

  addItem(item) { this.#items.push(item); }

  /**
   * Celkové kalorie – polymorfní průchod:
   * každý objekt spustí svůj vlastní calculateCalories() vzorec
   */
  getTotalCalories() {
    return this.#items.reduce((sum, item) => sum + item.calculateCalories(), 0);
  }

  getStats() {
    const total = this.#items.length;
    return {
      totalWorkouts:       total,
      totalCalories:       this.getTotalCalories(),
      avgDurationMinutes:  total > 0
        ? Math.round(this.#items.reduce((s, i) => s + i.getDurationMinutes(), 0) / total)
        : 0,
      cardioCount:         this.#items.filter(i => i instanceof CardioWorkout).length,
      strengthCount:       this.#items.filter(i => i instanceof StrengthWorkout).length,
    };
  }

  getSummary() {
    const s = this.getStats();
    return [
      `${'='.repeat(55)}`,
      `  Tréninkový plán: ${this.#name}`,
      `${'='.repeat(55)}`,
      `  Celkem tréninků:   ${s.totalWorkouts}  (Kardio: ${s.cardioCount}, Silový: ${s.strengthCount})`,
      `  Celkové kalorie:   ${s.totalCalories} kcal`,
      `  Průměrná délka:    ${s.avgDurationMinutes} min`,
      `${'='.repeat(55)}`,
    ].join('\n');
  }

  getItems() { return [...this.#items]; }
  getName()  { return this.#name; }
}

// ═══════════════════════════════════════════════════════
// DATA – číselník (odpovídá src/data.ts)
// ═══════════════════════════════════════════════════════

/** Surová data kardio tréninků – z těchto objektů se vytvoří instance CardioWorkout */
const rawCardioWorkouts = [
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

/** Surová data silových tréninků – z těchto objektů se vytvoří instance StrengthWorkout */
const rawStrengthWorkouts = [
  {
    name: 'Trénink horní části těla',
    durationMinutes: 60,
    date: new Date('2025-05-02'),
    difficulty: Difficulty.MEDIUM,
    restBetweenSets: 90,
    exercises: [
      { exerciseName: 'Bench press',       sets: 4, reps: 8,  weightKg: 80 },
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
      { exerciseName: 'Dřep',               sets: 5, reps: 5,  weightKg: 100 },
      { exerciseName: 'Rumunský mrtvý tah', sets: 4, reps: 8,  weightKg: 90  },
      { exerciseName: 'Leg press',          sets: 3, reps: 12, weightKg: 140 },
      { exerciseName: 'Výpady s činkami',   sets: 3, reps: 10, weightKg: 20  },
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
      { exerciseName: 'Kliky',                sets: 3, reps: 15, weightKg: 0 },
      { exerciseName: 'Dřep s vlastní váhou', sets: 3, reps: 20, weightKg: 0 },
      { exerciseName: 'Plank (1 série = 60s)',sets: 3, reps: 1,  weightKg: 0 },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// MAIN – oživení dat a polymorfní výpis do konzole
// ═══════════════════════════════════════════════════════

// 1. Oživení kardio tréninků ze surových dat (číselník → instance tříd)
const cardioWorkouts = rawCardioWorkouts.map(d =>
  new CardioWorkout(d.name, d.durationMinutes, d.date, d.distanceKm,
    d.avgHeartRate, d.cardioType, d.userWeightKg, d.notes ?? '')
);

// 2. Oživení silových tréninků ze surových dat (číselník → instance tříd)
const strengthWorkouts = rawStrengthWorkouts.map(d => {
  const w = new StrengthWorkout(d.name, d.durationMinutes, d.date,
    d.difficulty, d.restBetweenSets, d.notes ?? '');
  d.exercises.forEach(ex =>
    w.addExercise(new Exercise(ex.exerciseName, ex.sets, ex.reps, ex.weightKg))
  );
  return w;
});

// 3. Sestavení tréninkového plánu – seřazeno chronologicky
const plan = new WorkoutPlan('Týdenní plán – květen 2025');
[...cardioWorkouts, ...strengthWorkouts]
  .sort((a, b) => a.getDate() - b.getDate())
  .forEach(w => plan.addItem(w));

// 4. Polymorfní výpis – getSummary() a calculateCalories() se volají na WorkoutItem[],
//    ale za běhu se spustí správná implementace dle konkrétního podtypu (polymorfismus)
const allWorkouts = plan.getItems();

console.log('\n' + '='.repeat(55));
console.log('        FitTracker Pro – přehled tréninků');
console.log('='.repeat(55));

allWorkouts.forEach((workout, i) => {
  console.log(`\n── Trénink ${i + 1} / ${allWorkouts.length} ──`);
  console.log(workout.getSummary());        // polymorfní volání
  console.log('  Kalorie celkem: ' + workout.calculateCalories() + ' kcal');
});

// 5. Souhrnné statistiky plánu
console.log('\n' + plan.getSummary());

// 6. Specifické metody CardioWorkout (getPace, getCardioZone)
console.log('\n▸ Specifické metody CardioWorkout');
console.log('-'.repeat(55));
cardioWorkouts.forEach(cw => {
  const pace = cw.getPace();
  const min  = Math.floor(pace);
  const sec  = Math.round((pace - min) * 60).toString().padStart(2, '0');
  console.log(`${cw.getName().padEnd(28)} | tempo: ${min}:${sec} min/km | ${cw.getCardioZone()}`);
});

// 7. Specifické metody StrengthWorkout (getTotalVolume, getOneRepMax)
console.log('\n▸ Specifické metody StrengthWorkout');
console.log('-'.repeat(55));
strengthWorkouts.forEach(sw => {
  console.log(`${sw.getName()} | celkový objem: ${sw.getTotalVolume()} kg`);
  sw.getExercises().forEach(ex => {
    const oneRM  = sw.getOneRepMax(ex.getExerciseName());
    const rmInfo = oneRM > 0 ? ` | odh. 1RM: ${oneRM} kg` : '';
    console.log(`  ${ex.toString()}${rmInfo}`);
  });
});

console.log('\n' + '='.repeat(55));
console.log('  FitTracker Pro – výpis dokončen ✓');
console.log('='.repeat(55) + '\n');

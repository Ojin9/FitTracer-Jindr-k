/**
 * FitTracker Pro – hlavní vstupní bod aplikace.
 *
 * Tento soubor:
 *  1. Načte surová data z číselníku (data.ts)
 *  2. Oživí je do instancí tříd CardioWorkout / StrengthWorkout / Exercise
 *  3. Sestaví tréninkový plán WorkoutPlan
 *  4. Polymorfně projde plán a vypíše výsledky do konzole
 */

import { CardioWorkout }   from './CardioWorkout';
import { StrengthWorkout } from './StrengthWorkout';
import { Exercise }        from './Exercise';
import { WorkoutPlan }     from './WorkoutPlan';
import { WorkoutItem }     from './WorkoutItem';
import { rawCardioWorkouts, rawStrengthWorkouts } from './data';

// ── 1. Oživení kardio tréninků ze surových dat ──────────────────────────────
const cardioWorkouts: CardioWorkout[] = rawCardioWorkouts.map(d =>
  new CardioWorkout(
    d.name,
    d.durationMinutes,
    d.date,
    d.distanceKm,
    d.avgHeartRate,
    d.cardioType,
    d.userWeightKg,
    d.notes ?? '',
  ),
);

// ── 2. Oživení silových tréninků ze surových dat ────────────────────────────
const strengthWorkouts: StrengthWorkout[] = rawStrengthWorkouts.map(d => {
  const workout = new StrengthWorkout(
    d.name,
    d.durationMinutes,
    d.date,
    d.difficulty,
    d.restBetweenSets,
    d.notes ?? '',
  );
  // Přidání jednotlivých cviků do tréninku
  d.exercises.forEach(ex =>
    workout.addExercise(new Exercise(ex.exerciseName, ex.sets, ex.reps, ex.weightKg)),
  );
  return workout;
});

// ── 3. Sestavení tréninkového plánu ─────────────────────────────────────────
const plan = new WorkoutPlan('Týdenní plán – květen 2025');

// Seřadíme tréninky chronologicky a přidáme do plánu
[...cardioWorkouts, ...strengthWorkouts]
  .sort((a, b) => a.getDate().getTime() - b.getDate().getTime())
  .forEach(w => plan.addItem(w));

// ── 4. Polymorfní výpis do konzole ──────────────────────────────────────────
const allWorkouts: WorkoutItem[] = plan.getItems();

console.log('\n' + '='.repeat(55));
console.log('         FitTracker Pro – přehled tréninků');
console.log('='.repeat(55));

// Polymorfní průchod: getSummary() a calculateCalories() se volají na WorkoutItem[],
// ale za běhu se spustí správná implementace dle konkrétního podtypu.
allWorkouts.forEach((workout, i) => {
  console.log(`\n── Trénink ${i + 1} / ${allWorkouts.length} ──`);
  console.log(workout.getSummary());       // polymorfní volání
});

// ── 5. Souhrnné statistiky celého plánu ─────────────────────────────────────
console.log('\n' + plan.getSummary());

// ── 6. Ukázka specifických metod CardioWorkout ──────────────────────────────
console.log('\n▸ Specifické metody CardioWorkout');
console.log('-'.repeat(55));
cardioWorkouts.forEach(cw => {
  const pace = cw.getPace();
  const min  = Math.floor(pace);
  const sec  = Math.round((pace - min) * 60).toString().padStart(2, '0');
  console.log(
    `${cw.getName().padEnd(28)} | tempo: ${min}:${sec} min/km | ${cw.getCardioZone()}`,
  );
});

// ── 7. Ukázka specifických metod StrengthWorkout ────────────────────────────
console.log('\n▸ Specifické metody StrengthWorkout');
console.log('-'.repeat(55));
strengthWorkouts.forEach(sw => {
  console.log(`${sw.getName()} | objem: ${sw.getTotalVolume()} kg`);
  sw.getExercises().forEach(ex => {
    const oneRM = sw.getOneRepMax(ex.getExerciseName());
    const rmInfo = oneRM > 0 ? ` | odh. 1RM: ${oneRM} kg` : '';
    console.log(`  ${ex.toString()}${rmInfo}`);
  });
});

console.log('\n' + '='.repeat(55));
console.log('  FitTracker Pro – výpis dokončen');
console.log('='.repeat(55) + '\n');

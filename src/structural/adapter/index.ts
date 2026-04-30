/**
 * ADAPTER — Структурний патерн
 *
 * Проблема: Два компоненти з несумісними інтерфейсами не можуть
 *           працювати разом без зміни вихідного коду.
 *
 * Рішення: Клас-адаптер «перекладає» виклики з одного інтерфейсу
 *          на інший, не змінюючи ні клієнта, ні адаптований клас.
 *
 * Антиприклад:
 *   // Скрізь у коді вручну конвертуємо celsius → fahrenheit
 *   const f = celsius * 9/5 + 32;  // дублювання, важко змінити
 */

// --- Існуюча система (Adaptee) — температура у Fahrenheit ---
class FahrenheitSensor {
  private tempF: number;

  constructor(initialF: number) {
    this.tempF = initialF;
  }

  getTemperatureF(): number {
    return this.tempF;
  }

  setTemperatureF(f: number): void {
    this.tempF = f;
  }
}

// --- Цільовий інтерфейс, якого очікує наш застосунок ---
interface CelsiusSensor {
  getTemperatureC(): number;
  setTemperatureC(c: number): void;
  getStatus(): string;
}

// --- Адаптер: робить FahrenheitSensor сумісним з CelsiusSensor ---
class FahrenheitToCelsiusAdapter implements CelsiusSensor {
  constructor(private sensor: FahrenheitSensor) {}

  getTemperatureC(): number {
    return parseFloat(((this.sensor.getTemperatureF() - 32) * (5 / 9)).toFixed(2));
  }

  setTemperatureC(c: number): void {
    this.sensor.setTemperatureF(c * (9 / 5) + 32);
  }

  getStatus(): string {
    const c = this.getTemperatureC();
    if (c < 0) return '🧊 Freezing';
    if (c < 20) return '🌡️ Cold';
    if (c < 30) return '☀️  Comfortable';
    return '🔥 Hot';
  }
}

// --- Клієнт: працює виключно через CelsiusSensor ---
function displayTemperature(sensor: CelsiusSensor): void {
  console.log(`  Temperature : ${sensor.getTemperatureC()}°C`);
  console.log(`  Status      : ${sensor.getStatus()}`);
}

// --- Демонстрація ---
export function runAdapter(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   ADAPTER (Structural)               ║');
  console.log('╚══════════════════════════════════════╝');

  const legacySensor = new FahrenheitSensor(98.6); // body temperature
  const adapter = new FahrenheitToCelsiusAdapter(legacySensor);

  console.log('\n  Raw Fahrenheit sensor value:', legacySensor.getTemperatureF(), '°F');
  console.log('  Via Adapter (°C):');
  displayTemperature(adapter);

  console.log('\n  Setting 0°C via adapter...');
  adapter.setTemperatureC(0);
  console.log(`  Sensor now reads: ${legacySensor.getTemperatureF()}°F`);
  displayTemperature(adapter);

  console.log('\n  Setting 35°C via adapter...');
  adapter.setTemperatureC(35);
  displayTemperature(adapter);

  console.log('\n  ✔ Legacy Fahrenheit sensor used seamlessly with Celsius interface.');
}

runAdapter();

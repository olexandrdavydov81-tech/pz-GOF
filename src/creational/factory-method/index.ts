/**
 * FACTORY METHOD — Породжувальний патерн
 *
 * Проблема: Код залежить від конкретних класів об'єктів,
 *           які потрібно створювати. При додаванні нового типу
 *           доводиться змінювати весь клієнтський код.
 *
 * Рішення: Визначити інтерфейс для створення об'єктів,
 *          але дозволити підкласам вирішувати, який клас інстанціювати.
 *
 * Антиприклад:
 *   function createTransport(type: string) {
 *     if (type === 'truck') return new Truck();
 *     if (type === 'ship') return new Ship();
 *     // ← при кожному новому типі — модифікація функції!
 *   }
 */

// --- Продукт ---
interface Transport {
  deliver(): string;
  getFuelCost(): number;
}

// --- Конкретні продукти ---
class Truck implements Transport {
  deliver(): string {
    return '🚛 Delivering cargo by road in a box truck.';
  }
  getFuelCost(): number {
    return 150;
  }
}

class Ship implements Transport {
  deliver(): string {
    return '🚢 Delivering cargo by sea in a container ship.';
  }
  getFuelCost(): number {
    return 900;
  }
}

class Airplane implements Transport {
  deliver(): string {
    return '✈️  Delivering cargo by air express.';
  }
  getFuelCost(): number {
    return 3000;
  }
}

// --- Творець (Creator) ---
abstract class Logistics {
  // Factory Method — підкласи перевизначають цей метод
  abstract createTransport(): Transport;

  planDelivery(): void {
    const transport = this.createTransport();
    console.log(`  ${transport.deliver()}`);
    console.log(`  Fuel cost: $${transport.getFuelCost()}`);
  }
}

// --- Конкретні творці ---
class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}

class AirLogistics extends Logistics {
  createTransport(): Transport {
    return new Airplane();
  }
}

// --- Демонстрація ---
export function runFactoryMethod(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   FACTORY METHOD (Creational)        ║');
  console.log('╚══════════════════════════════════════╝');

  const logistics: Logistics[] = [
    new RoadLogistics(),
    new SeaLogistics(),
    new AirLogistics(),
  ];

  logistics.forEach((l, i) => {
    console.log(`\n  [Route ${i + 1}]`);
    l.planDelivery();
  });

  console.log('\n  ✔ New transport types added WITHOUT touching existing code.');
}

runFactoryMethod();

/**
 * OBSERVER — Поведінковий патерн
 *
 * Проблема: Об'єкти мають реагувати на зміни стану іншого об'єкта,
 *           але жорстка прив'язка породжує сильне зчеплення.
 *           Суб'єкт "знає" про всіх споживачів → важко масштабувати.
 *
 * Рішення: Суб'єкт зберігає список спостерігачів і сповіщає їх
 *          автоматично. Спостерігачі самі реєструються/відписуються.
 *
 * Антиприклад:
 *   class StockMarket {
 *     update() {
 *       emailService.notify();   // жорстка залежність!
 *       dashboard.refresh();     // жорстка залежність!
 *       mobileApp.push();        // жорстка залежність!
 *     }
 *   }
 */

// --- Інтерфейси ---
interface Observer<T> {
  update(event: string, data: T): void;
}

interface Subject<T> {
  subscribe(event: string, observer: Observer<T>): void;
  unsubscribe(event: string, observer: Observer<T>): void;
  notify(event: string, data: T): void;
}

// --- Базовий суб'єкт ---
abstract class EventEmitter<T> implements Subject<T> {
  private listeners: Map<string, Set<Observer<T>>> = new Map();

  subscribe(event: string, observer: Observer<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(observer);
  }

  unsubscribe(event: string, observer: Observer<T>): void {
    this.listeners.get(event)?.delete(observer);
  }

  notify(event: string, data: T): void {
    this.listeners.get(event)?.forEach((obs) => obs.update(event, data));
  }
}

// --- Конкретний суб'єкт ---
interface StockData {
  symbol: string;
  price: number;
  change: number;
}

class StockMarket extends EventEmitter<StockData> {
  private prices: Map<string, number> = new Map();

  setPrice(symbol: string, price: number): void {
    const prev = this.prices.get(symbol) ?? price;
    const change = parseFloat((price - prev).toFixed(2));
    this.prices.set(symbol, price);

    const data: StockData = { symbol, price, change };
    this.notify('price:change', data);

    if (Math.abs(change) > 5) {
      this.notify('price:alert', data);
    }
  }
}

// --- Конкретні спостерігачі ---
class TradingDashboard implements Observer<StockData> {
  update(event: string, data: StockData): void {
    const arrow = data.change >= 0 ? '▲' : '▼';
    console.log(
      `  [Dashboard] ${data.symbol}: $${data.price.toFixed(2)} ${arrow} ${Math.abs(data.change).toFixed(2)}`
    );
  }
}

class EmailAlertService implements Observer<StockData> {
  update(event: string, data: StockData): void {
    if (event === 'price:alert') {
      console.log(
        `  [Email] 🚨 ALERT: ${data.symbol} moved by $${Math.abs(data.change).toFixed(2)}!`
      );
    }
  }
}

class PortfolioTracker implements Observer<StockData> {
  private holdings: Map<string, number> = new Map([
    ['AAPL', 10],
    ['TSLA', 5],
  ]);

  update(event: string, data: StockData): void {
    const qty = this.holdings.get(data.symbol);
    if (qty) {
      const value = (qty * data.price).toFixed(2);
      console.log(`  [Portfolio] ${data.symbol} × ${qty} = $${value}`);
    }
  }
}

// --- Демонстрація ---
export function runObserver(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   OBSERVER (Behavioral)              ║');
  console.log('╚══════════════════════════════════════╝');

  const market = new StockMarket();
  const dashboard = new TradingDashboard();
  const email = new EmailAlertService();
  const portfolio = new PortfolioTracker();

  // Підписка
  market.subscribe('price:change', dashboard);
  market.subscribe('price:change', portfolio);
  market.subscribe('price:alert', email);
  market.subscribe('price:alert', dashboard);

  console.log('\n  ── AAPL: $150.00 ──');
  market.setPrice('AAPL', 150.00);

  console.log('\n  ── AAPL: $151.50 (+1.50) ──');
  market.setPrice('AAPL', 151.50);

  console.log('\n  ── TSLA: $200.00 ──');
  market.setPrice('TSLA', 200.00);

  console.log('\n  ── TSLA: $208.00 (+8.00 — triggers ALERT!) ──');
  market.setPrice('TSLA', 208.00);

  // Відписка портфоліо
  console.log('\n  ── Portfolio unsubscribed ──');
  market.unsubscribe('price:change', portfolio);

  console.log('\n  ── AAPL: $152.00 ──');
  market.setPrice('AAPL', 152.00);

  console.log('\n  ✔ Observers react independently — StockMarket knows nothing about them.');
}

runObserver();

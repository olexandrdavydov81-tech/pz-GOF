/**
 * STRATEGY — Поведінковий патерн
 *
 * Проблема: Алгоритм вибирається через великий if/switch і захаращує
 *           клас. Додавання нового варіанту вимагає зміни вихідного
 *           коду та порушує Open/Closed Principle.
 *
 * Рішення: Інкапсулювати кожен алгоритм у окремий клас-стратегію
 *          та зробити їх взаємозамінними.
 *
 * Антиприклад:
 *   function sort(data, type) {
 *     if (type === 'bubble') { ... }
 *     else if (type === 'quick') { ... }
 *     else if (type === 'merge') { ... }
 *     // нескінченно зростаючий if-else
 *   }
 */

// --- Інтерфейс стратегії ---
interface SortStrategy {
  name: string;
  sort(data: number[]): number[];
}

// --- Конкретні стратегії ---
class BubbleSortStrategy implements SortStrategy {
  name = 'Bubble Sort';

  sort(data: number[]): number[] {
    const arr = [...data];
    let swaps = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swaps++;
        }
      }
    }
    console.log(`    [${this.name}] ${swaps} swaps performed`);
    return arr;
  }
}

class QuickSortStrategy implements SortStrategy {
  name = 'Quick Sort';

  sort(data: number[]): number[] {
    const arr = [...data];
    const calls = { count: 0 };
    const result = this.quickSort(arr, 0, arr.length - 1, calls);
    console.log(`    [${this.name}] ${calls.count} recursive calls`);
    return result;
  }

  private quickSort(arr: number[], low: number, high: number, calls: { count: number }): number[] {
    calls.count++;
    if (low < high) {
      const pivot = this.partition(arr, low, high);
      this.quickSort(arr, low, pivot - 1, calls);
      this.quickSort(arr, pivot + 1, high, calls);
    }
    return arr;
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
}

class NativeSortStrategy implements SortStrategy {
  name = 'Native (JS .sort)';

  sort(data: number[]): number[] {
    console.log(`    [${this.name}] Using built-in engine sort`);
    return [...data].sort((a, b) => a - b);
  }
}

// --- Контекст ---
class DataSorter {
  private strategy: SortStrategy;

  constructor(strategy: SortStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
    console.log(`  Strategy switched → ${strategy.name}`);
  }

  sort(data: number[]): number[] {
    console.log(`  Using: ${this.strategy.name}`);
    return this.strategy.sort(data);
  }
}

// --- Демонстрація ---
export function runStrategy(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   STRATEGY (Behavioral)              ║');
  console.log('╚══════════════════════════════════════╝');

  const data = [64, 34, 25, 12, 22, 11, 90, 3, 47];
  console.log('\n  Input:', data);

  const sorter = new DataSorter(new BubbleSortStrategy());

  console.log('\n  ─── Bubble Sort ───');
  console.log('  Result:', sorter.sort(data));

  console.log('\n  ─── Switching to Quick Sort ───');
  sorter.setStrategy(new QuickSortStrategy());
  console.log('  Result:', sorter.sort(data));

  console.log('\n  ─── Switching to Native Sort ───');
  sorter.setStrategy(new NativeSortStrategy());
  console.log('  Result:', sorter.sort(data));

  console.log('\n  ✔ Algorithms swapped at runtime — DataSorter code unchanged.');
}

runStrategy();

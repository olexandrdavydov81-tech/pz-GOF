/**
 * DECORATOR — Структурний патерн
 *
 * Проблема: Потрібно додати нову поведінку до об'єкта, але:
 *           - спадкування призводить до вибуху класів
 *           - модифікувати базовий клас неможливо або небажано
 *
 * Рішення: Обгорнути об'єкт у декоратор, що реалізує той самий
 *          інтерфейс і додає нову поведінку до/після делегування.
 *
 * Антиприклад:
 *   class LoggingCachingRetryingHttpClient extends HttpClient { }
 *   class LoggingCachingHttpClient extends HttpClient { }
 *   class RetryingHttpClient extends HttpClient { }
 *   // ← комбінаторний вибух підкласів!
 */

// --- Компонент ---
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

// --- Конкретний компонент ---
class FileDataSource implements DataSource {
  private storage: string = '';
  constructor(private filename: string) {}

  writeData(data: string): void {
    this.storage = data;
    console.log(`  [File:${this.filename}] Written ${data.length} bytes.`);
  }

  readData(): string {
    console.log(`  [File:${this.filename}] Read ${this.storage.length} bytes.`);
    return this.storage;
  }
}

// --- Базовий декоратор ---
abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}

  writeData(data: string): void {
    this.wrappee.writeData(data);
  }

  readData(): string {
    return this.wrappee.readData();
  }
}

// --- Конкретний декоратор: шифрування ---
class EncryptionDecorator extends DataSourceDecorator {
  private encrypt(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  private decrypt(data: string): string {
    return Buffer.from(data, 'base64').toString('utf-8');
  }

  writeData(data: string): void {
    const encrypted = this.encrypt(data);
    console.log(`  [Encrypt] ${data.length}B → ${encrypted.length}B (base64)`);
    super.writeData(encrypted);
  }

  readData(): string {
    const data = super.readData();
    const decrypted = this.decrypt(data);
    console.log(`  [Decrypt] ${data.length}B → ${decrypted.length}B`);
    return decrypted;
  }
}

// --- Конкретний декоратор: стиснення (симуляція) ---
class CompressionDecorator extends DataSourceDecorator {
  private compress(data: string): string {
    // Симуляція: додаємо префікс GZIP:
    return `GZIP[${data}]`;
  }

  private decompress(data: string): string {
    return data.replace(/^GZIP\[/, '').replace(/\]$/, '');
  }

  writeData(data: string): void {
    const compressed = this.compress(data);
    console.log(`  [Compress] "${data.substring(0, 20)}..." → compressed`);
    super.writeData(compressed);
  }

  readData(): string {
    const data = super.readData();
    const decompressed = this.decompress(data);
    console.log(`  [Decompress] restored original`);
    return decompressed;
  }
}

// --- Конкретний декоратор: логування ---
class LoggingDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    console.log(`  [Log] writeData called at ${new Date().toISOString()}`);
    super.writeData(data);
  }

  readData(): string {
    console.log(`  [Log] readData called at ${new Date().toISOString()}`);
    return super.readData();
  }
}

// --- Демонстрація ---
export function runDecorator(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   DECORATOR (Structural)             ║');
  console.log('╚══════════════════════════════════════╝');

  const payload = 'Hello, World! This is secret data.';

  // Простий файл — без декораторів
  console.log('\n  ── Plain FileDataSource ──');
  const plain = new FileDataSource('plain.txt');
  plain.writeData(payload);
  console.log('  Read back:', plain.readData());

  // Файл з шифруванням + стисненням + логуванням (порядок важливий!)
  console.log('\n  ── Logging + Encrypted + Compressed FileDataSource ──');
  const fancy = new LoggingDecorator(
    new EncryptionDecorator(
      new CompressionDecorator(
        new FileDataSource('secret.txt')
      )
    )
  );
  fancy.writeData(payload);
  console.log('\n  Reading back through decorators:');
  const result = fancy.readData();
  console.log('  Final value:', result);

  console.log('\n  ✔ Decorators composed freely — no subclass explosion.');
}

runDecorator();

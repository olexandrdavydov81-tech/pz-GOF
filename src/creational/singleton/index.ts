/**
 * SINGLETON — Породжувальний патерн (бонусний)
 *
 * Проблема: Деякі ресурси (конфіг, логер, пул з'єднань) повинні
 *           існувати в єдиному екземплярі. Без контролю — безліч
 *           несинхронізованих копій.
 *
 * Рішення: Клас сам контролює своє єдине створення та надає
 *          глобальну точку доступу до нього.
 */

class AppConfig {
  private static instance: AppConfig | null = null;
  private settings: Map<string, string> = new Map();
  private readonly createdAt: Date;

  private constructor() {
    // Ініціалізація лише ОДИН раз
    this.createdAt = new Date();
    this.settings.set('env', 'production');
    this.settings.set('apiUrl', 'https://api.example.com');
    this.settings.set('timeout', '5000');
    console.log(`  [AppConfig] Instance created at ${this.createdAt.toISOString()}`);
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  get(key: string): string | undefined {
    return this.settings.get(key);
  }

  set(key: string, value: string): void {
    this.settings.set(key, value);
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}

export function runSingleton(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   SINGLETON (Creational — bonus)     ║');
  console.log('╚══════════════════════════════════════╝\n');

  const config1 = AppConfig.getInstance();
  const config2 = AppConfig.getInstance();
  const config3 = AppConfig.getInstance();

  console.log(`  config1 === config2 : ${config1 === config2}`); // true
  console.log(`  config2 === config3 : ${config2 === config3}`); // true

  config1.set('theme', 'dark');
  console.log(`\n  config2.get('theme') = "${config2.get('theme')}"`); // dark — same instance!
  console.log(`  env    = ${config3.get('env')}`);
  console.log(`  apiUrl = ${config3.get('apiUrl')}`);

  console.log('\n  ✔ Exactly one instance shared across the entire application.');
}

runSingleton();

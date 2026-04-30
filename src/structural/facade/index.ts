/**
 * FACADE — Структурний патерн
 *
 * Проблема: Клієнт мусить взаємодіяти з безліччю складних
 *           підсистем, знати правильний порядок їх виклику,
 *           стежити за залежностями між ними.
 *
 * Рішення: Надати спрощений інтерфейс (фасад), який приховує
 *          складність підсистем за єдиним точкою входу.
 *
 * Антиприклад:
 *   // Клієнт сам управляє всіма підсистемами:
 *   auth.login(); db.connect(); cache.init(); logger.setup(); mailer.configure();
 *   // При зміні порядку — баги!
 */

// --- Складні підсистеми ---
class AuthService {
  login(user: string): string {
    return `[Auth] User "${user}" authenticated. Token issued.`;
  }
  logout(user: string): string {
    return `[Auth] User "${user}" logged out. Token revoked.`;
  }
}

class DatabaseService {
  connect(): string {
    return '[DB] Connection pool established (max: 10).';
  }
  disconnect(): string {
    return '[DB] All connections closed.';
  }
  query(sql: string): string {
    return `[DB] Executed: "${sql}" → 42 rows returned.`;
  }
}

class CacheService {
  initialize(): string {
    return '[Cache] Redis connected. TTL=3600s.';
  }
  flush(): string {
    return '[Cache] Cache cleared.';
  }
  get(key: string): string {
    return `[Cache] HIT for key "${key}".`;
  }
}

class EmailService {
  configure(): string {
    return '[Email] SMTP configured. TLS enabled.';
  }
  send(to: string, subject: string): string {
    return `[Email] Sent "${subject}" → ${to}.`;
  }
}

// --- ФАСАД: спрощує роботу з усіма підсистемами ---
class ApplicationFacade {
  private auth = new AuthService();
  private db = new DatabaseService();
  private cache = new CacheService();
  private email = new EmailService();

  startup(): void {
    console.log('  🚀 Starting application...');
    console.log(' ', this.db.connect());
    console.log(' ', this.cache.initialize());
    console.log(' ', this.email.configure());
    console.log('  ✅ Application ready.\n');
  }

  userLogin(username: string): void {
    console.log(`  🔐 Login flow for "${username}":`);
    console.log(' ', this.auth.login(username));
    console.log(' ', this.cache.get(`session:${username}`));
    console.log(' ', this.email.send(username + '@example.com', 'Login notification'));
  }

  fetchData(query: string): void {
    console.log('\n  📊 Data fetch:');
    console.log(' ', this.db.query(query));
  }

  shutdown(username: string): void {
    console.log('\n  🛑 Shutting down...');
    console.log(' ', this.auth.logout(username));
    console.log(' ', this.cache.flush());
    console.log(' ', this.db.disconnect());
    console.log('  ✅ Application stopped.');
  }
}

// --- Демонстрація ---
export function runFacade(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   FACADE (Structural)                ║');
  console.log('╚══════════════════════════════════════╝\n');

  const app = new ApplicationFacade();

  app.startup();
  app.userLogin('alice');
  app.fetchData('SELECT * FROM orders WHERE status = "pending"');
  app.shutdown('alice');

  console.log('\n  ✔ Client used one facade — zero knowledge of subsystem internals.');
}

runFacade();

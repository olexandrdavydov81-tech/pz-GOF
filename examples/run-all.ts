/**
 * run-all.ts — запускає демонстрацію всіх реалізованих GoF патернів
 */

import { runFactoryMethod } from '../src/creational/factory-method/index';
import { runBuilder }       from '../src/creational/builder/index';
import { runSingleton }     from '../src/creational/singleton/index';
import { runAdapter }       from '../src/structural/adapter/index';
import { runFacade }        from '../src/structural/facade/index';
import { runDecorator }     from '../src/structural/decorator/index';
import { runStrategy }      from '../src/behavioral/strategy/index';
import { runObserver }      from '../src/behavioral/observer/index';

console.log('');
console.log('╔════════════════════════════════════════════╗');
console.log('║   GoF Design Patterns — pz-GOF Demo        ║');
console.log('╠════════════════════════════════════════════╣');
console.log('║  Creational : Factory Method, Builder,     ║');
console.log('║               Singleton                    ║');
console.log('║  Structural : Adapter, Facade, Decorator   ║');
console.log('║  Behavioral : Strategy, Observer           ║');
console.log('╚════════════════════════════════════════════╝');

// ─── Creational ───────────────────────────────────────
runFactoryMethod();
runBuilder();
runSingleton();

// ─── Structural ───────────────────────────────────────
runAdapter();
runFacade();
runDecorator();

// ─── Behavioral ───────────────────────────────────────
runStrategy();
runObserver();

console.log('\n\n══════════════════════════════════════════════');
console.log('  All patterns executed successfully. ✔');
console.log('══════════════════════════════════════════════\n');

# pz-GOF — GoF Design Patterns in TypeScript

Практична реалізація класичних патернів проєктування «Gang of Four» мовою TypeScript.

---

## 📁 Структура проєкту

```
pz-GOF/
├── src/
│   ├── creational/
│   │   ├── factory-method/   # Factory Method
│   │   ├── builder/          # Builder
│   │   └── singleton/        # Singleton (бонус)
│   ├── structural/
│   │   ├── adapter/          # Adapter
│   │   ├── facade/           # Facade
│   │   └── decorator/        # Decorator
│   └── behavioral/
│       ├── strategy/         # Strategy
│       └── observer/         # Observer
├── examples/
│   └── run-all.ts            # Запуск усіх патернів
├── package.json
├── tsconfig.json
└── README.md
```

---

##  Запуск

```bash
# Встановити залежності
npm install

# Запустити всі патерни одночасно
npm start

# Запустити окремий патерн
npm run run:factory
npm run run:builder
npm run run:singleton
npm run run:adapter
npm run run:facade
npm run run:decorator
npm run run:strategy
npm run run:observer
```

---

##  Породжувальні патерни (Creational)

### 1. Factory Method

**Файл:** `src/creational/factory-method/index.ts`

**Проблема:** Код клієнта залежить від конкретних класів об'єктів. Щоб додати новий тип транспорту — треба модифікувати існуючий код.

**Рішення:** Підкласи (`RoadLogistics`, `SeaLogistics`, `AirLogistics`) самі вирішують, який об'єкт створювати. Клієнт працює з абстракцією `Transport`.

**Антиприклад:**
```typescript
//  Жорстка залежність від конкретних класів
function createTransport(type: string) {
  if (type === 'truck') return new Truck();
  if (type === 'ship') return new Ship();
  // При новому типі — зміна функції!
}
```

**З патерном:**
```typescript
//  Новий транспорт — новий підклас, існуючий код не змінюється
class AirLogistics extends Logistics {
  createTransport(): Transport { return new Airplane(); }
}
```

---

### 2. Builder

**Файл:** `src/creational/builder/index.ts`

**Проблема:** «Telescoping constructor» — конструктор з 8+ параметрами, де легко переплутати значення.

**Рішення:** Поетапне будування через fluent-інтерфейс. `PizzaDirector` інкапсулює готові рецепти.

**Антиприклад:**
```typescript
//  Що означає кожен boolean??
new Pizza('large', 'thin', true, false, true, false, 'tomato', ['cheese'])
```

**З патерном:**
```typescript
// Читабельно та гнучко
builder
  .setSize('large')
  .setCrust('stuffed')
  .setSauce('bbq')
  .addTopping('chicken')
  .withExtraCheese()
  .build()
```

---

### 3. Singleton *(бонус)*

**Файл:** `src/creational/singleton/index.ts`

**Проблема:** Конфігурація, логер або пул з'єднань повинні існувати в єдиному екземплярі.

**Рішення:** Клас контролює власне створення через `static instance` та приватний конструктор.

---

##  Структурні патерни (Structural)

### 4. Adapter

**Файл:** `src/structural/adapter/index.ts`

**Проблема:** Легаси-сенсор повертає дані у °F, а застосунок очікує °C.

**Рішення:** `FahrenheitToCelsiusAdapter` реалізує `CelsiusSensor` та делегує виклики до `FahrenheitSensor` з конвертацією.

**Антиприклад:**
```typescript
//  Ручна конвертація скрізь у коді — дублювання!
const celsius = (sensor.getTemperatureF() - 32) * 5/9;
```

**З патерном:**
```typescript
//  Клієнт не знає про внутрішній формат
displayTemperature(new FahrenheitToCelsiusAdapter(legacySensor));
```

---

### 5. Facade

**Файл:** `src/structural/facade/index.ts`

**Проблема:** Клієнт мусить знати правильний порядок ініціалізації БД, кешу, поштового сервісу та аутентифікації.

**Рішення:** `ApplicationFacade` надає методи `startup()`, `userLogin()`, `shutdown()` — клієнт нічого не знає про підсистеми.

**Антиприклад:**
```typescript
//  Клієнт управляє 4 підсистемами вручну
auth.login(); db.connect(); cache.init(); mailer.configure();
```

**З патерном:**
```typescript
//  Один об'єкт, три методи
const app = new ApplicationFacade();
app.startup();
app.userLogin('alice');
app.shutdown('alice');
```

---

### 6. Decorator

**Файл:** `src/structural/decorator/index.ts`

**Проблема:** Потрібні різні комбінації: шифрування + стиснення + логування. Спадкування дає вибух підкласів.

**Рішення:** Декоратори обгортають один одного та реалізують той самий інтерфейс `DataSource`.

**Антиприклад:**
```typescript
//  Комбінаторний вибух
class LoggingCachingEncryptedFileSource extends FileSource {}
class CachingEncryptedFileSource extends FileSource {}
// ...і ще десяток класів
```

**З патерном:**
```typescript
//  Вільна композиція декораторів
const source = new LoggingDecorator(
  new EncryptionDecorator(
    new CompressionDecorator(new FileDataSource('data.txt'))
  )
);
```

---

##  Поведінкові патерни (Behavioral)

### 7. Strategy

**Файл:** `src/behavioral/strategy/index.ts`

**Проблема:** Вибір алгоритму сортування через if/else захаращує клас і порушує OCP при додаванні нового варіанту.

**Рішення:** Кожен алгоритм — окремий клас `SortStrategy`. `DataSorter` отримує стратегію ззовні та може замінити її у рантаймі.

**Антиприклад:**
```typescript
//  Нескінченний if-else у клієнтському коді
function sort(data, type) {
  if (type === 'bubble') { /* 20 рядків */ }
  else if (type === 'quick') { /* 40 рядків */ }
}
```

**З патерном:**
```typescript
//  Замінюємо алгоритм без зміни DataSorter
sorter.setStrategy(new QuickSortStrategy());
sorter.sort(data);
```

---

### 8. Observer

**Файл:** `src/behavioral/observer/index.ts`

**Проблема:** `StockMarket` жорстко залежить від усіх споживачів (`Dashboard`, `Email`, `Portfolio`). Додавання нового — модифікація суб'єкта.

**Рішення:** Суб'єкт зберігає список спостерігачів і сповіщає їх через `notify()`. Спостерігачі самі підписуються та відписуються.

**Антиприклад:**
```typescript
//  StockMarket знає про всіх споживачів
class StockMarket {
  update(price) {
    dashboard.refresh();   // жорстка залежність
    emailService.alert();  // жорстка залежність
  }
}
```

**З патерном:**
```typescript
//  Суб'єкт нічого не знає про спостерігачів
market.subscribe('price:change', dashboard);
market.subscribe('price:alert', email);
market.setPrice('TSLA', 208); // автоматично сповіщає підписників
```

---

##  Порівняльна таблиця

| Патерн | Категорія | Проблема | Покращення |
|---|---|---|---|
| Factory Method | Creational | Залежність від конкретних класів | OCP: нові типи без зміни існуючого коду |
| Builder | Creational | Telescoping constructor | Читабельне поетапне будування |
| Singleton | Creational | Множинні екземпляри ресурсу | Гарантовано один екземпляр |
| Adapter | Structural | Несумісні інтерфейси | Інтеграція без зміни коду |
| Facade | Structural | Складні підсистеми | Простий єдиний інтерфейс |
| Decorator | Structural | Вибух підкласів | Гнучка композиція поведінки |
| Strategy | Behavioral | Великий if/else | Взаємозамінні алгоритми |
| Observer | Behavioral | Жорстке зчеплення | Слабка залежність, pub/sub |

---

##  Висновки

1. **Породжувальні патерни** зменшують залежність від конкретних класів і спрощують створення складних об'єктів.
2. **Структурні патерни** дозволяють комбінувати об'єкти без зміни їхнього коду та інтегрувати несумісні системи.
3. **Поведінкові патерни** знижують зчеплення між компонентами та роблять алгоритми/реакції замінними у рантаймі.
4. Усі патерни підтримують **Open/Closed Principle**: відкриті для розширення, закриті для модифікації.

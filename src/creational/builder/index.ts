/**
 * BUILDER — Породжувальний патерн
 *
 * Проблема: Конструктор об'єкта має занадто багато параметрів
 *           (telescoping constructor anti-pattern). Складно зрозуміти
 *           порядок аргументів, легко переплутати значення.
 *
 * Рішення: Поетапне будування об'єкта через ланцюжок методів.
 *          Відокремлює конструювання від представлення.
 *
 * Антиприклад:
 *   new Pizza('large', 'thin', true, false, true, false, 'tomato', ['cheese','ham'])
 *   // ← що означає кожен boolean? жахлива читабельність!
 */

// --- Продукт ---
interface Pizza {
  size: 'small' | 'medium' | 'large';
  crust: 'thin' | 'thick' | 'stuffed';
  sauce: string;
  toppings: string[];
  extraCheese: boolean;
  glutenFree: boolean;
}

// --- Builder інтерфейс ---
interface PizzaBuilder {
  setSize(size: Pizza['size']): this;
  setCrust(crust: Pizza['crust']): this;
  setSauce(sauce: string): this;
  addTopping(topping: string): this;
  withExtraCheese(): this;
  makeGlutenFree(): this;
  build(): Pizza;
}

// --- Конкретний Builder ---
class CustomPizzaBuilder implements PizzaBuilder {
  private pizza: Pizza = {
    size: 'medium',
    crust: 'thin',
    sauce: 'tomato',
    toppings: [],
    extraCheese: false,
    glutenFree: false,
  };

  setSize(size: Pizza['size']): this {
    this.pizza.size = size;
    return this;
  }

  setCrust(crust: Pizza['crust']): this {
    this.pizza.crust = crust;
    return this;
  }

  setSauce(sauce: string): this {
    this.pizza.sauce = sauce;
    return this;
  }

  addTopping(topping: string): this {
    this.pizza.toppings.push(topping);
    return this;
  }

  withExtraCheese(): this {
    this.pizza.extraCheese = true;
    return this;
  }

  makeGlutenFree(): this {
    this.pizza.glutenFree = true;
    return this;
  }

  build(): Pizza {
    const result = { ...this.pizza };
    // reset for reuse
    this.pizza = {
      size: 'medium',
      crust: 'thin',
      sauce: 'tomato',
      toppings: [],
      extraCheese: false,
      glutenFree: false,
    };
    return result;
  }
}

// --- Director: знає рецепти готових піц ---
class PizzaDirector {
  constructor(private builder: PizzaBuilder) {}

  makeMargherita(): Pizza {
    return this.builder
      .setSize('medium')
      .setCrust('thin')
      .setSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('basil')
      .build();
  }

  makeVeggie(): Pizza {
    return this.builder
      .setSize('large')
      .setCrust('thick')
      .setSauce('pesto')
      .addTopping('bell pepper')
      .addTopping('mushrooms')
      .addTopping('olives')
      .makeGlutenFree()
      .build();
  }
}

function describePizza(name: string, pizza: Pizza): void {
  console.log(`\n  🍕 ${name}`);
  console.log(`     Size   : ${pizza.size}`);
  console.log(`     Crust  : ${pizza.crust}`);
  console.log(`     Sauce  : ${pizza.sauce}`);
  console.log(`     Toppings: ${pizza.toppings.join(', ') || 'none'}`);
  console.log(`     Extras : cheese=${pizza.extraCheese}, gluten-free=${pizza.glutenFree}`);
}

// --- Демонстрація ---
export function runBuilder(): void {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   BUILDER (Creational)               ║');
  console.log('╚══════════════════════════════════════╝');

  const builder = new CustomPizzaBuilder();
  const director = new PizzaDirector(builder);

  // Via Director
  describePizza('Margherita (via Director)', director.makeMargherita());
  describePizza('Veggie (via Director)', director.makeVeggie());

  // Custom build without Director
  const customPizza = builder
    .setSize('large')
    .setCrust('stuffed')
    .setSauce('bbq')
    .addTopping('chicken')
    .addTopping('bacon')
    .withExtraCheese()
    .build();
  describePizza('Custom BBQ Chicken (manual build)', customPizza);

  console.log('\n  ✔ Each pizza built step-by-step — readable, flexible, no param confusion.');
}

runBuilder();

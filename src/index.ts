let express = require('express');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', 'secret', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false,

    timestamps: false,
});
const Author = sequelize.define('author', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        //unique: 'compositeIndex'
        get() {
            return `N:${this.getDataValue("firstName").toLowerCase()}`;
        },
    },
    lastName: {
        type: Sequelize.STRING,
        //unique: 'compositeIndex'
        set(val) {
            this.setDataValue('lastName', val.toUpperCase());
        }
    },
    birthday: {
        type: Sequelize.DATE
        //type: Sequelize.DATEONLY
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'active__'
    },
}, {
    //timestamps: true
});

const find_all = () => {
    Author.findAll().then(users => {
        console.log(users)
    });
};
const create_one = (firstName: string, lastName: string, birthday: Date, active: boolean) => {
    return Author.create({
        firstName,
        lastName,
        birthday,
        active
    });
};
const drop_table = () => {
    return Author.drop({});
};
const create_table = () => {
    return Author.sync({});
};
const create_table_force = () => {
    return Author.sync({force: true});
};
const db_flow = () => {
    drop_table()
        .then( () => {
            return create_table();
        }).then( () => {
        return create_one("Alex", "Petrov", new Date(Date.UTC(2001,2, 5, 3, 1, 4)), true);
    }).then( () => {
        return create_one("Dima", "Sergev", new Date(Date.UTC(2002,5, 9, 4, 2, 5)), false);
    }).then( () => {
        return create_one("Ivan", "Krotov", new Date('2003-12-31 07:15:31+02:00'), false);
    }).then(() => {
        return create_one("Lena", "Mihail", new Date(Date.now()), false);
    }).then(() => {
        return sequelize.query('SELECT * FROM "authors"', {model: Author});
        //return sequelize.query('SELECT * FROM "authors"'); // console.log(rows[0]);
    }).then(rows => {
        //console.log(rows[0]);
        // console.log("==");
        // console.log(rows);
        // console.log("==");
        for (let author of rows) {
            console.log("==>>");
            console.log(author.id);
            console.log(author.firstName);
            console.log("==<<");
        }
        console.log("==");
    }).then(() => {
        //return drop_table();
    }).catch((err) => {
        console.log(`ERROR: ${err}`)
    });
};
//db_flow();
const sampleSet = () => {
    let pets = new Set(["Cat", "Dog", "Hamster"]);
    pets["species"] = "mammals";

    for (let pet in pets) {
        console.log(pet); // "species"
    }

    for (let pet of pets) {
        console.log(pet); // "Cat", "Dog", "Hamster"
    }
};
//sampleSet();
const caseStatic = () => {
    class Greeter {
        greeting: string;
        constructor(message: string) {
            this.greeting = message;
        }
        greet() {
            return "Hello, " + this.greeting;
        }
        static build(message: string): Greeter {
            return new Greeter(message);
        }
    }

    const greetBuilder = (message: string) => {
        return new Greeter(message);
    };

    let greeter1 = new Greeter("Case 1");
    console.log(greeter1.greet());

    let greeter2 = greetBuilder("Case 2");
    console.log(greeter2.greet());

    let greeter3 = Greeter.build("Case 3");
    console.log(greeter3.greet());
};
//caseStatic(); // case
const caseClasVsFunction = () => {
    function Vehicle(make, model, color) {
        this.make = make;
        this.model = model;
        this.color = color;
    }

    function Vehicle2(make, model, color) {
        return { make, model, color };
    }

    let car1 = new Vehicle("Toyota", "Corolla", "Black"); // class instance
    console.log(car1);

    let car2 = Vehicle("Toyota", "Corolla", "White"); // function
    console.log(car2);

    let car3 = Vehicle2("Toyota", "Corolla", "White"); // object
    console.log(car3);
};
//caseClasVsFunction();
const caseInheritance = () => {
    class Level1 {
        name(): string {
            return "Level1"
        }
    }

    class Level2 extends Level1 {
        name(): string {
            return "SUPER:" + super.name();
            //return "Level2"
        }
    }

    let p1 = new Level1();
    console.log(p1.name());
    let p2 = new Level2();
    console.log(p2.name());
};
//caseInheritance();
interface Doable {
    do(): void;
}
const caseInterface = () => {
    class Do1 implements Doable {
        do(): void {
            console.log("DO 1");
        }
    }
    class Do2 implements Doable {
        do(): void {
            console.log("DO 2");
        }
    }
    let d1 = new Do1();
    let d2 = new Do2();
    d1.do();
    d2.do();
    const caseInterfaceAsParam = (instance: Doable) => {
        instance.do();
    };
    caseInterfaceAsParam(new Do1);
    caseInterfaceAsParam(new Do2);
};
//caseInterface();
const caseSeveralConstructors1 = () => {
    class SeveralConstructors1 {
        private readonly value: string;

        constructor()
        constructor(digit: number)
        constructor(str: string)
        constructor(numberOrString?: number | string) {
            if (typeof numberOrString === 'undefined' || typeof numberOrString === null) {
                this.value = 'NO PARAMS';
            } else if (typeof numberOrString === 'number') {
                this.value = 'WITH NUMBER';
            } else if (typeof numberOrString === 'string') {
                this.value = 'WITH STRING';
            }

        }
        val(): string {
            return this.value;
        }
    }
    let s1 = new SeveralConstructors1();
    let s2 = new SeveralConstructors1(6);
    let s3 = new SeveralConstructors1("HI");
    console.log(s1.val());
    console.log(s2.val());
    console.log(s3.val());
};
//caseSeveralConstructors1();
interface Arguments {
    num?: number,
    str?: string
}
const caseSeveralConstructors2 = () => {
    class SeveralConstructors2 {
        private readonly value: string;

        constructor(args: Arguments) {
            if (args.num) {
                this.value = 'WITH NUMBER';
            } else if (args.str) {
                this.value = 'WITH STRING';
            } else {
                this.value = 'NO PARAMS';
            }
        }
        val(): string {
            return this.value;
        }
    }
    let s1 = new SeveralConstructors2({});
    let s2 = new SeveralConstructors2({num: 3});
    let s3 = new SeveralConstructors2({str: "Dim"});

    console.log(s1.val());
    console.log(s2.val());
    console.log(s3.val());
};
//caseSeveralConstructors2();
interface Valuable {
    val(): string;
}
const caseSeveralConstructors3 = () => {
    class S0 {
        protected readonly value: string;
        constructor(val: string) {
            this.value = val;
        }
        val(): string {
            return this.value;
        }
    }
    class S1 extends S0 {
        constructor() {
            super("WITHOUT")
        }
    }
    class S2 extends S0 {
        constructor(num: number) {
            super("WITH NUMBER")
        }
    }
    class S3 extends S0 {
        constructor(str: string) {
            super("WITH STRING")
        }
    }
    let s1 = new S1();
    let s2 = new S2(7);
    let s3 = new S3("Lena");
    console.log(s1.val());
    console.log(s2.val());
    console.log(s3.val());
};
//caseSeveralConstructors3();
const caseSeveralConstructors4 = () => {
    class Several implements Valuable {
        protected readonly value: string;
        constructor(str: string) {
            this.value = str;
        }
        static fromEmpty() {
            return new Several("EMPTY");
        }
        static fromNumber(num: number) {
            return new Several("NUMBER");
        }
        static fromString(str: string) {
            return new Several("STRING");
        }
        val(): string {
            return this.value;
        }
    }
    let s1 = Several.fromEmpty();
    let s2 = Several.fromString("ABC");
    let s3 = Several.fromNumber(5);
    console.log(s1.val());
    console.log(s2.val());
    console.log(s3.val());
};
//caseSeveralConstructors4();
interface Point {
    coordinates(): Iterable<number>;
}
const caseSeveralConstructors5 = () => {
    class NDPoint implements Point {
        private values: Iterable<number>;

        constructor(coordinates: Iterable<number>) {
            this.values = coordinates;
        }
        coordinates(): Iterable<number> {
            return this.values;
        }
    }
    class EmptyPoint implements Point {
        coordinates(): Iterable<number> {
            return [];
        }
    }
    class IterableOf<T> implements Iterable<T> {
        private items: T[];

        constructor(...items: T[]) {
            this.items = items;
        }
        [Symbol.iterator](): Iterator<T> {
            return this.items.values();
        }
    }
    new EmptyPoint();
    new NDPoint(new NDPoint([10, 10]).coordinates());
    new NDPoint(new IterableOf(10));
    new NDPoint(new IterableOf(10, 10));
    new NDPoint(new IterableOf(10, 10, 10));
    new NDPoint(new IterableOf(10, 10, 10, 10));
    new NDPoint([10, 10, 10]);
};
//caseSeveralConstructors5();
const gettersAndSetters = () => {
    class Employee {
        private _name: string;
        constructor(name: string) {
            this._name = name;
        }
        get name(): string {
            return this._name.toLowerCase();
        }
        set name(s: string) {
            this._name = s.toUpperCase();
        }
        name_actual(): string {
            return this._name;
        }
    }
    let e1 = new Employee("Alex");
    console.log(e1.name); // in lowercase because of getter
    console.log(e1.name_actual()); // as is
    e1.name = 'AleX'; // will be in uppercase because of setter
    console.log(e1.name); // in lowercase because of getter
    console.log(e1.name_actual()); // as is, but in uppercase because of setter
};
//gettersAndSetters();
const caseStaticMembers = () => {
    class Grid {
        static origin: number = 1;
        constructor (public scale: number) { }
        increment(): void {
            Grid.origin++;
        }
        get(): number {
            return Grid.origin;
        }
    }
    let g1 = new Grid(5);
    let g2 = new Grid(6);
    console.log("Scale:", g1.scale);
    console.log("Scale:", g2.scale);
    g1.scale++;
    console.log("Scale:", g1.scale);
    console.log("Scale:", g2.scale);
    g2.scale++;
    console.log("Scale:", g1.scale);
    console.log("Scale:", g2.scale);
    console.log("=====");
    console.log("origin:", g1.get());
    console.log("origin:", g2.get());
    g1.increment();
    console.log("origin:", g1.get());
    console.log("origin:", g2.get());
    g2.increment();
    console.log("origin:", g1.get());
    console.log("origin:", g2.get());
    console.log("=====");

};
//caseStaticMembers();
const caseAbstract = () => {
    abstract class Animal {
        abstract sound(): void;
    }
    class Dog extends Animal {
        sound(): void {
            console.log("Bark!");
        }
    }
    class Cat extends Animal {
        sound(): void {
            console.log("Moew!");
        }
    }
    let a1 = new Dog();
    let a2 = new Cat();
    a1.sound();
    a2.sound();
    console.log("T(Dog) is object:", a1 instanceof Object);
    console.log("T(Dog) is Dog   :", a1 instanceof Dog);
    console.log("T(Dog) is Cat   :", a1 instanceof Cat);
    console.log("T(Dog) is Animal:", a1 instanceof Animal);
};
//caseAbstract();
const caseAdvanced = () => {
    class Greeter {
        greeting: string;
        constructor(message: string) {
            this.greeting = message;
        }
        greet() {
            return "Hello, " + this.greeting;
        }
    }

    let greeter: Greeter;
    greeter = new Greeter("world");
    console.log(greeter.greet());
    console.log("======");

    // constructor function
    let Greeter2 = (function () {
        function Greeter2(message) {
            this.greeting = message;
        }
        Greeter2.prototype.greet = function () {
            return "Hello, " + this.greeting;
        };
        return Greeter2;
    })();

    let greeter2;
    greeter2 = new Greeter2("world");
    console.log(greeter2.greet());

};
//caseAdvanced(); // actually I don't understand
const caseAdvanced2 = () => {
    class Greeter3 {
        static standardGreeting = "Hello, there";
        greeting: string;
        greet() {
            if (this.greeting) {
                return "Hello, " + this.greeting;
            }
            else {
                return Greeter3.standardGreeting;
            }
        }
    }

    let g3: Greeter3;
    g3 = new Greeter3();
    console.log(g3.greet());

    let greeterMaker: typeof Greeter3 = Greeter3;
    greeterMaker.standardGreeting = "Hey there!";
    let g4 = new greeterMaker();
    console.log(g4.greet());

    let g31 = new Greeter3();
    g31.greeting = "Sergio";
    console.log(g31.greet());
};
//caseAdvanced2();
const interfaceFromClass = () => {
    class A1 {
        a1: number
    }
    class A2 extends A1 {
        a2: number
    }
    class A3 extends A2 {
        a3: number
    }
    interface I0 extends A3 {}
    let x: I0 = {a1: 1, a2: 2, a3: 3};
    console.log(x);
    interface I1 {
        b1: string;
    }
    interface I2 {
        b2: string;
    }
    interface X1 extends I0, I1, I2 {
    }
    let x1: X1 = {a1: 1, a2: 2, a3: 3, b1: "B1", b2: "B2"};
    console.log(x1);
    console.log(x1 instanceof A1);
    console.log(x1 instanceof A2);
    console.log(x1 instanceof A3);
};
//interfaceFromClass();
const function01 = () => {
    function add1(x, y) {
        return x + y;
    }
    const add2 = function(x, y) { return x + y;}
    const add3 = (x, y) => x + y;
    const add4 = (x = 1, y = 2) => x + y;
    console.log(add1(1,2));
    console.log(add2(1,2));
    console.log(add3(1,2));
    console.log(add4(1));
    console.log(add4());
};
//function01();
const function02 = () => {
    let a = 1;
    function addToA(b: number, c: number): number {
        return a + b + c;
    }
    console.log(2,3);
    a = 20; // doesn't affect captured value 'a=1'
    console.log(2,3);
};
//function02();
const function03 = () => {
    let myAdd1 =
        function(x: number, y: number): number { return x + y; };
    console.log(myAdd1(5, 6));

    let myAdd2: (x: number, y: number) => number =
        function(x: number, y: number): number { return x + y; };
    console.log(myAdd2(5, 7));

    let myAdd3: (base: number, delta: number) => number =
        function(x: number, y: number): number { return x + y; };
    console.log(myAdd3(5, 8));

    let myAdd4: (base: number, delta: number) => void =
        function(x: number, y: number): void { console.log(x + y); };
    myAdd4(5,9);

    //Inferring the types
    let myAdd7 = function(x: number, y: number): number { return  x + y; };

    // The parameters 'x' and 'y' have the type number
    let myAdd8: (baseValue: number, increment: number) => number =
        function(x, y) { return x + y; };

    let n1 = myAdd7(5, 10);
    let n2 = myAdd8(5, 11);
};
//function03();
const function04 = () => {
    // implicit
    const build1 = (...names: string[]) => {
        return names.join(" ");
    };
    // explicit
    const build11 = (...names: string[]): string => {
        return names.join(" ");
    };
    const build2
        = (...names: string[]) => names.join(" ");
    const build21 : (...names: string[]) => string
        = (...names: string[]) => names.join(" ");
    console.log(build1("Alla", "Dima", "Masha", "Petro"));
    console.log(build11("Alla", "Dima", "Masha", "Petro"));
    console.log(build2("Alla", "Dima", "Masha", "Petro"));
    console.log(build21("Alla", "Dima", "Masha", "Petro"));
};
//function04();
const function05 = () => {
    interface Card {
        suit: string;
        card: number;
    }

    interface Deck {
        suits: string[];
        cards: number[];
        createCardPicker(this: Deck): () => Card;
    }

    let deck: Deck = {
        suits: ["hearts", "spades", "clubs", "diamonds"],
        cards: Array(52),
        createCardPicker: function(this: Deck) {
            return () => {
            //return function() { // produces error
                let pickedCard = Math.floor(Math.random() * 52);
                let pickedSuit = Math.floor(pickedCard / 13);

                return {suit: this.suits[pickedSuit], card: pickedCard % 13};
            }
        }
    };

    let cardPicker = deck.createCardPicker();
    let pickedCard = cardPicker();

    console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
};
//function05();
const function06 = () => {
    const f1 = () => {
    //const f1 = (this: void) => { // will produce error
        console.log(this); // {}
    };
    function f2(this: void):void {
        console.log(this);
    }
    f1();
    f2();
};
//function06();
const function07 = () => {
    let suits = ["hearts", "spades", "clubs", "diamonds"];

    function pickCard(x): any {
        // Check to see if we're working with an object/array
        // if so, they gave us the deck and we'll pick the card
        if (typeof x == "object") {
            let pickedCard = Math.floor(Math.random() * x.length);
            return pickedCard;
        }
        // Otherwise just let them pick the card
        else if (typeof x == "number") {
            let pickedSuit = Math.floor(x / 13);
            return { suit: suits[pickedSuit], card: x % 13 };
        }
    }

    let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
    let pickedCard1 = myDeck[pickCard(myDeck)];
    console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);

    let pickedCard2 = pickCard(15);
    console.log("card: " + pickedCard2.card + " of " + pickedCard2.suit);
};
//function07();
const function08 = () => {
    function f1(a: number): string;
    function f1(a: string): string;
    function f1(a: number | string) {
        return a.toString();
    }
    console.log(f1(11));
    console.log(f1("Dima"));

    function f2(a: number | string) {
        return a.toString();
    }
    console.log(f2(42));
    console.log(f2("AleX"));
};
//function08();
const collectionsIdeas = () => {
    const Collections = require('typescript-collections');
    let s = new Collections.Set();
    s.add(1);
    s.add(2);
    s.add("abc");
    s.add("cde");
    s.forEach((item)=>{
        if (typeof item === 'number') {
            console.log("number:", item);
        } else if (typeof item === 'string') {
            console.log("string:", item);
        }
    });
};
//collectionsIdeas();
const generic01 = () => {
    function convert1<T>(arg: T): T {
        return arg;
    }
    let rn3: number = convert1<number>(1); // explicit
    let rn1         = convert1(1); // implicit
    let rn2: number = convert1(1); // implicit
    let rs3: string = convert1<string>("abc");  // explicit
    let rs1         = convert1("abc"); // implicit
    let rs2: string = convert1("abc"); // implicit

    console.log(typeof rn1);
    console.log(typeof rn2);
    console.log(typeof rn3);
    console.log(typeof rs1);
    console.log(typeof rs2);
    console.log(typeof rs3);
};
//generic01();
const generic02 = () => {
    interface Having {
        opt1: number;
        opt2: string;
    }
    function convert2<T extends Having>(arg: T): T {
        console.log(arg.opt1);
        console.log(arg.opt2);
        return arg;
    }
    convert2({opt1:1, opt2:"abc"});
    convert2({opt1:1, opt2:"abc", opt:true});
};
//generic02();
const generic03 = () => {
    function identity<T>(arg: T): T {
        return arg;
    }
    let ident1 = identity;
    console.log(ident1(1));

    let myIdentity1                   = identity;
    let myIdentity2: <T>(arg: T) => T = identity;
    let myIdentity3: <U>(arg: U) => U = identity;
    let myIdentity4: {<T>(arg: T): T} = identity;

    let number1: number = myIdentity1<number>(1);
    let number2         = myIdentity2<number>(1);
};
//generic03();
const generic04 = () => {
    interface InterfaceFn1 {
        <T>(arg: T): T;
    }
    function identityF1<T>(arg: T): T {
        return arg;
    }
    let identity1: InterfaceFn1 = identityF1;
    identity1(1);
    identity1("abc");

    interface InterfaceFn2<T> {
        (arg: T): T;
    }

    function identityF2<T>(arg: T): T {
        return arg;
    }
    let identity2: InterfaceFn2<number> = identityF2;
    identity2(1);
    // identity2("2"); // will produce error because it already has a type opened
};
//generic04();
const generic05 = () => {
    class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;
        add1: (x: number, y: number) => number; // we have type - we can omit implementation
        add2 (x: number, y: number): number { // we don't have type - we should write implementation right now
            return x + y;
        };
    }

    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function(x, y) { return x + y; };
    myGenericNumber.add = (x, y) => x + y;
    myGenericNumber.add = (x: number, y: number): number => x + y;
    myGenericNumber.add1 = function(x, y) { return x + y; };
    myGenericNumber.add2 = function(x, y) { return x - y; };
    myGenericNumber.add2 = (x, y) => x - y;
    myGenericNumber.add2 = (x: number, y: number): number => x - y;
    // myGenericNumber.add2 = (x: string, y: string): string => x - y;
    // we can't change type after we have opened the generic to specific type

    let stringNumeric = new GenericNumber<string>();
    stringNumeric.zeroValue = "";
    stringNumeric.add = function(x, y) { return x + y; };

    console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
};
//generic05();
const generic06 = () => {
    function getProperty<T, K extends keyof T>(obj: T, key: K) {
        return obj[key];
    }

    let x = { a: 1, b: 2, c: 3, d: 4 };
    console.log(getProperty(x, "a"));
};
//generic06();
const generic07 = () => {
    function create<T>(claz: {new(): T; }): T {
        return new claz();
    }
    let a = create(Array);
    console.log(typeof a); // object
    console.log(a instanceof Array); // true
};
//generic07();
const generic08 = () => {
    class BeeKeeper {
        hasMask: boolean;
    }
    class ZooKeeper {
        nametag: string;
    }
    class Animal {
        numLegs: number;
    }
    class Bee extends Animal {
        keeper: BeeKeeper;
    }
    let b = new Bee();
    let m1 = b.keeper.hasMask;
    let n1 = b.numLegs;
    class Lion extends Animal {
        keeper: ZooKeeper;
    }
    let l = new Lion();
    let m2 = l.keeper.nametag;
    let n2 = l.numLegs;

    function createInstance<A extends Animal>(c: new () => A): A {
        return new c();
    }
    createInstance(Lion).keeper.nametag; // type checking does work!
    createInstance(Bee).keeper.hasMask; // type checking does work!

};
//generic08();
const enums01 = () => {
    enum Direction0 {
        Up,
        Down,
        Left,
        Right,
    }
    enum Direction1 {
        Up = 1,
        Down, //2
        Left = 5,
        Right, //6
    }
    let up0 = Direction0.Up;
    let up1 = Direction1.Up;
    console.log(up0 === Direction0.Up);
    console.log(up1 === 1);

    console.log(Direction1.Up);
    console.log(Direction1.Down);
    console.log(Direction1.Left);
    console.log(Direction1.Right);

    let getSomeValueA = () => 5;
    let getSomeValueB = () => 11;

    enum E {
        A = getSomeValueA(),
        // B, // error! 'A' is not constant-initialized, so 'B' needs an initializer
        B = getSomeValueB()
    }
    E.A;
    E.B;

    //string ENUMS
    enum DirectionS {
        Up = "UP",
        Down = "DOWN",
        Left = "LEFT",
        Right = "RIGHT",
    }

    enum E { X }
    let x = E.X;
    console.log(typeof x); // number
    console.log(x === E.X); // T
    console.log(x == E.X); // T
    console.log(x == 0); // T
    console.log(x === 0); // T
    console.log(x); // 0

};
//enums01();
const enums02 = () => {
    enum ShapeKind {
        Circle,
        Square,
    }

    interface Circle {
        kind: ShapeKind;
        //kind: ShapeKind.Circle;
        radius: number;
    }

    interface Square {
        kind: ShapeKind.Square;
        sideLength: number;
    }

    let c: Circle = {
        kind: ShapeKind.Square,
        //    ~~~~~~~~~~~~~~~~ Error!
        radius: 100,
    }

    enum Enum {
        A = 1,
        B,
        C = 2
    }
    console.log(Enum.A);
    console.log(Enum.B);
    console.log(Enum.C);
    let e1 = Enum.B;
    let e2 = Enum.C;
    console.log(e1 === e2);

};
enums02();
const enums03 = () => {

};
enums03();



// find_all();
// drop_table();

// let app = express();
//
// app.get('/', function (req, res) {
//     res.send("it works");
// });
//
// app.listen(3000);

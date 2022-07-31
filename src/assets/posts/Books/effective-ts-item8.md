# Item 8. 타입 공간과 값 공간의 심벌 구분하기

타입 스크립트의 심벌은 타입 공간이나 값 공간 중의 한 곳에 존재할 수 있다.

## 같은 이름의 심벌
심벌은 이름이 같더라도 할당 가능하지만, 공간에 따라 다른 것을 나타내기 떄문에 혼란스러울 수 있다.

```ts
interface Cylinder { // type
  radius: number;
  height: number;
}

const Cylinder = (radius: number, height: number) => ({radius, height}); // function (생성자)

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) { // ❗️ instanceof 는 런타임에서만 사용 가능하므로 Cylinder 함수를 의미한다.
    shape.radius // Property 'radius' does not exist on type '{}'.
  }
}
```

위에서 `Cylinder` 는 interface, function 사용된다. 조건문의 `instanceof` 는 런타임 연사자이며, `Cylinder` 는 타입이 아닌 함수를 참조한다.

## 리터럴 값과 타입
한 심벌이 타입인지, 값인지는 언뜻 봐서는 알 수 없다. 어떻게 쓰이는지 문맥을 파악해야 한다. 예를 들어 리터럴은 다음과 같이 작성될 수도 있다.

```ts
type T1 = 'string literal';
type T2 = 123;
const v1 = 'string literal';
const v2 = 123;
```

const 로 정의된 것은 리터럴로 간주되기 때문에 T1과 v1의 타입이 같다.

## 타입과 값 구분하기
일반적으로 `type`, `interface` 뒤에 나오는 심벌은 타입, 변수로 선언되는 심벌은 값이다. 두 공간에 대한 개념을 잡으려면 [ts 플레이 그라운드](https://www.typescriptlang.org/play) 를 활용하면 된다. ts가 js 로 컴파일되면서 사라지는 것들이 타입 공간의 심벌이다.


## 타입, 값일 때 다른 기능을 하는 것들

### Class
`class` 와 `enum` 은 상황에 따라 타입과 값 두가지 모두 가능한 예약어이다. 아래에서 Cylinder 는 class로 쓰였다.
```ts
class Cylinder {
  radius=1;
  height=1;
}

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape  // OK, type is Cylinder
    shape.radius  // OK, type is number
  }
}
```

클래스가 타입으로 쓰일 떄는 형태(속성과 메서드)가 사용되는 반면, 값으로 쓰일 때는 생성자가 사용된다. 야기서는 `Cylinder` 가 클래스로서 shape가 실린더의 인스턴스인지 확인한다. 인스턴스라면 반지름과 높이를 가질 것이다.


### typeof
한편, 연산자 중에세도 타입에 쓰을 때와 값에 쓰일 때 다른 기능을 하는 것도 있다. `typeof` 도 그중 하나이다.
```ts
type T1 = typeof p;  // Type is Person
type T2 = typeof email;
    // Type is (p: Person, subject: string, body: string) => Response

const v1 = typeof p;  // Value is "object"
const v2 = typeof email;  // Value is "function"
```

일반적으로 변수에 할당하면 값으로, 타입으로 정의하면 타입으로서 동작한다.
```ts
const v = typeof Cylinder;  // Value is "function"
type T = typeof Cylinder;  // Type is typeof Cylinder
```

- const는 문자열로 된 js에서의 변수 자료형(`"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"`)을 표시한다. 
- type 으로 지정해야 ts의 타입이 정의된다.

클래스가 js에서는 실제로 함수로 구현되기 때문에 첫번째 값은 function이 되는 것이다. 두번째 타입은 인스턴스의 타입이 아니라, 생성자 함수 타입이 된다.

```ts
declare let fn: T;
const c = new fn();  // Type is Cylinder
```

`InstanceType` 제네릭을 사용하여 생성자 타입과 인스턴스 타입을 전환할 수 있다.
```ts
type C = InstanceType<typeof Cylinder>;  // Type is Cylinder
const c1: C = new fn()
```

### class 와 typeof

정리하자면 다음과 같다. 클래스로 정의된 `Cylinder`의 경우
```ts
class Cylinder {
  radius=1;
  height=1;
}

const v = typeof Cylinder;  // js의 typeof 는 function
type T = typeof Cylinder;  // 클래스의 타입은 typeof Cylinder

const c = new Cylinder();  // 인스턴스의 타입은 Cylinder
type C = InstanceType<typeof Cylinder>;  // 클래스 타입의 인스턴스 타입은 Cylinder (위와 동일)
const c1: C = new Cylinder()
```

## 타입에서의 속성접근자
속성접근자인 `[]`는 타입으로 쓰일 때에도 동일하다. 그러나 obj['field'] 와 obj.field 는 값이 동일하더라도 타입은 다를 수 있다. 따라서 타입의 속성을 얻을 때는 반드시 전자를 사용해야 한다.

```ts
const first: Person['first'] = p['first']; 
type PersonEl = Person['first' | 'last'];  // Type is string
type Tuple = [string, number, Date];
type TupleEl = Tuple[number];  // Type is string | number | Date
type TupleEl = Tuple[0];  // Type is string
```

`Person['first']` 는 `:` 뒤에 쓰였기 때문에 타입이다. 인덱스 위치(`[]`) 에는 유니온 타입과 기본형 타입을 포함한 어떠한 타입이든 사용할 수 있다.


## 두 공간 사이에서 서로 다른 의미를 가지는 코드패턴

두 공간 사이에서 다른 의미를 가지는 코드 패턴들이 있다.

| 목록 | 값 | 타입 |
| ---- | ------- | -------- |
| `this` | js의 this 키워드 (object 자기자신) | 일명 `다형성 this` 라고 불리는 this의 타입스크립트 타입 |
| `&, |` | AND, OR 비트 연산 | 인터섹션, 유니온 |
| `const` | 새 변수 선언 | as const 로 리터럴 또는 타입 단언 |
| `extends` | 서브 클래스 | 서브 타입, 제너릭 타입의 한정자 |
| `in` | for 루프 | 매핑된 타입 |


## 자주 하는 실수 : 값과 타입을 혼동하는 경우
타입스크립트 코드가 잘 동작하지 않는 다면 타입 공간과 값 공간을 혼동해서 잘못 작성했을 가능성이 크다. email 함수를 단일 매기변수로 객체를 받도록 변경해보자.

```ts
function email(options: {person: Person, subject: string, body: string}) {
  // ...
}

// ❌ error
function email({person: Person, subject: string, body: string}) {
  // Binding element 'Person' implicitly has an 'any' type.
}
```

구조분해 할당을 할 경우 전자는 오류가 된다. Person과 string이 값으로 해석되었기 때문이다. 그냥 아래와 같은 객체를 타입 없이 할당한 것과 동일하다. 즉, 타입은 지정되지 않았고 `Person`, `string` 은 값으로 할당되었다.
```js
const options = {
  person: Person,
  subject: string,
  body: string
}
```

문제를 해결하려면 값과 타입을 구분해야 한다.
```ts
// 🟢 okay
function email(
  {person, subject, body}: {person: Person, subject: string, body: string}
) {
  // ...
}

// or
interface Props {
  person: Person,
  subject: string,
  body: string
}
function email({person, subject, body}: Props) {
  // ...
}
```

## 요약
- 타입 스크립트 코드를 읽을 때 값 공간과 타입 공간을 구분해야한다.
- 모든 값은 타입을 가지지만, 타입은 값을 가지지 않는다.
- class, enum 과 같은 키워드는 타입과 값 두가지로 사용될 수 있다.
- "foo", 123 은 리터럴 이거나, 리터럴 타입일 수 있다.
- 값, 타입 공간에서 서로 다른 의미를 가지는 키워드 및 연산자들이 있다.
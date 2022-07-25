# [Effective TypeScript] Chap1. 타입스크립트 알아보기
> TS의 큰 그림을 이해하는 데 도움이 될 내용을 다룬다. TS란 무엇이고, TS를 어떻게 여겨야 하는지, JS와는 어떤 관계인지 등을 알아본다.

## Item1. TS와 JS 의 관계 이해하기
- TS는 문법적으로 JS의 상위 집합이다. JS에 문법 오류가 없다면 유효한 TS 프로그램이라고 할 수 있다.
- 그런데 JS 프로그램에 어떤 이슈가 존재한다면 문법의 오류가 아니더라도 타입 체케에게 지적당할 가능성이 높습니다.
- `모든 JS 프로그램은 TS 프로그램이다` 라는 명제는 참이지만, 역은 성립하지 않는다.
-  TS는 JS 런타임 동작을 모델링하는 타입시스템을 갖고 있다. 하지만 TS가 모든 런타임 오류를 체크할 수는 없다.

### 타입체커는 타입 추론으로 문제점을 찾아낸다.
TS는 런타임에 오류를 발생시킬 부분을 미리 찾아준다 = "TS는 정적 타입 시스템"
```ts
let city = "new york city" // city가 string으로 추론되었기 때문에
console.log(city.toUppercase()) // toUpperCase 로 바꿀 것을 제안해준다.
```

### 타입체커는 추가적인 타입 구문이 없어도 오류를 찾아낸다.
아래 예시를 보면 문법적인 오류는 없지만, 사용자는 실수로 오타를 냈다는 것을 알 수 있다.
TS는 아래의 경우에서 에러 메시지를 보여준다. 하지만 이때 타입체커는 오타를 찾아주는 것이 아니라, 그 타입에 특정 속성이 있는지를 확인해주고 유사한 key 를 제안하는 것이다. JS 라면 오류 없이 런타임에서 "undefined" 를 출력할 것이다.

```ts
const states = [
  {name: "Alabama", capital: "Montgomery"},
  {name: "Alaska", capital: "Juneau"},
  {name: "Arizona", capital: "Phoenix"},
]

states.map(state => console.log(state.capitol)) // state에 capitol이 없다. capital 이걸 쓰려고 했던것 아닌가?
```

### 명시적으로 타입을 선언하여 의도를 분명히 하면 더 적절한 해결책을 얻을 수 있다.

```ts
interface State {
  name: string;
  capital: string;
}
const states1: State[] = [
  {name: "Alabama", capital: "Montgomery"},
  {name: "Alaska", capital: "Juneau"},
  {name: "Arizona", capital: "Phoenix"},
]

states1.map(state => console.log(state.capitol)) // state에 capitol이 없다.

const states2 = [
  {name: "Alabama", capital: "Montgomery"},
  {name: "Alaska", capitol: "Juneau"}, // 👈 No problem
  {name: "Arizona", capital: "Phoenix"},
]

const states3: State[] = [ // 타입을 지정해주면
  {name: "Alabama", capital: "Montgomery"},
  {name: "Alaska", capitol: "Juneau"}, // 👈 state에 capitol이 없다는 것을 알려준다.
  {name: "Arizona", capital: "Phoenix"},
]
```

### 타입스크립트 타입 시스템은 자바스크립트의 런타임 동작을 "모델링"한다.
자바스크립트의 런타임 동작을 모델링 하는 것은 타입스크립트 타입 시스템의 기본 원칙이다. 하지만 아래처럼 원치 않는 동작을 하는 경우도 있다.
```ts
// JS 런타임 동작으로 모델링
const x = 2 + "3" // string
const y = "2" + 3 // string

// JS 런타임 동작으로 모델링 되지 않고 타입 체커에 걸림
const a = null + 7 // 🟢 [] 는 + 연산의 아규먼트로 쓰일 수 없습니다
const b = [] + 12 // ❌ [] 는 + 연산의 아규먼트로 쓰일 수 없습니다
```

### TS는 정확성을 보장하지 않는다.
TS는 정확성을 보장하기 위한 언어는 아니다. names는 string[] 이기 때문에 names의 원소는 toUpperCase 메서드를 가진다.
TS는 names의 out of range 는 알 수 없다.
```ts
const names = ["Alice", "Bob"]
console.log(names[2].toUpperCase()) // 런타임에서 오류 발생
```

## Item2. 타입스크립트 설정 이해하기
- TS는 설정에 따라 전혀 다른 언어가 될 수 있다.
- `tsc --init` 으로 tsconfig 파일을 생성할 수 있다.
- 업무 효율을 위해 tsconfig를 잘 설정하고 동료와 공유할 수 있다.
- `noImplicitAny`, `strictNullChecks` 는 설정하는 것이 좋다.

### noImplicitAny
any 가 허용되면 TS는 JS와 같아지며, 위험하다. 타입을 지정하지 않은 데이터는 암시적으로 any로 간주된다. 오류를 수정하기 위해 명시적으로 any 라고 쓸 수 있지만, any 타입을 지양하는 것이 좋다. 단, JS를 TS로 마이그레이션 하는 과정에서는 필요할 때도 있다.(이것도 나중에 수정해야 함)
```ts
// 😡 bad
function add(a, b) { // "noImplicitAny": false 면 오류 없음, true일때는 오류!
  return a + b
}
add(10, null)

// 👍 Good
function add1(a: number, b: number) { // 분명한 타입을 명시하기
  return a + b
}
```

### strictNullChecks
`strictNullChecks` 는 null, undefined 가 모든 타입에서 허용되는지 확인하는 설정이다.

```ts
const num1: number = null // 😡 null을 할당할 수 없다.
const num2: number = undefined // 😡 undefined을 할당할 수 없다.
const num3: number | null = null // OK, 🟢 null을 허용하고 싶다면 타입에 명시


// null check or assertion(단언, !)
const el = document.querySelector("#status")
el.textContent = "Ready"

if (el) { // null 제거
  el.textContent = "Ready"
}

el!.textContent = "Ready" // null이 아님을 단언
```

## Item3. 코드 생성과 타입이 관계 없음을 이해하기
큰 그림에서 보면, TS 컴파일러는 두 가지 역할을 수행한다.
- 최신의 TS/JS 코드를 구버전의 JS 코드로 트랜스파일(transpile) 한다.
- 코드의 타입 오류를 체크한다.
주목할 점은 위 두 가지가 완전히 독립적이라는 것이다. 타입체커와 컴파일은 완전히 독립적이며, 타입 체커에 오류가 발견되어도 컴파일은 진행된다.
- 코드 생성은 타입 시스템과 무관하다. TS의 타입은 런타임 동작이나 성능에 영향을 주지 않는다.

### 타입오류가 있어도 컴파일 가능하다
ts에서는 아래 코드가 오류이지만, JS 로 컴파일된다. 컴파일된 JS에는 타입이 없기 때문에 전혀 문제가 되지 않는다. TS는 오류를 경고할 뿐이지, 빌드를 멈추게 하지는 않는다.
```ts
let hello = "hello"
hello = 10 // 오류지만 JS로 컴파일된다.
```

### 런타임에는 타입 체크가 불가능하다
```ts
interface Square {
  width: number;
}

interface Rectangle extends Square {
  height: number;
}

type Shape = Square | Rectangle;

// ❌ 타입은 런타임에서 제거된다.
function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) { // instanceof는 런타임에 일어나지만 Rectangle은 런타임에 없음
    return shape.width * shape.height
  } else {
    return shape.width * shape.width
  }
}

// 🟢 런타임에도 제거되지 않는 속성을 사용
function calculateArea1(shape: Shape) {
  if ("height" in shape) {
    return shape.width * shape.height
  } else {
    return shape.width * shape.width
  }
}

// 🟢 태그기법 : kind(값)를 추가하여 런타임에 접근 가능한 타입 정보를 저장한다. 
interface Square1 {
  kind: "square" // kind 추가
  width: number;
}

interface Rectangle1 {
  kind: "rectangle" // kind 추가
  width: number;
  height: number;
}

type Shape1 = Square1 | Rectangle1;

function calculateArea2(shape: Shape1) {
  if (shape.kind === "rectangle") {
    return shape.width * shape.height
  } else {
    return shape.width * shape.width
  }
}

// 🟢 Class로 만들기 : 타입, 값을 둘다 사용가능하게 한다.
interface Square3 {
  width: number;
}

interface Rectangle3 extends Square3 {
  height: number;
}

class Square3 {
  constructor(public width: number) {}
}

class Rectangle3 extends Square3 {
  constructor(public width: number, public height: number) {
    super(width)
  }
}

type Shape3 = Square3 | Rectangle3; // 여기서는 타입으로 사용됨

function calculateArea3(shape: Shape3) {
  if (shape instanceof Rectangle3) { // 여기서는 class로 사용됨
    return shape.width * shape.height
  } else {
    return shape.width * shape.width
  }
}
```

### 타입연산은 런타임에 영향을 주지 않는다.
```ts
// ❌ 타입 연산은 런타임에서 제거된다.
function asNumber(val: number | string): number {
  return val as number // "as number"는 js로 변환하면 사라진다. string을 넣으면 string이 나온다.
}

// 🟢 런타임의 타입을 체크하고 JS 연산으로 변환해야한다.
function asNumber2(val: number | string): number {
  return typeof val === "string" ? Number(val) : val
}
```

### 런타임 타입은 선언된 타입과 다를 수 있다.
ts는 일반적으로 실행되지 못하는 죽은코드를 찾아내지만, 아래 switch 문에서는 strict를 설정하더라도 찾아내지 못합니다. 잠재적으로 `default` 가 실행될 가능성이 있다는 것이다. `default` 가 실행되는 경우는 어떤게 있을까?
```ts
function setLightSwitch(value: boolean) { // boolean만 허용되기때문에 default가 실행되지 않을 것 같다.
  switch (value) {
    case true:
      // on
      break
    case false:
      // off
      break
    default:
      console.log("실행될까요?")
  }
}

interface Result {
  value: boolean // result 타입을 명시한다.
}

async function setLight() {
  const res = await fetch("/light")
  const result: Result = await res.json() // result에는 value가 반드시 있을 것이다. 타입체커에는 이상이 없다.
  setLightSwitch(result.value) // 근데 만약 API의 res가 런타임에서 다른 값으로 들어온다면? default에 걸릴 수 있다.
}
```
아무리 타입을 잘 지정해도, 런타임에서 전혀 다른 값이 들어올 수 있다. 물론 대부분의 경우 API 명세에 따라 타입을 지정하겠지만, 휴먼에러로 다른 값이 들어올 수 있고 타입스크립트는 이러한 문제를 해결해주지는 않는다.

### 타입스크립트 타입으로는 함수를 오버로드할 수 없다.
C ++ 이나 다른 언어에서는 매개변수만 다른 같은 이름의 함수를 허용하는 `함수 오버로딩`이 가능하다.
하지만 TS는 함수의 파라미터에 대한 타입 오버로딩만 지원하고 함수의 구현체는 유일하다.

```ts
// ❌ 함수 오버로딩 불가
function add2(a: number, b: number) { return a + b }
function add2(a: string, b: string) { return a + b }

// 🟢 구현체는 하나만
function add3(a: number, b: number): number
function add3(a: string, b: string): string
function add3(a: any, b: any): any { return a + b }
```

### 타입스크립트의 타입은 런타임 성능에 영향을 주지 않는다.
타입과 타입 연산자는 js 로 컴파일 되면서 전부 사라진다. 따라서 런타임에서는 그냥 js 파일만 있을 뿐이다. 그렇기 때문에 TS 가 런타임 성능에 영향을 주는 일은 없다. 대신 빌드 타임에 TS를 JS로 변환하는 시간을 걸린다. 하지만 이것 역시 빌드시에 `transpile only` 를 설정하여 타입 체크를 건너 뛸 수 있다.

타입스크립트는 성능, 호한성 중 어느것을 우선시 할지 선택하여 빌드할 수 있고, 설정에 따라 빌드 속도를 조절할 수 있다.

## Item4. 구조적 타이핑에 익숙해지기
JS는 본질적으로 [덕타이핑](https://ko.wikipedia.org/wiki/%EB%8D%95_%ED%83%80%EC%9D%B4%ED%95%91) 이다. TS는 구조적 타이핑을 지원한다.
- JS는 덕타이핑 기반이고, TS가 이를 모델링 하기 위해 구조적 타이핑을 사용한다.
- 어떤 인터페이스에 할당 가능한 값이라면, 타입 선언에 명시적으로 나열된 속성을 가지고 있을 것이다.
- 타입은 열려(open) 있다.
- 클래스도 구조적 타이핑을 따르며, 인스턴스가 예상과는 다를 수 있다.
- 구조적 타이핑을 사용하면 유닛 테스트를 손쉽게 할 수 있다.

| 덕타이핑 | 구조적 타이핑|
|-------|-------|
| 객체의 변수, 메소드의 집합이 객체의 타입을 결정하는 것 | 실제 구조와 정의에 의해 결정되는 타입 시스템의 한 종류 |
| 런타임에 타입을 체크(동적) | 컴파일 타임에 타입을 체크(정적) |
| 다형성 관점 | 타입 체킹 관점 |

### TS의 구조적 타이핑
```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x + v.x + v.y * v.y)
}

// 🟢 구조적 타이핑으로 NamedVector가 Vector2D를 포함하기 때문에 가능
interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = {x: 3, y: 4, name: "Z"}
calculateLength(v) // v는 Vector2D 가 아니지만, NamedVector가 Vector2D와 호환되기때문에 OK

// ❌ 타입 확장으로 사용은 가능하지만, z는 무시되어 원하는 결과가 나오지는 않음
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

const v1: Vector3D = {x: 3, y: 4, z: 5}

function normalize(v: Vector3D) {
  const length = calculateLength(v1); // 구조적 타입 관점에서 Vector3D는 Vector2D와와 호환된다 -> 타입은 Open 되어 있다.
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}

// ❌ 타입은 오픈되어 있기때문에 무엇이 올지 알 수 없다.
function calculateLengthL1(v: Vector3D) {
  let length = 0;
  for (const axis of Object.keys(v)) {
    const coord = v[axis];
    length += Math.abs(coord);
  }
  return length;
}

const vec3D = {x: 3, y: 4, z: 1, address: '123 Broadway'}; // address는 문자열이지만 x,y,z 가 있어서 Vector3D와 호환된다.
calculateLengthL1(vec3D);  // OK, returns NaN


// 🟢 따라서 반복문 보다는 모든 속성을 각각 더하는 구현이 더 낫다.
function calculateLengthL2(v: Vector3D) {
  return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}

// ❗️ 구조적 타이핑은 클래스 관련 할당에서도 당황스러운 결과를 보여준다.
class C {
  foo: string;
  constructor(foo: string) {
    this.foo = foo;
  }
}

const c = new C('instance of C');
const d: C = { foo: 'object literal' };  // OK! foo 속성이 있으니 C 타입이 맞다고 판단.
// 하지만, C 에 다른 메서드가 있었다면, 문제가 발생한다.
```

### 테스트를 작성할 때는 구조적 타이핑이 유리하다.
데이터베이스에 쿼리를 하고 결과를 처리하는 함수를 가정해보자. 아래 예시에서 `getAuthors` 함수를 테스트 하기 위해서 모킹한 DB를 생성해야 하지만, 구조적 타이핑을 활용하여 더 구체적인 인터페이스를 정의할 수 있다.
`getAuthors` 에서 사용하는 속성만을 가진 타입으로 정의하는 것이다. 타입을 추상화 함으로써 모킹 라이브러리를 쓸 필요 없이 간단하게 테스트 코드를 작성할 수 있게 된다.

```ts
interface PostgresDB { // 실제 DB의 타입
  id: string;
  key: string;
	...
  runQuery: (sql: string) => any[];
}

interface Author {
  first: string;
  last: string;
}

interface DB { // PostgresDB를 모킹하기 위한 타입
  runQuery: (sql: string) => any[]; // 아래 함수에서 사용할 메서드만 가지고 있음
}

function getAuthors(database: DB): Author[] { // PostgresDB가 runQuery을 가지고 있기 때문에 DB로 정의해도 런타임에서 사용가능
  const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`); // runQuery 메서드가 있는 어떤 객체라도 사용 가능하게 된다.
  return authorRows.map(row => ({first: row[0], last: row[1]}));
}

// test도 간단한 객체를 사용하여 테스트 가능
test('getAuthors', () => {
  const authors = getAuthors({
    runQuery(sql: string) {
      return [['Toni', 'Morrison'], ['Maya', 'Angelou']];
    }
  });

  expect(authors).toEqual([
    {first: 'Toni', last: 'Morrison'},
    {first: 'Maya', last: 'Angelou'}
  ]);
});
```

## Item5. any 타입 지양하기
- any 타입을 사용하면 타입 체커와 타입스크립트 언어 서비스를 무력화시킨다.
- any는 최대한 피하자

### any 타입에는 타입 안정성이 없다.
타입 체커는 처음에 정의한대로 number로 판단할 것이고, 실제 값은 string이 된다.
```ts
let age: number;
age = '12';
age = '12' as any;  // OK
age += 1; // 런타임에는 정상이지만 "121" 이 된다.
```

### any는 함수 시그니처를 무시해버린다.
any를 사용하면 기껏 함수의 인자에 타입을 정의한 것이 무용지물 되어 버린다.
```ts
function calculateAge(birthDate: Date): number {
  // ...
  return 0;
}
let birthDate: any = '1990-01-19'; // string은 Date 가 아닌데, 할당 가능해진다.
calculateAge(birthDate);  // OK
```

### any는 언어 서비스가 적용되지 않는다.
자동완성 불가, 마우스 호버시 타입 힌트가 any로만 나온다. 심볼 이름 변경도 IDE 등에서 제공해주는데, any로 하면 사용할 수 없다.

```ts
interface Person {
  first: string;
  last: string;
}

const formatName = (p: Person) => `${p.first} ${p.last}`;
const formatNameAny = (p: any) => `${p.first} ${p.last}`;
```

### any 타입은 코드 리팩터링 때 버그를 감춘다.
```ts
// ❌ 런타임에서 오류가 발생할 수 있다.
interface ComponentProps {
  onSelectItem: (item: any) => void;
}
function renderSelector(props: ComponentProps) { /* ... */ }

let selectedId: number = 0;

function handleSelectItem(item: any) {
  selectedId = item.id; // id가 있는지 알 수 없다. 런타임에서 id가 없으면 undefined가 들어간다.
}

renderSelector({onSelectItem: handleSelectItem});


// 🟢 id 만 필요한 것이라면 타입을 명확히 한다.
interface ComponentProps2 {
  onSelectItem: (id: number) => void;
}
```

### any는 타입 설계를 감춰버린다.
애플리케이션의 상태같은 객체를 정의하려면 꽤 복잡하다. 수많은 속성을 any로 지정하는 유혹에 빠지기 쉽다. 하지만 any를 쓰면 상태 객체의 설계를 감춰버리기 때문에, 위에서 설명한 각종 문제가 있고 언어 서비스도 적용되지 않아 업무 효율이 현저히 떨어진다.


### any는 타입 시스템의 신뢰도를 떨어뜨린다.
타입 체커가 휴먼에러를 잡아주어 코드의 신뢰도를 높인다. 그런데 TS를 썼는데도, 런타임에서 각종 오류를 만난다면 신뢰도가 떨어질 것이다.
any 를 쓰지 않으면 런타임에 발견될 수많은 오류를 미리 잡을 수 있고 신뢰도를 높일 수 있다.



## Codes
- [effectiveTS/chap1](https://github.com/parkjisu6239/TIL/tree/master/effectiveTS/chap1)
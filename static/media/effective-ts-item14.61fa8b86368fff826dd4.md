# Item 14. 타입 연산과 제네릭 사용으로 반복줄이기 

함수에서 중복을 찾아내는 것 만큼, 타임에서도 중복을 줄이는 것이 중요하다.

```ts
interface Person {
  firstName: string;
  lastName: string;
}

interface PersonWithBirthDate {
  firstName: string;
  lastName: string;
  birth: Date;
}
```

타입 중복은 코드 중복만큼 많은 문제를 발생시킨다. 예를 들어 선택적 필드인 `middleName` 을 `Person`에 추가하게 되면, `Person`과 `PersonWithBirthDate`은 전혀 다른 타입이 된다.

다음으로는 반복을 줄이는 방법에 대해서 알아보자

## 이름 붙이기
반복을 줄이는 가장 간단한 방법은 타임에 이름을 붙이는 것이다.

```ts
// Bad 👎
function distance(a: {x: number, y: number}, b: {x: number, y: number}) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Good 👍
interface Point2D {
  x: number;
  y: number;
}
function distance(a: Point2D, b: Point2D) { /* ... */ }
```

중복되는 파라미터를 `Point2D` 타입을 정의해서 사용할 수 있다.

```ts
// Bad 👎
function get(url: string, opts: Options): Promise<Response> { /* COMPRESS */ }
function post(url: string, opts: Options): Promise<Response> { /* COMPRESS */ }

// Good 👍
type HTTPFunction = (url: string, options: Options) => Promise<Response>;
const get: HTTPFunction = (url, options) => { /* COMPRESS */ };
const post: HTTPFunction = (url, options) => { /* COMPRESS */ };
```

함수의 파라미터와 리턴값이 동일한 패턴으로 사용되는 경우, 해당 함수 시그니처를 명명된 타입으로 분리해낼 수 있다.

## Extends, Intersection

```ts
interface Person {
  firstName: string;
  lastName: string;
}

// Bad 👎
interface PersonWithBirthDate {
  firstName: string;
  lastName: string;
  birth: Date;
}

// Good 👍
interface PersonWithBirthDate extends Person {
  birth: Date;
}

// Good 👍 (일반적인 방법은 아님)
type PersonWithBirthDate = Person & { birth: Date };
```

앞서 봤던 타입의 중복은 위처럼 extends를 사용할 수 있다. 이렇게 하면 `Person` 타입의 변경사항이 자동으로 `PersonWithBirthDate`에 반영되어 연관성을 유지할 수 있다. 이 처럼 두 인터페이스가 필드의 부분집합을 공유한다면, 공통 필드만 골라서 기반 클래스로 분리해낼 수 있다.


## Pick
```ts
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}
interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}
```

전체 애플리케이션의 상태를 표현하는 `State`와 단지 부분만 표현하는 `TopNavState` 가 있다. 여기서는 State가 더 상위 범주이므로, TopNavState 를 확장하는 것보다는 TopNavState를 State 의 부분집합으로 정의하는 것이 바람직하다.

```ts
// Bad 👎
interface State extends TopNavState {
  pageContents: string;
}
interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}

// Good 👍
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}
interface TopNavState {
  userId: State["userId"];
  pageTitle: State["pageTitle"];
  recentFiles: State["recentFiles"];
}

// Excerent 👍👍
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
};
```

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P]; } // 💡 gerneric Pick

// Excerent 👍👍
type TopNavState = Pick<State, "userId" | "pageTitle" | "recentFiles">
```

Pick은 제너릭 타입으로, 타입의 부분집합을 의미한다. Pick을 사용하는 것은 함수를 호출하는 것과 마찬가지로, 두 타입을 입력 받아, 새로운 타입을 반환한다.

## 인덱싱

```ts
interface SaveAction {
  type: 'save';
  // ...
}
interface LoadAction {
  type: 'load';
  // ...
}
type Action = SaveAction | LoadAction;

// Bad 👎 : Repeated types!
type ActionType = 'save' | 'load';

// Good 👍 : Type is "save" | "load"
type ActionType = Action['type'];

// ❗️ Difference : {type: "save" | "load"}
type ActionRec = Pick<Action, 'type'>;  // 👉 Pick은 객체를 반환
```

태그된 유니온에서도 중복이 발생한다. Action 유니온을 인덱싱(`Action['type']`) 하면 반복없이 `ActionType`을 정의할 수 있다.

## keyof

한편 생성하고 난 다음에 업데이트가 되는 클래스를 정의한다면, update 메서드 매개변수의 타입은 생성자와 동일한 매개변수이면서, 타입 대부분이 선택적 필드가 된다.

```ts
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}

// Bad 👎 
interface OptionsUpdate { // Options 과 구조는 동일하지만, 모두 optional
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

// Good 👍 
type OptionsUpdate = {[k in keyof Options]?: Options[k]};


class UIWidget {
  constructor(init: Options) { /* ... */ }
  update(options: OptionsUpdate) { /* ... */ }
}
```

`keyof` 는 타입을 받아서 속성 타입으 유니온을 반환한다.

```ts
type OptionsKeys = keyof Options; // Type is "width" | "height" | "color" | "label"
```

## Partial
위 패턴(모든 속성을 optional 로 바꾸는 패턴)은 아주 일반적이며, 표준 라이브러리에 `Partial` 이란 이름으로 포함되어 있다.

```ts
type Partial<T> = { // 💡 gerneric Partial
    [P in keyof T]?: T[P];
};

// Excerent 👍👍
type OptionsUpdate = Partial<Options>
```

## typeof
값에 해당하는 타입을 정의하고 싶을 떄는 typeof를 사용하면 된다.
```ts


const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: '#00FF00',
  label: 'VGA',
};

// Bad 👎 
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}

// Good 👍 
type Options = typeof INIT_OPTIONS
```

여기서의 typeof 는 타입 할당에 사용되었기 떄문에, 자바스크립트 런타임의 typeof 연산자와는 다르다. 타입스크립트의 문법으로서 사용된 것이다. 하지만 일반적으로 값에서 타입을 추출하는 것보다는, 타입을 먼저 정의하고 값에 타입은 선언하는 형태가 더 좋다.

## ReturnType
함수의 리턴 타입을 정의하고 싶을 수 있다.

```ts
const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: '#00FF00',
  label: 'VGA',
};

function getUserInfo(userId: string) {
  // COMPRESS
  const name = 'Bob';
  const age = 12;
  const height = 48;
  const weight = 70;
  const favoriteColor = 'blue';
  // END
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoriteColor,
  };
}

type UserInfo = ReturnType<typeof getUserInfo>;
```

이때 사용할 수 있는 제네릭 타입이 `ReturnType` 이다.

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

하지만 이러한 형태보다는 타입을 먼저 정의하고 선언하는 형태가 더 낫다.

## 제네릭 타입과 extends

- 제네릭 타입은 타입을 위한 함수와 같다.
- 함수에서 매개변수로 매핑할 수 있는 값을 제한하기 위해 타입 시스템을 사용하는 것처럼 제네릭 타입에서도 매개변수를 제한할 수 있는 방법이 필요하다.
- 제네릭 타입에서 매개변수를 제한하는 방법은 `extends` 를 사용하는 것이다.

```ts
interface Name {
  first: string;
  last: string;
}
type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  {first: 'Fred', last: 'Astaire'},
  {first: 'Ginger', last: 'Rogers'}
];  // OK
const couple2: DancingDuo<{first: string}> = [
                       // ~~~~~~~~~~~~~~~
                       // Property 'last' is missing in type
                       // '{ first: string; }' but required in type 'Name'
  {first: 'Sonny'},
  {first: 'Cher'}
];
```

제네릭 타입으로 정의된 타입은 반드시 매개변수를 작성하게 되어 있다. 그렇지 않으면 타입 추론이 정상적으로 되지 않아 오류가 발생하기 떄문이다.

앞에서 본 Pick로 extends 를 사용한 것을 알 수 있다.
```ts
type Pick<T, K> = { [P in K]: T[P]; } // ❌ K 는 T와 무관하다.
type Pick<T, K extends keyof T> = { [P in K]: T[P]; } // 🟢 K는 T의 키의 부분집합이다.
```


## 요약
`Don't Repeat yourself` 는 타입 시스템에서도 유효하다.

```ts
// 이름 붙이기
type Point2D = {
  x: number, y: number
}

// extends
interface PersonWithBirthDate extends Person {
  birth: Date;
}

// Pick
type TopNavState = Pick<State, "userId" | "pageTitle" | "recentFiles">

// Partial
type OptionsUpdate = Partial<Options>

// keyof
type OptionsKeys = keyof Options;

// typeof
type Options = typeof INIT_OPTIONS

// ReturnType
type UserInfo = ReturnType<typeof getUserInfo>;
```


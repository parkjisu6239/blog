# Item 23. 한꺼번에 객체 생성하기

- 타입스크립트에서는 값은 변경될 수 있지만 타입은 변경될 수 없다.
- 한번 추론된 타입은 변하지 않으므로, 객체를 한번에 생성해야한다.

## 객체 속성 추가하기
타입스크립트에서는 객체를 생성한 후 속성을 추가하는 것이 불가능하다. 최초로 객체를 선언한 시점에서 그 객체의 타입이 추론되어 바뀌지 않기 때문이다. 아래 예시에서 pt 의 타입은 `{}` 이다.
```ts
const pt = {};
pt.x = 3;
// ~ Property 'x' does not exist on type '{}'
pt.y = 4;
// ~ Property 'y' does not exist on type '{}'
```

따라서 아래와 같이 객체를 한꺼번에 만들어야 한다.
```ts
interface Point { x: number; y: number; }
const pt = {
  x: 3,
  y: 4,
};  // OK
```

## 객체 조합하기
둘 이상의 객체를 합치기 위해서는 `전개 연산자` 를 사용할 수 있다.

```ts
interface Point { x: number; y: number; }
const pt = {x: 3, y: 4};
const id = {name: 'Pythagoras'};
const namedPoint = {...pt, ...id}; // spread
namedPoint.name;  // OK, type is string
```

전개 연산자로 객체를 생성하면, 생성된 객체는 `한꺼번에 만들어진 것` 이다. 속성을 추가한 것이 아니라, 생성한 것이므로 당연하게도 합쳐진 내용으로 타입이 잘 추론된다.

## 조건부 속성 추가
타입에 안전한 방식으로 조건부 속성을 추가하려면, 삼항연산자와 `null`(또는 `{}`)를 사용할 수 있다.
```ts
declare let hasMiddle: boolean;
const firstLast = {first: 'Harry', last: 'Truman'};
const president = {...firstLast, ...(hasMiddle ? {middle: 'S'} : {})};
```

`president` 의 타입을 확인하면 middle을 옵셔널로 가지는 것을 확인할 수 있다.
```ts
const president: {
    middle?: string;
    first: string;
    last: string;
}
```

## 요약
- 속성을 제각각 추가하지 말고 한꺼번에 객체로 만들어야한다.
- 안전한 타입으로 속성을 추가하려면 객체 전개를 사용하면 된다.
- 객체에 조건부로 속성을 추가하여 옵셔널 속성을 갖게 할 수 있다.
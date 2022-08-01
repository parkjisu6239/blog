# Item 9. 타입 단언보다는 타입 선언을 사용하기

타입 스크립트에서 변수에 값을 할당하고 타입을 부여하는 방법은 두가지다.

## 타입 단언와 타입 선언
```ts
interface Person { name: string };

const alice: Person = { name: 'Alice' };  // 🟢 타입 선언 : Type is Person 
const bob = { name: 'Bob' } as Person;  // ❌ 타입 단언 : Type is Person
```

- 타입 선언은 그 값이 선언된 타입임을 명시한다.
- 타입 단언은 타입 스크립트가 추론한 타입이 있더라도 직접 명시한 타입으로 간주한다.


## 타입 체커
타입 단언과 선언이 어떻게 다른지는 아래 코드로 알 수 있다.

```ts
interface Person { name: string };
const alice: Person = {};
   // ~~~~~ Property 'name' is missing in type '{}'
   //       but required in type 'Person'
const bob = {} as Person;  // No error
```

- 타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사한다.
- 타입 단언은 강제로 타입을 지정했기때문에 타입 체커의 경고를 무시한다.

## 속성 추가
```ts
interface Person { name: string };
const alice: Person = {
  name: 'Alice',
  occupation: 'TypeScript developer'
// ~~~~~~~~~ Object literal may only specify known properties
//           and 'occupation' does not exist in type 'Person'
};
const bob = {
  name: 'Bob',
  occupation: 'JavaScript developer'
} as Person;  // No error
```

- 티입 선언문에서는 잉여속성체크가 동작했다.
- 단언문에서는 에러가 없다.

> `const bob = <Person>{}` 도 타입 단언으로, `const bob = {} as Person` 과 동일하다.

## 화살표 함수
화살표 함수의 타입 선언은 추론된 타입이 모호할 때가 있다.

```ts
interface Person { name: string };
const people = ['alice', 'bob', 'jan'].map(name => ({name}));
// { name: string; }[]... but we want Person[]
```

people이 Person 타입으로 인식되게 하려면 아래처럼 수정해야 합니다.

```ts
// ❌ 타입 단언
const people = ['alice', 'bob', 'jan'].map(name => ({name} as Person));

// 🟢 타입 선언
const people = ['alice', 'bob', 'jan'].map(name => {
  const person: Person = {name};
  return person
}); // Type is Person[]

// 🟢 타입 선언2: arrow func 의 return 타입을 명시
const people: Person[] = ['alice', 'bob', 'jan'].map(
  (name): Person => ({name})
);
```

그러나 함수 호출 체이닝이 연속되는 곳에서는 체이닝 시작에서부터 명명된 타입을 가져야 한다. 그래야 정확한 곳에서 오류가 표시된다.

## 타입 단언이 꼭 필요한 경우
DOM 엘리먼트에 대해서 조작할 때는 타입 체커보다 실제 DOM을 만든 개발자가 정확하다.

```ts
// tsConfig: {"strictNullChecks":false}

document.querySelector('#myButton').addEventListener('click', e => {
  // Object is possibly 'null'. 
  const button = e.currentTarget; // EventTarget | null
});
```

- 타입체커는 `document.querySelector('#myButton')` 가 존재하는지 모른다. null 일 수 도 있다고 말한다.
- 하지만 개발자가 저 버튼을 만들었다면, 반드시 null 이 아닐 것이다.

타입 단언을 사용하여 아래와 같이 수정할 수 있다.

```ts
// 🟢  타입 단언: (!) 사용 Not null
document.querySelector('#myButton')!.addEventListener('click', e => {
  const button = e.currentTarget as HTMLButtonElement; // as 사용
  button // Type is HTMLButtonElement
});
```

- 변수 뒤에 `!` 를 사용하여 null이 아님을 단언할 수 있다.
- as 를 사용하여 타입 단언을 할 수 있다.

> 단! 타입단언문은 타입스크립트의 문법으로, 런타임에서는 모두 제거된다. 따라서 런타임에서 null이 될 수 있고 이는 오류가 될 수 있으므로 타입 단언은 신중히 사용해야 한다. `!`는 null이 아니라고 확신할 수 있을 떄 사용해야 한다.

null 일 가능성이 있다면, 아래처럼 조건분기 하는것이 런타임 에러를 방지할 수 있는 방법이다.
```ts
const buttonEl = document.querySelector('#myButton')

if (buttonEl === null) {
  console.log('there is no button!')
} else {
  buttonEl.addEventListener('click', e => {
    const button = e.currentTarget as HTMLButtonElement; // as 사용
    button // Type is HTMLButtonElement
  });
}
```

## 타입 단언문으로 임의의 타입간에 변환을 할 수는 없다.

A가 B의 부분집합인 경우 타입 단언문을 사용해 변환할 수 있다. HTMLElement는 `HTMLElement | null` 의 서브타입이기때문에 타입 단언이 동작한다. 그리고 Person은 {}의 서브타입이므로 동작한다.

```ts
interface Person { name: string; }
const body = document.body;
const el = body as Person;
        // ~~~~~~~~~~~~~~ Conversion of type 'HTMLElement' to type 'Person'
        //                may be a mistake because neither type sufficiently
        //                overlaps with the other. If this was intentional,
        //                convert the expression to 'unknown' first
```

위와 같이 서로 포함관계에 없는 타입에서는 타입 단언이 되지 않는다. 이 오류를 해결하려면 `unknown` 을 사용해야한다. 모든 타입은 `unknown`의 서브타입이기 때문에 `unknown` 으로 타입 단언을 할 수 있다.

단, `unknown` 단언은 임의의 타입간의 변환이 가능하지만, 위험한 동작이다. 사용할 경우 조건문을 통해 반드시 타입은 분기해야 한다.

## 요약
- 타입 단언(`as Type`) 보다 타입 선언(`:Type`) 을 사용해야 한다.
- 화살표 함수의 반환타입을 명시하는 방법을 알아야 한다.
- 타입스크립트보다 타입 정보를 더 잘알고 있는 상황이라면 타입 단언문과 `!` 를 사용하면 된다. 하지만 여전히 주의는 필요하다.
# Item 22. 타입 좁히기

- 타입스크립트의 타입추론보다 좁은 타입을 지정하려는 경우 타입 좁히기를 할 수 있다.

## 타입을 좁히는 방법
### null 체크

타입을 좁히는 대표적인 방법은 nullable 인 값에 대해 조건문등으로 not null 로 좁히는 것이다.

```ts
const el = document.getElementById('foo'); // Type is HTMLElement | null
if (el) {
  el // Type is HTMLElement
  el.innerHTML = 'Party Time'.blink();
} else {
  el // Type is null
  alert('No element #foo');
}
```

타입체커는 일반적으로 이러한 조건문에서 타입 좁히기를 잘 해내지만, 타입 별칭이 존재한다면 그러지 못할 수도 있다. 자세한 내용은 24에서 다룬다.

```ts
const el = document.getElementById('foo'); // Type is HTMLElement | null
if (!el) throw new Error('Unable to find #foo');
el; // Now type is HTMLElement
el.innerHTML = 'Party Time'.blink();
```

else 문으로 빠지지 않아도 분기문에서 에러를 던지면 블록 아랫쪽에서 타입을 좁힐 수 있다.

### instanceof

클래스의 인스턴스인 경우 사용할 수 있다. instanceof 뒤에는 타입이 아니라 값이 와야 한다.
```ts
function contains(text: string, search: string|RegExp) {
  if (search instanceof RegExp) {
    search  // Type is RegExp
    return !!search.exec(text);
  }
  search  // Type is string
  return text.includes(search);
}
```

### 속성 체크
객체에 특정 속성이 있는 것을 확인하여 타입을 좁힐 수 있다.
```ts
interface A { a: number }
interface B { b: number }
function pickAB(ab: A | B) {
  if ('a' in ab) {
    ab // Type is A
  } else {
    ab // Type is B
  }
  ab // Type is A | B
}
```

### js 기본 매서드
문자열 또는 문자열 리스트를 파라미터로 받는 함수에서 배열의 기본 매서드인 `isArray` 로 타입을 좁힐 수도 있다. `isNumber` , `is~` 매서드나 함수를 사용하는 경우도 해당된다.
```ts
function contains(text: string, terms: string|string[]) {
  const termList = Array.isArray(terms) ? terms : [terms];
  termList // Type is string[]
  // ...
}
```

### 명시적 태그 붙이기
타입을 좁히는 일반적인 방법이다. `type` 이라는 값을 태그로 사용하여, 조건문 안에서 분기하면 타입을 좁힐 수 있다.
```ts
interface UploadEvent { type: 'upload'; filename: string; contents: string }
interface DownloadEvent { type: 'download'; filename: string; }
type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e  // Type is DownloadEvent
      break;
    case 'upload':
      e;  // Type is UploadEvent
      break;
  }
}
```

이 패턴은 `태그된 유니온` 또는 `구별된 유니온` 이라고 불리며, 타입스크립트 어디에서나 찾아볼 수 있다.

### 커스텀 함수
만약 타입스크립트가 타입을 식별하지 못한다면, 식별을 돕기 위해 커스텀 함수를 도입할 수 있다.

이러한 기법을 `사용자 정의 타입 가드` 라고 한다. 반환 타입의 `el is HTMLInputElement` 는 함수의 반환 타입이 true 인 경우, 타입 체커에게 매개변수의 타입을 좁힐 수 있다고 알려준다.

```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // Type is HTMLInputElement
    return el.value;
  }
  el; // Type is HTMLElement
  return el.textContent;
}
```

이런 함수들은 타입 가드를 사용하여 배열과 객체의 타입 좁히기를 할 수 있다. 예를 들어 배열에서 어떤 탐색을 수행할 때 undefined가 될 수 있는 타입을 사용할 수 있다.

```ts
// Not Working
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
);  // Type is (string | undefined)[]

// Still Not Working
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filter(who => who !== undefined);  // Type is (string | undefined)[]

// Working !
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filter(isDefined);  // Type is string[]
```

> 예시에서는 두번째 방법이 `(string | undefined)[]` 로 추론된다고 나와있지만, 최신 ts 에서는 추론이 잘 된다. string[] 으로 좁혀진다. 하지만 이런 방법도 있다는 것을 알아두면 좋다.

## 타입 좁히기에서 자주하는 실수

### null 제외?
가장 흔히 하는 실수로, null을 제외하기 위해 typeof 를 사용하는 것이다. 요상한 자바스크립트의 타입시스템으로 null의 타입은 `object` 이다. 따라서 아래 예시로는 타입을 좁힐 수 없다.
```ts
const el = document.getElementById('foo'); // type is HTMLElement | null
if (typeof el === 'object') {
  el;  // Type is HTMLElement | null
}
```

## 잘못된 기본형
자바스크립트에서는 아래의 경우 암시적 형변환으로 false 가 되는 것들이다. (== 비교에서)
- number 타입인데 값이 `0` 인경우
- string 타입인데 값이 `""` 인 경우
- array 타입인데 값이 `[]` 인 경우

따라서 아래의 경우 x 가 좁혀지지 않는다.
```ts
function foo(x?: number|string|null) {
  if (!x) {
    x;  // Type is string | number
  }
}
```

## 요약
- 타입 좁히는 방법
  - 조건 분기
  - instanceof
  - 속성 체크
  - `isNumber` 등의 메서드
  - 명시적 태그 붙이기(태그된 유니온)
  - 커스텀 함수(타입 가드 함수)
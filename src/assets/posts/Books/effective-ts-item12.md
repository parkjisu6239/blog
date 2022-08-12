# Item 12. 함수 표현식에 타입 적용하기

자바스크립트에서는 함수를 정의하는 방법은 두가지다. 선언식과 표현식이 있다.

```ts
function rollDice1(sides: number): number { return 0; }  // 선언
const rollDice2 = function(sides: number): number { return 0; };  // 표현식
const rollDice3 = (sides: number): number => { return 0; };  // 표현식 + arrow 함수
```

타입스크립트에서는 `함수 표현식`을 사용하는 게 좋다. 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있다는 장점이 있기 떄문이다.

## 표현식이 더 좋은 이유

```ts
// 선언식
function add(a: number, b: number) { return a + b; }
function sub(a: number, b: number) { return a - b; }
function mul(a: number, b: number) { return a * b; }
function div(a: number, b: number) { return a / b; }

// 표현식
type BinaryFn = (a: number, b: number) => number;
const add: BinaryFn = (a, b) => a + b;
const sub: BinaryFn = (a, b) => a - b;
const mul: BinaryFn = (a, b) => a * b;
const div: BinaryFn = (a, b) => a / b;
```

표현식을 사용하면 반복되는 타입 지정을 피할 수 있다. 함수 자체의 타입을 지정해서 파라미터와 리턴값을 정의하지 않아도 된다.

## 표현식을 사용하는 라이브러리들

리액트에서는 html 요소에 대한 이벤트 헨들러 타입을 제공한다.

```ts
const onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
  console.log(e.target.value)
}

const onClick2: React.MouseEventHandler<HTMLDivElement> = (e) => {
  console.log(e.target.value)
}
```

이런 함수들은 props 로 넘길 때 타입을 지정해야하는데, 전자보다는 후자가 낫다. 라이브러리를 만든다면, 공통 콜백 함수를 위한 타입 선언을 제공하는게 좋다.

## 시그니처가 일치하는 함수
시그니처가 일치하는 다른 함수가 있을 떄도 함수 표현식에 타입을 적용해볼만 하다.

```ts
const responseP = fetch('/quote?by=Mark+Twain'); // Type is Promise<Response>
```

```ts
async function getQuote() {
  const response = await fetch('/quote?by=Mark+Twain');
  const quote = await response.json();
  return quote;
}
// {
//   "quote": "If you tell the truth, you don't have to remember anything.",
//   "source": "notebook",
//   "date": "1894"
// }
```

이 함수는 반환값은 json 형태로 생각할 수 있다. 하지만 요청에 오류가 발생한 경우 JSON 형식이 아니라 새로운 오류 메시지를 담아 rejected된 Promise 가 반환된다.

또한 위 함수는 fetch가 실패한 경우의 동작이 없다. 따라서 응답의 상태를 체크해줄 `checkFetch` 함수를 작성해보자.

```ts
declare function fetch(
  input: RequestInfo, init?: RequestInit
): Promise<Response>;

// 선언식
async function checkedFetch(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    // Converted to a rejected Promise in an async function
    throw new Error('Request failed: ' + response.status);
  }
  return response;
}

// 표현식
const checkedFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error('Request failed: ' + response.status);
  }
  return response;
}
```

표현식으로 함수를 작성하면 fetch 의 타입을 사용할 수 있다. 이렇게 하면 타입 체커가 파라미터의 값을 추론할 수 있게 되어 좀 더 간결하게 함수를 작성할 수 있다. 타입 구문은 checkedFetch의 반환 타입을 도장하며, fetch 와 동일하다.

```ts
const checkedFetch2: typeof fetch = async (input, init) => {
  //  ~~~~~~~~~~~~   Type 'Promise<Response | HTTPError>'
  //                     is not assignable to type 'Promise<Response>'
  //                   Type 'Response | HTTPError' is not assignable
  //                       to type 'Response'
  const response = await fetch(input, init);
  if (!response.ok) {
    return new Error('Request failed: ' + response.status);
  }
  return response;
}
```

만약 위처럼 throw 가 아니라 return을 쓰면 타입체커를 오류를 잘 잡아낸다.

함수의 매개변수에 타입 선언을 하는 것보다 함수 표현식 전체 타입을 정의하는 것이 코드를 간결하고 안전하게 한다.

## 요약
- 매개변수나, 반환값의 타입을 명시하기보다는 함수 표현식 전체에 타입 구문을 적용하는 것이 좋다.
- 같은 타입 시그니처를 반복적으로 작성한 코드가 있다면, 함수 타입을 분리하거나 이미 존재하는 타입을 찾아보자. 라이브러리를 제공한다면 공통 콜백에 타입을 제공해야한다.
- 다른 함수의 시그니처를 참조하려면 `typeof fn` 을 사용하면 된다.
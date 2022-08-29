# Item 16. number 인덱스 시그니처보다는 Array, 튜플, ArrayLike를 사용하기

## 자바스크립트는 이상하다.

```js
"0" == 0 // true
```

- 대표적인 이상한 예로는 암시적 형변환이 있다. 이건 `===` 으로 해결 가능하다.
- 자바스크립트 객체 모델에도 이상한 부분이 있다.
- 타입스크립트도 이를 모델링하기 때문에 특징을 살펴봐야 한다.

## 자바스크립트에서 객체
- 자바스크립트에서 객체는 문자열 키와, any 값으로 이루어져있다.
- 복잡한 형태의 키, 숫자 형태의 키는 문자열로 변환된다. Object.key()로 확인하면 string이다.
- 배열의 타입은 object이다. 따라서 배열의 키는 string이다. 따라서 인덱스를 number가 아닌 string으로 접근해도 동일하다.
```js
const obj = {
  1: "a",
}
obj[[1,2,3,4]] = "b"
obj // {1: 'a', 1,2,3: 4}
Object.keys(obj) // ['1', '1,2,3']


const arr = [1,2,3]
typeof arr // object
arr[0] // 1
arr["0"] // 1
Object.keys(arr) // ['0', '1', '2']
```

## 타입스크립트에서는
이러한 혼란을 바로잡기 위해 object에 숫자 키를 허용하고, 문자열과 다른 것으로 인식한다.
```ts
interface Array<T> {
  // ...
  [n: number]: T; // key는 반드시 숫자로 제한
}
```
하지만 런타임에서는 타입이 사라지기 때문에 여전히 문자열로 인덱스 접근이 가능하다.
그럼에도 타입체커가 동작하는 동안은 배열 접근은 number로만 한정할 수 있어 에러를 줄일 수 있다.

```ts
const keys = Object.keys(arr)
for (const key in arr) {
  console.log(typeof key) // string
  console.log(arr[key]) // 하지만 여기서는 number로 인덱스 접근 가능하며, 타입체커 통과
}
```
타입스크립트에서 배열 인덱스를 number만으로 제한한것과 상반되게, 위 예시에서 arr의 인덱스로 문자열이 들어가지만 정상동작한다.
이는 배열을 순회하는 코드 스타일에 대한 실용적인 허용이라고 생각하는 것이 좋다.

인덱스를 반드시 number로 확실히 하여 사용하고자 한다면, `forEach` 를 사용하는 것이 좋다.
참고로 for in, for of의 차이는 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of)에서 확인할 수 있다.

## 결론
- 인덱스 시그니처가 number로 표현되어 있다면 입력값이 number 이어야 한다는 것을 의미하지만, 실제 런타임의 키는 string이다.
- 객체의 인덱스 시그니처를 굳이 number로 할 이유는 없다. 의미상 배열을 사용하는게 낫다.
- 또한 push, concat등을 매서드가 전혀 필요없는데 배열로 만드는것도 의미상 좋지 않다. 그런경우라면 객체로 사용하는 것이 낫다.
- 어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 사용하고 싶다면 ts의 `ArrayLike`를 사용하면 된다. 하지만 이것 역시 key는 문자열이다.

```ts
interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}

const xs = [1, 2, 3];
function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
  if (i < xs.length) {
    return xs[i];
  }
  throw new Error(`Attempt to access ${i} which is past end of array.`)
}

const tupleLike: ArrayLike<string> = {
  '0': 'A',
  '1': 'B',
  length: 2, // 원소와 length만 갖고 있으면 ArrayLike
};  // OK
```

## 요약
- 배열은 객체이므로 키는 숫자가 아니라 문자열이다. 인덱스 시그니처로 사용된 number 타입은 버그를 잡기 위한 순수 타입스크립트 코드다.
- 인덱스 시그니처에 number 를 사용하기보다 Array, tuple, ArrayLike 타입을 쓰는것이 낫다.
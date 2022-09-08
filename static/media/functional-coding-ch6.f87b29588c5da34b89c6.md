# [Functional Coding] Chap6. 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기

> 카피-온-라이트를 적용하여 불변성을 유지할 수 있다.

자바스크립트에서 객체는 래퍼런스 자료형이다. 따라서 객체나 배열의 값을 바꾸면 원치않은 사이드 이펙트가 발생할 수 있다. 또한 함수의 파라미터등으로 사용하는 값에서 `쓰기` 동작을 수행하면 불변성이 깨질 수 있다. 이러한 문제를 해결하기 위해 카피-온-라이트를 적용해야 한다.

## 배열

배열의 다양한 동작 중에 원소를 추가하거나 제거하는 동작은 아래처럼 불변성을 유지할 수 있다.
```ts
// 맨 뒤에 추가
const addLastElement = <T> (arr: readonly T[], element: T): T[] => {
  const copy = arr.slice()
  copy.push(element)
  return copy
}

// 삭제
const removeItems = <T> (cart: readonly T[], idx: number, cnt: number): T[] => {
  const copy = cart.slice()
  copy.splice(idx, cnt)
  return copy
}

// 이름으로 삭제
const removeItemByName = <T extends {name: string}> (cart: readonly T[], name: string): T[] => {
  const copy = cart.slice()
  const idx = copy.findIndex((copy) => copy.name === name)
  if (idx !== null) {
    return removeItems(copy, idx, 1)
  }
  return copy
}
```

pop, shift 매서드는 원본 배열를 수정하는 동시에 리턴값도 있다. 이러한 경우 값을 리턴하는 `읽기` 동작과 배열을 수정하는 `쓰기` 동작을 나누어 사용할 수 있다. 아래는 배열의 매서드중 `pop` 의 동작을 카피-온-라이트를 적용한 결과이다.

```ts
const getLastItem = <T> (array: readonly T[]): T => { // 읽기
  return array[-1]
}

const dropLast = <T> (array: readonly T[]): T[] => { // 쓰기
  const copy = array.slice()
  copy.pop()
  return copy
}

const pop = <T> (array: readonly T[]): {last: T, array: T[]} => { // 읽기 쓰기
  const copy = array.slice()
  return {
    last: getLastItem(array),
    array: dropLast(copy)
  }
}
```

이렇게 하면 읽기와 쓰기 동작을 분리하여, 원본 배열의 조작 없이 원하는 함수를 골라서 사용할 수 있고 한번에 결과를 얻고 싶을 떄는 `pop` 이라는 함수를 사용하면 된다. 

**위 예시들은 ts 를 적용한 것으로 ts 의 readonly 를 사용하면 파라미터의 변경을 확실하게 제한할 수 있어서 유용하다.**

> 카피-온-라이트는 복제본을 만드는 동작이 필요하다. 자칫 메모리에 무리가 가고 느리다고 생각될 수 있지만, 언어별 가비지컬렉트는 아주 잘 동작하며 최적화가 잘 된다. 자바스크립트의 가비지컬렉터의 동작은 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Memory_Management) 에서 볼 수 있다.

## 불변 데이터

### 불변 데이터 구조를 읽는 것은 계산이다.
- 변경 가능한 데이터를 읽는 것은 액션이다.
- `쓰기`는 데이터를 변경가능한 구조로 만든다.
- 어떤 데이터에 쓰기가 없다면 데이터는 변경불가능한 데이터이다.
- 불변 데이터 구조를 읽는 것은 계산이다.
- 쓰기를 읽기로 바꾸면 코드에 계산이 많아진다.

### 불변 데이터 구조는 충분히 빠르다.
- 언제든 최적화할 수 있다.
- 가비지 콜렉터는 매우 빠르다.
- 생각보다 많이 복사하지 않는다.
- 함수형 프로그래밍 언어는 빠른 구현체가 있다.


## 객체
객체에서도 배열과 마찬가지로 카피-온-라이트를 적용하여 불변성을 유지할 수 있다. 배열에서 복사를 위해 사용한 매서든 `slice` 대신 객체에서는 `assign` 을 사용할 수 있다. 배열, 객체에서 동일하게 사용할 수 있는 방법은 스프레드 `{...arry}` 를 사용하는 방법도 있다.

## 중첩된 쓰기
배열 안의 배열, 객체 안의 객체가 있는 경우도 불변성을 유지해야 한다. 그런데 위에서 사용한 배열, 객체의 매서드 `slice`, `assign` 은 얕은 복사로 객체안의 객체까지는 복사본이 만들어지지 않는다. 대신 래퍼런스 자료형이기 때문에 같은 주소를 가르키게 된다.

배열이 불변성을 유지하려면 최하위부터 최상위까지 중첩된 데이터 구조의 모든 부분이 불변형이여야 한다. 중첩된 데이터의 일부를 바꾸려면 변경하려는 값과 상위의 모든 값을 복사해야한다. 그래서 중첩된 객체나 배열을 수정할 때는 새로운 래퍼런스 자료형 객체를 만들어 재할당 해줄 필요가 있다.

```ts
const setPrice = <T extends {price: number}> (itme: T, price: number): T => {
  const copy = Object.assign({}, itme) // 이떄 copy 는 완전히 새로운 객체
  copy.price = price
  return copy // 새로운 객체를 리턴한다.
}

const setPriceByName = <T extends {name: string, price: number}> 
 (cart: readonly T[], name: string, price: number): T[] => {
  const copy_cart = cart.slice()
  const idx = copy_cart.findIndex((copy) => copy.name === name)
  copy_cart[idx] = setPrice(copy_cart[idx], price) // cart 와 같은 곳을 가리키고 있다가, 새로운 객체를 가리키게 된다.
  return copy_cart
}
```

위 함수를 아래처럼 사용할 수 있다.

```ts
const cart = [
  {name: "socks", price: 1},
  {name: "shirt", price: 4},
  {name: "pants", price: 5},
]

const newCart = setPriceByName(cart, "socks", 2)
```

- 인자로 들어간 cart와 리턴값인 copy_cart는 구조적으로는 동일하다. 이것이 구조적 공유이다. 
- newCart 를 만들어냈음에도 cart의 불변성은 유지되었다.
- newCart의 첫번째 인자({name: "socks", price: 1})는 cart의 첫번째 인자와 다르다. 다른 주소를 가리키고 있다.
- newCart 와 cart의 두번째, 세번째 인자는 서로 같은 값을 공유하고 있다. 같은 주소를 가르키고 있다.

## 요약
- 함수형 프로그래밍에서는 불변데이터가 필요하며, 계산에서는 변경 가능한 데이터에 쓰기를 할 수 없다.
- 카피-온-라이트는 데이터를 불변형으로 유지할 수 있는 원칙이다. 복사본을 만들고 원본 대신 복사본을 변경하는 것이다.
- 카피-온-라이트는 값을 변경하기전에 얕은 복사를 하고 이를 수정하여 리턴한다. 이렇게 하면 통제할 수 있는 범위에서 불변성을 구현할 수 있다.
- 보일러 플레이트 코드(bolierplate code) 를 줄이기 위해 기본적인 배열과 객체 동작에 대한 카피-온-라이트 버전을 만들어두는 것이 좋다.

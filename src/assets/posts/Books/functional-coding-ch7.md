# [Functional Coding] Chap7. 신뢰할수 없는 코드를 쓰면서 불변성 지키기

- 카피온라이트를 적용할 수 없는 코드에서 불변데이터를 다루기 위해 방어적 복사를 사용할 수 있다.

## 레거시 코드
모든 코드를 바꿀 수 없는 경우, 레거시 코드를 사용해야 하는 경우가 있다. 새로 작성한 코드는 불변성을 유지하기 위해 카피온라이트를 적용했더라도, 레거시에서 그렇지 않고 값이 바꿔버린다면 다른 방법이 필요하다.

## 안전지대
새로만들어진 코드(카피-온-라이트를 적용하여 불변성이 유지되는 코드)는 `안전지대`이다. 이 곳의 함수와 메서드에는 모두 `카피 온 라이트`가 잘 적용되어 있기때문에, 데이터가 변하지 않는다는 보장을 할 수 있다.

## 방어적 복사
하지만 레거시 코드나, 라이브러리 등은 그렇지 않다. 안전지대 밖의 코드와, 안전지대의 안과 밖을 넘나드는 데이터는 변경될 수 있다. 그렇기 때문에 안전지대를 오가는 데이터가 바뀌는 것을 완벽히 막아주는 원칙이 필요하다. 이 원칙을 `방어적 복사` 라고 한다.

`방어적 복사` 는 안전지대 안에서 밖으로 데이터가 나가거나 들어올때 복사본을 만든다. 이때 복사본은 원본과 그 무엇도 공유하지 않도록 deepCopy를 사용한다.

## 방어적 복사 구현하기
방어적 복사는 안전지대 안,밖으로 나가는 데이터에 깊은 복사를 함으로써 적용할 수 있다.
```js
// Before
function addItemToCart(name, price) {
  ...
  blackFridayPromotion(shoppingCart)
}

// After
function addItemToCart(name, price) {
  ...
  const cartCopy = deepCopy(shoppingCart) // 안전지대 안 -> 밖 : 넘기기전에 복사
  blackFridayPromotion(cartCopy)
  shoppingCart = deepCopy(shoppingCart) // 안전지대 밖 -> 안 : 돌아오는 데이터 복사
}
```

## 방어적 복사 규칙
### 규칙1. 데이터가 안전한 코드에서 나갈 때 복사하기
변경 불가능한 데이터가 신뢰할 수 없는 코드로 나갈때 깊은 복사로 데이터 의존성을 완전히 끊어준다.
1. 불변성 데이터를 위한 깊은 복사본을 만든다.
2. 신뢰할 수 없는 코드로 복사본을 전달한다.

### 규칙2. 안전한 코드로 데이터가 들어올 때 복사하기
신뢰할 수 없는 코드에서 변경될 수도 있는 데이터가 들어온다면 마찬가지로 깊은 복사를 사용한다.
1. 변경될 수도 있는 데이터가 들어오면 바로 깊은 복사본을 만들어 안전한 코드로 전달한다.
2. 복사본은 안전한 코드에서 사용한다.

## 신뢰할 수 없는 코드 감싸기
레거시 코드를 재사용 할 수도 있고, 방어적 복사를 하는 부분을 분리하고 싶은 경우 함수를 래핑할 수 있다. 함수를 래핑하면 데이터가 바뀌지 않는다는 것을 보장할 수 있고, 코드가 하는 일이 더 명확해진다.

```js
// Before
function addItemToCart(name, price) {
  ...
  const cartCopy = deepCopy(shoppingCart)
  blackFridayPromotion(cartCopy)
  shoppingCart = deepCopy(shoppingCart)
}

// After
function addItemToCart(name, price) {
  ...
  shoppingCart = blackFridayPromotionSafe(shoppingCart)
}

function blackFridayPromotionSafe(cart) {
  const cartCopy = deepCopy(shoppingCart)
  blackFridayPromotion(cartCopy)
  return deepCopy(shoppingCart)
}
```

## 방어적 복사 예시
방어적 복사는 오래전부터 다른 곳에서 쓰던 일반적인 패턴이다.

### 웹 API 속에 방어적 복사
대부분의 웹 기반 API는 암묵적으로 방어적 복사를 한다. 클라이언트가 서버로 js 객체를 JSON으로 보낸다. 이것은 깊은 복사이다. 서버에서 JSON을 받을 후에 데이터 처리를 위해 직렬화하는데, 이것 역시 깊은 복사이다. 서버에서 들어오고 나갈때 방어적 복사를 한것이다.

## 방어적 복사 vs 카피온라이트
거의 비슷한 개념이지만, 방어적 복사는 `깊은 복사` 이고 카피-온-라이트는 `얕은 복사`이다. 둘중 무엇을 적용해도 결과가 동일할 때는 보다 효율적인 관리를 위해 카피-온-라이트를 사용하는 것이 비용측면에서 저렴하다.

하지만 안전지대를 오가는 데이터는 방어적 복사(깊은 복사)를 해야한다.

|차이점|카피-온-라이트|방어적 복사|
|---|---|---|
|When| 통제할 수 있는 데이터를 바꿀 때| 신뢰할 수 없는 코드와 데이터를 주고받을 때|
|Where|안전지대, 카피온라이트가 불변성을 가진 안전지대를 만든다|안전지대의 경계|
|How| 앝은 복사(상대적으로 적은 비용)|깊은 복사(상대적으로 많은 비용)|
|Principle|바꿀 데이터의 얕은 복사본을 만들어, 값을 복사한 후 리턴한다|안전지대를 지날때 깊은 복사본을 만든다.|

## 깊은 복사 vs 얕은 복사
깊은 복사는 원본과 어떤 데이터 구조도 공유하지 않는 것이 얕은 복사와의 차이점이다. 중첩된 모든 객체나 배열을 복사한다. 반면 얕은 복사는 바뀌지 않은 값이라면 원본과 복사본이 데이터를 공유한다. (래퍼런스형 자료 구조에서 같은 위치를 가리킨다.)

## 자바스크립트에서의 깊은 복사
깊은 복사는 만들기 쉬워보이지만, 자바스크립트 표준 라이브러리는 썩 좋지 않아서 직접 구현보다는 Lodash의 `.cloneDeep()` 을 사용하는 것이 좋다. 직접 구현하기 위해서 재귀를 사용할 수 있다.

## 결론 및 요점 정리
- 방어적 복사는 불변성을 구현하는 원칙으로, 데이터가 안전지대를 오갈때 깊은 복사를 한다.
- 깊은 복사는 원본과 어떤한 데이터 구조도 공유하지 않는 완전히 독립적인 데이터이기 떄문에, 얕은 복사보다 비싸다.
  - 깊은 복사는 중첩된 모든 데이터를 복사한다.
  - 얕은 복사는 필요한 부분만 최소로 복사하며, 바뀌지 않은 부분은 원본과 공유된다.
- 카피온라이트는 안전지대에서, 방어적 복사는 안전지대가 아닌 곳에서 사용할 수 있다.
  - 대부분의 경우 카피온라이트를 더 많이 사용한다.
  - 방어적 복사는 신뢰할 수 없는 코드와 함께 사용할 때만 사용한다.

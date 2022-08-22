# [Functional Coding] Chap5. 더 좋은 액션 만들기
> 목표
> - 암묵적 입력과 출력을 제거해서 재사용하기 좋은 코드를 만들자
> - 복잡하게 엉킨 코드를 풀어 더 좋은 구조로 만들자

액션을 계산으로 만드는 것이 좋다. 하지만 모든 액션을 없앨수는 없다. **액션은 필요하기 때문이다.**

## 비즈니스 요구 사항과 설계를 맞추자

### 요구사항에 맞춰 더 나은 추상화 단계 선택하기

액션 -> 계산으로의 리팩터링 과정은 단순하고 기계적이다. 하지만 기계적인 리팩터링이 항상 최선의 구조는 만들어주는 것은 아니다. 좋은 구조를 위해서는 어느정도 사람의 손길이 필요하다.

```ts
const getsFreeShipping = (total: number, price: number): boolean => {
  return price + total >= 20
}
```

4장에서 본 예제 중에서 `getsFreeShipping` 함수는 비즈니스 요구사항으로 봤을 때 맞지 않는 부분이 있다.

> 요구사항 : **장바구니**에 담긴 제품을 주문할 때 무료배송인지 확인하는 것

함수를 보면 장바구니로 무료배송을 확인하지 않고 **제품의 합계와 가격**으로 확인하고 있다.

> 함수 인자 : 제품 합계, 제품 가격

```ts
const calcTotal = (cart: Item[]): number => {
  let total = 0
  total = cart.reduce((acc, item) => {
		acc += item.price // 👈 중복되는 부분
    return acc
	}, 0)
  return total
}
```

또 중복된 코드도 있다. 합계에 제품 가격을 더하는 코드가 `calcTotal` 에도 있다. 중복이 항상 나쁜 건 아니지만 이는 `코드스멜`을 야기한다.


## 비즈니스 요구 사항과 함수를 맞추기
### 함수의 동작을 바꿨기 때문에 엄밀히 말하면 리팩터링이라고 할 수 없다.

`getsFreeShipping` 함수를 장바구니 값을 인자로 받아, 합계가 20보다 큰지 알려주도록 바꾼다.

```ts
// Before
const getsFreeShipping = (total: number, price: number): boolean => {
  return price + total >= 20
}

// After
const getsFreeShipping = (cart: Item[]): boolean => {
  return calcTotal(cart) >= 20
}
```

바꾼 함수는 **합계와 제품 가격** 대신 `장바구니` 데이터를 사용한다. 

> 장바구니는 전자 상거래에서 많이 사용하는 엔티티 타입이기 때문에 비즈니스 요구사항과 잘 맞는다.

함수 시그니처가 바뀌었으니, 함수를 호출하는 부분에서도 아래처럼 수정할 수 있다.

```ts
// Before
const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtnsDom()
  buyBtns.forEach(btn => {
    const item = btn.item
    if (getsFreeShipping(shoppingCartTotal, item.price)) { // ➖
      btn.showFreeShippingIcon()
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}

// After
const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtnsDom()
  buyBtns.forEach(btn => {
    const item = btn.item
    const newCart = addItem(shoppingCart, item.name, item.price) // ➕ 새 장바구니*
    if (getsFreeShipping(newCart)) { // 👈 고친 함수 호출
      btn.showFreeShippingIcon()
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}
```

`getsFreeShipping` 함수가 잘 동작하도록 고쳐졌고, 이제 이 함수는 장바구니가 무료 배송인지 아닌지 알려준다.

<details>
<summary>생각해보기</summary>
<p>

```ts
const newCart = addItem(shoppingCart, item.name, item.price)
```

위 코드에서 기존 장바구니를 직접 변경하지 않고 복사본을 만들었다. 이러한 스타일을 함수형 프로그래밍에서 많이 사용한다. 이 방법은 ?

<details>
<summary>이 방법은 ?</summary>
<p>

카피 온 라이트(Copy-On-Write)

</p>
</details>

</p>
</details>



## 💡 원칙 : 암묵적 입력과 출력은 적을수록 좋다

**인자가 아닌 모든 입력은 암묵적 입력이고, 리턴값이 아닌 모든 출력은 암묵적 출력이다.** 계산은 암묵적 입출력이 없는 함수다. 액션에서도 암묵적 입출력을 줄일수록 좋다.

어떤 함수에 암묵적 입출력이 있다면, 다른 컴포넌트와 강하게 연결된 컴포넌트라고 할 수 있다. 다른 곳에서는 사용할 수 없기 때문에 모듈이 아니다. 이런 함수의 동작은 연결된 부분의 동작에 의존한다. 암묵적 입출력을 명시적으로 바꿔 모듈화된 컴포넌트로 만들 수 있다.

- 암묵적 입력이 있는 함수는 조심해야 한다.
  - 앞에서 세금 계산할 때 `shoppingCartTotal` 전역변수를 변경했다. 다른곳에서 같은 값을 참조한다면 값이 바뀔 것이다.
- 암묵적 출력이 있는 함수 역시 조심해서 사용해야 한다. 
  - 만약 DOM을 바꾸는 암묵적 출력이 있는 함수를 쓸 때 DOM을 바꿀 필요가 없거나, 결과는 필요하지만 다른 곳에 영향을 주기 싫다면 ?
- 암묵적 입출력이 있는 함수는 테스트하기 어렵다.

## 암묵적 입출력 줄이기

무료 배송 아이콘을 표시하는 액션인 `updateShippingIcons` 에서 암묵적 입력인 `shoppingCartTotal` 를 명시적 입력으로 바꿔보자.

```ts
// Before
const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtns()
  buyBtns.forEach(btn => {
    const item = btn.item
    const newCart = addItem(shoppingCart, item.name, item.price) // 👈 암묵적 입력 shoppingCart(전역 변수)
    if (getsFreeShipping(newCart)) {
      btn.showFreeShippingIcon()
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}

// After
const updateShippingIcons = (cart) => { // 명시적 입력
  const buyBtns: HTMLButtonElement[] = getBuyBtns()
  buyBtns.forEach(btn => {
    const item = btn.item
    const newCart = addItem(cart, item.name, item.price) // 👈 cart(파라미터)
    if (getsFreeShipping(newCart)) {
      btn.showFreeShippingIcon()
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}
```

사용하는 곳에서도 변경한다.

```ts
// Before
const calcCartTotal = () => {
  shoppingCartTotal = calcTotal(shoppingCart);
  setCartTotalDom()
  updateShippingIcons() // 👈 인자 없음
	updateTexDom()
}

// After
const calcCartTotal = () => {
  shoppingCartTotal = calcTotal(shoppingCart);
  setCartTotalDom()
  updateShippingIcons(shoppingCartTotal) // 👈 인자로 전달
	updateTexDom()
}
```

## 코드 다시 살펴보기

아래 함수는 모두 액션이다.

```ts
// Before
const addItemToCart = (name: string, price: number) => { // onClick 구매 버튼
	shoppingCart = addItem(shoppingCart, name, price)
	calcCartTotal(shoppingCart);
}

const calcCartTotal = (cart) => { // ❗️ addItemToCart 안에 있어도 될 것 같다.
  const total = calcTotal(cart);
  setCartTotalDom(total)
  updateShippingIcons(cart)
	updateTexDom(total)
  shoppingCartTotal = total // ❗️ 전역 변수에 값을 할당했지만, 읽는 곳이 없어 불필요한 코드
}

const setCartTotalDom = (total: number) => {
  ...
}

const updateShippingIcons = (cart) => {
  const buyBtns: HTMLButtonElement[] = getBuyBtns()
  buyBtns.forEach(btn => {
    const item = btn.item
    const newCart = addItem(cart, item.name, item.price)
    if (getIsFreeShipping(newCart)) {
      btn.showFreeShippingIcon()
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}

const updateTexDom = (total) => {
  setTaxDom(calcTax(total));
}
```

정리할 코드가 두 개 있다. 사용하지 않는 `shoppingCartTotal` 전역 변수와, 과해 보이는 `calcCartTotal` 함수이다.

```ts
// After
const addItemToCart = (name: string, price: number) => {
	shoppingCart = addItem(shoppingCart, name, price)
  const total = calcTotal(shoppingCart); // 합치기
  setCartTotalDom(total)
  updateShippingIcons(shoppingCart)
	updateTexDom(total)
  // shoppingCartTotal = total (삭제)
}
```

`addItemToCart` 와 `calcCartTotal` 를 합치고, 사용하지 않는 전역변수인 `shoppingCartTotal` 를 업데이트 하는 코드를 제거했다.


## 계산 분류하기

### 의미 있는 계층에 대해 알아보기 위해 계산을 분류하자

계산 함수도 의미있는 `계층`으로 나눌 수 있다. 
- 장바구니 구조를 알아야 하는 함수 (C)
- 제품에 대한 구조를 알아야 하는 함수 (I)
- 비즈니스 규칙에 대한 함수 (B) : 메가마트에서 사용하는 로직

```ts
const addItem = (cart: Item[], name: string, price: number): Item[] => { // C, I
  const newCart = cart.slice()
  newCart.push({ // 👈 item이 name, price로 이루어진다는 것을 알아야 함
		name,
		price
	}) // 👈 cart가 item으로 이루어진 배열이라는 것을 알아야 함
  return newCart;
}

const calcTotal = (cart: Item[]): number => { // C, I, B
  return cart.reduce((acc, item) => {
		acc += item.price
    return acc
	}, 0) 
}

const getsFreeShipping = (cart: Item[]): boolean => { // B
  return calcTotal(cart) >= 20
}

const calcTax = (amount: number): number => { // B
  return amount * 0.1
}
```

시간이 지날수록 앞에서 나눈 그룹은 더 명확해질 것이다. 이렇게 나눈 것은 코드에서 의미있는 계층이 되기 때문에 기억해두면 좋다. 계층에 대한 자세한 내용은 8, 9장에서 다룰 예정이다. 계층은 엉켜있는 코드를 풀면 자연스럽게 만들어진다.

## 💡 원칙 : 설계는 엉켜있는 코드를 푸는 것이다.

함수를 사용하면 자연스럽게 `관심사 분리`를 할 수 있다. 함수는 인자로 넘기는 값과 그 값을 사용하는 방법을 분리한다.

### 설계, 분리의 장점
- 재사용하기 쉽다.
- 유지보수하기 쉽다.
- 테스트하기 쉽다.

## addItem()을 분리해 더 좋은 설계 만들기

addItem은 4부분으로 나눌 수 있다,

```ts
// Before
const addItem = (cart: Item[], name: string, price: number): Item[] => {
  const newCart = cart.slice() // 1. 배열 복사
  const newItem = { // 2. item 객체 생성
    name,
		price
  }
  newCart.push(newItem) // 3. 복사본에 item 추가
  return newCart; // 4. 복사본 리턴
}
```

addItem 함수는 cart, item의 구조를 모두 알고 있다. item 에 관한 코드를 별도의 함수로 분리해보자.

```ts
// After
const makeCartItem = (name: string, price: number): Item => { // I: 생성자 함수
  return { // 2. item 객체 생성
    name,
		price
  }
}

const addItem = (cart: Item[], item: Item): Item[] => { // C
  const newCart = cart.slice() // 1. 배열 복사
  newCart.push(item) // 3. 복사본에 item 추가
  return newCart; // 4. 복사본 리턴
}


addItem(shoppingCart, makeCartItem("shoes", 3.45)) // 호출하는 부분
```

`item` 구조만 알고 있는 함수(`makeCartItem`) 와 `cart` 구조만 알고 있는 함수(`addItem`) 으로 나눠 원래 코드를 고쳤다. addItem 는 item을 인자로 받지만, 그 구조가 어떻게 생겼는지는 상관없이 바로 makeCartItem 로 넘겨버리기 때문에, cart 구조만 알면 된다.

이렇게 분리하면 cart와 item을 독립적으로 확장할 수 있다. 예를 들어 배열인 cart를 해시맵같은 자료 구조로 바꾼다고 할 때 변경할 부분이 적다.(`3. 복사본에 item 추가` 부분만 수정하면 된다.)

1, 3, 4번은 카피-온-라이트를 구현한 부분이기 때문에 함께 두는 것이 좋다. 이 부분은 6장에서 설명한다.

## 카피-온-라이트 패턴을 빼내기
이제 addItem 함수는 크기가 작고 괜찮은 함수이다. 자세히 보면 카피-온-라이트를 사용해서 배열에 항목을 추가하는 함수로, **일반적인 배열**에도 모두 쓸 수 있다. 하지만 이름은 그렇지 않기 때문에, 이름을 변경하자.

```ts
// After
const addElementLast = <T>(array: T[], elem: T): T[] => {
  const newArray = array.slice()
  newArray.push(elem)
  return newArray
}

const addItem = (cart: Item[], item: Item): Item[] => {
  return addElementLast(cart, item)
}
```

장바구니와 제품에만 쓸 수 있는 함수가 아닌 어떤 배열이나 항목에도 쓸 수 있는 이름으로 바꿨다. 이 함수는 재사용할 수 있는 `utility 함수`이다.

## addItem() 사용하기
위에서 수정한 내용을 바탕으로, 함수를 호출하는 곳도 변경되어야 한다.

```ts
// Before
const addItemToCart = (name: string, price: number) => {
	shoppingCart = addItem(shoppingCart, name, price)
  const total = calcTotal(shoppingCart);
  ...
}

// After
const addItemToCart = (name: string, price: number) => {
  const item = makeCartItem(name, price)
	shoppingCart = addItem(shoppingCart, item)
  const total = calcTotal(shoppingCart);
  ...
}
```

## 계산을 분류하기

앞서 분류한 C, I, B에 A(배열 유틸리티) 를 더해 아래 계산을 분류할 수 있다.

```ts
const addElementLast = <T>(array: T[], elem: T): T[] => { // A
  const newArray = array.slice()
  newArray.push(elem)
  return newArray
}

const addItem = (cart: Item[], item: Item): Item[] => { // C
  return addElementLast(cart, item)
}

const makeCartItem = (name: string, price: number): Item => { // I
  return {
    name,
		price
  }
}

const calcTotal = (cart: Item[]): number => { // C, I, B
  return cart.reduce((acc, item) => {
		acc += item.price
    return acc
	}, 0) 
}

const getsFreeShipping = (cart: Item[]): boolean => { // B
  return calcTotal(cart) >= 20
}

const calcTax = (amount: number): number => { // B
  return amount * 0.1
}
```

이제 calcTotal 말고는 다 하나의 분류만 가지는 계산 함수가 되었다.

## 작은 함수와 많은 계산

지금까지 고친 코드를 정리하고, 액션과 계산으로 분류하자.

```ts
let shoppingCart = [] // A : 전역 변수

const addItemToCart = (name: string, price: number) => { // A : 전역변수, DOM 조작
  const item = makeCartItem(name, price)
	shoppingCart = addItem(shoppingCart, item)
  const total = calcTotal(shoppingCart);
  setCartTotalDom(total)
  updateShippingIcons(shoppingCart)
	updateTexDom(total)
}

const updateShippingIcons = (cart) => { // A : DOM 조작
  const buyBtns: HTMLButtonElement[] = getBuyBtns()
  buyBtns.forEach(btn => {
    const item = btn.item
    const newCart = addItem(cart, item)
    if (getIsFreeShipping(newCart)) {
      btn.showFreeShippingIcon()
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}

const updateTexDom = (total) => { // A : DOM 조작
  setTaxDom(calcTax(total));
}

const addElementLast = <T>(array: T[], elem: T): T[] => { // C
  const newArray = array.slice()
  newArray.push(elem)
  return newArray
}

const addItem = (cart: Item[], item: Item): Item[] => { // C
  return addElementLast(cart, item)
}

const makeCartItem = (name: string, price: number): Item => { // C
  return {
    name,
		price
  }
}

const calcTotal = (cart: Item[]): number => { // C
  return cart.reduce((acc, item) => {
		acc += item.price
    return acc
	}, 0) 
}

const getsFreeShipping = (cart: Item[]): boolean => { // C
  return calcTotal(cart) >= 20
}

const calcTax = (amount: number): number => { // C
  return amount * 0.1
}
```

## 결론
이제 액션은 데이터 구조에 대해 몰라도 된다. 그리고 재사용 할 수 있는 유용한 인터페이스 함수가 많이 생겼다. 하지만 아직 발견하지 못한 버그가 장바구니에 많이 숨어있다. 어떤 버그인지는 다음장에서 계속...

## 요점 정리
- 일반적으로 암묵적 입출력은 인자와 리턴값으로 바꿔 없애는 것이 좋다.
- 설계는 엉켜있는 것을 푸는 것이다. 풀려있는 것은 언제든 다시 합칠 수 있다.
- 엉켜있는 것을 풀어 각 함수가 하나의 일만 하도록 하면, 개념을 중심으로 쉽게 구성할 수 있다.
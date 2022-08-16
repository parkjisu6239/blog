# [Functional Coding] Chap4. 액션에서 계산 빼내기
> 테스트가 쉽고 재사용성이 좋은 코드를 만들기 위해 액션에서 계산을 빼낼수 있다.

## MegaMart.com 에 오신 것을 환영합니다

장바구니에 담긴 상품 금액의 합계를 구하자.

```ts
interface Item {
  name: string;
  price: number;
}

const shoppingCart: Item[] = []; // 장바구니의 상품 리스트
let shoppingCartTotal = 0;

const addItemToCart = (name: string, price: number) => { // 장바구니에 아이템 추가
	shoppingCart.push({
		name,
		price
	})
	calcCartTotal(); // 합계 업데이트
}

const calcCartTotal = () => {
	shoppingCartTotal = shoppingCart.reduce((acc, cur) => {
		acc += cur.price
    return acc
	}, 0)
	setCartTotalDom() // html에 금액 합계 업데이트
}
```

## 무료 배송비 계산하기
구매합계가 20달러 이상이면 무료 배송을 하기로 했다. 그래서 특정 상품을 장바구니에 담았을 때 20달러가 넘을 경우 상품 옆에 무료 배송 아이콘을 표시하려고 한다.

### 절차적 방법으로 구현하기
```ts
const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtns() // html에서 구매버튼 전체 가져오기
  buyBtns.forEach(btn => {
    const item = btn.item
    if (item.price + shoppingCartTotal >= 20) {
      btn.showFreeShippingIcon() // 무료 배송 표시
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}

const calcCartTotal = () => {
	shoppingCartTotal = shoppingCart.reduce((acc, cur) => {
		acc += cur.price
    return acc
	}, 0)
	setCartTotalDom() // html에 금액 합계 업데이트
	updateShippingIcons() // 아이콘 업데이트
}
```

합계 금액이 바뀔 때마다 모든 아이콘을 업데이트하기 위해 calcCartTotal() 마지막에 updateShippingIcons 을 호출해야한다.

## 세금 계산하기
장바구니 금액 합계가 바뀔 때마다 세금을 다시 계산해야 한다.
```ts
const updateTexDom = () => {
  setTaxDom(shoppingCartTotal * 0.1); // 세금 세팅
}

const calcCartTotal = () => {
	shoppingCartTotal = shoppingCart.reduce((acc, cur) => {
		acc += cur.price
    return acc
	}, 0)
	setCartTotalDom() // html에 금액 합계 업데이트
	updateShippingIcons() // 아이콘 업데이트
	updateTexDom() // 세금 업데이트
}
```

## 테스트 쉽게 만들기
지금 코드는 비즈니스 규칙을 테스트하기 어렵다. 코드가 바뀔 때마다 만들어야하는 테스트는 다음과 같다.

1. 브라우저 설정하기
2. 페이지 로드하기
3. 장바구니에 제품 담기 버튼 클릭
4. DOM이 업데이트될 때까지 기다리기
5. DOM에서 값 가져오기
6. 가져온 문자열 값을 숫자로 바꾸기
7. 예상하는 값과 비교하기

```ts
const updateTexDom = () => {
  setTaxDom(shoppingCartTotal * 0.1); // 세금 세팅
}
```

결과값을 얻을 방법은 DOM에서 값을 가져오는 것 뿐이며, 위 함수의 인풋, 아웃풋은 모두 없다. 테스트를 제대로 하려면 전역 변수인 `shoppingCartTotal` 를 설정해야 하는데, 이를 위해서는 다른 함수를 실행해야만 한다.

### 테스트 개선을 위한 제안
- DOM 업데이트와 비즈니스 규칙은 분리되어야 한다.
- 전역변수가 없어야 한다.


## 재사용하기 쉽게 만들기
다른 탐에서 우리 코드를 사용하려 했지만, 다음의 이유로 재사용할 수 없다.
- 장바구니 정보를 전역 변수에서 읽어오고 있지만, 결제팀과 배송팀은 DB 에서 장바구니 정보를 읽어와야 한다.
- 결과를 보여주기 위해 DOM을 직접 바꾸고 있지만, 결재팀은 영수증을, 배송팀은 운송장을 출력해야 한다.

```ts
const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtns() // html에서 구매버튼 전체 가져오기
  buyBtns.forEach(btn => {
    const item = btn.item
    if (item.price + shoppingCartTotal >= 20) {
      btn.showFreeShippingIcon() // 무료 배송 표시
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}
```
위 코드를 보면 인풋은 없고, DOM에 의존하고 있다. 아웃풋도 없고 바로 DOM을 업데이트하여 결과를 반영한다. 이 코드는 브라우저에서만 동작 가능하고, 브라우저 환경이 아니라면 실행과 테스트가 불가능하다.

### 개발팀의 제안
- 전역 변수에 의존하지 않아야 한다.
- DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안된다.
- 함수가 결과값을 리턴해야 한다.

## 액션과 계산, 데이터를 구분하기
앞서 작성한 코드를 보면, 전역변수는 데이터같지만 변경가능하고 그 시점에 따라 다르기 때문에 액션이다. 그리고 인풋/아웃풋 없이 그 시점에 DOM에 의존하는 모든 함수들이 액션이다. 결국 위에서 작성한 모든 코드는 액션이다.

## 함수에는 입력과 출력이 있다.
- 모든 함수는 입출력이 있다. 
- 입력은 함수가 계산을 하기 위한 외부 정보이다.
- 출력은 함수 밖으로 나오는 정보나 동작이다.
- 함수를 호출하는 이유는 결과가 필요하기 때문이다. 그리고 원하는 결과를 얻으려면 입력이 필요하다.

```ts
let total = 0
const addToTotal = (amount: number): number => { // 인자는 입력
	console.log("Old total: " + total) // 콘솔 출력
	total += amount // 전역변수를 바꾸는 것은 출력
	return total // 리턴은 출력
}
```

### 입력과 출력은 명시적이거나 암묵적일 수 있다.
인자와 리턴값은 명시적인 입력과 출력이다. 하지만 암묵적으로 함수로 들어오거나 나오는 정보도 있다.
```ts
let total = 0
const addToTotal = (amount: number): number => { // 인자는 명시적 입력
	console.log("Old total: " + total) // 콘솔, 암묵적 출력
	total += amount // 암묵적 출력
	return total // 명시적 출력
}
```

### 함수에 암묵적 입출력이 있으면 액션이 된다.
함수에서 암묵적 입력과 출력을 없애면 계산이 된다. 암묵적 입력은 함수의 인자로 바꾸고 암묵적 출력은 함수의 리턴값으로 바꾸면 된다.

> 함수형 프로그래머는 암묵적 입출력을 `부수효과` 라고 한다.

## 테스트와 재사용성은 입출력과 관련이 있다.
1. DOM 업데이트와 비즈니스 규칙은 분리되어야 한다.
		- DOM 업데이트는 함수에서 어떤 정보가 나오는 것이기 때문에 출력이다.
		- 하지만 리턴값은 아니기 때문에 암묵적 출력이다.
		- 화면에 표시는 해야하기 때문에 DOM 업데이트는 필수적이다.
		- 따라서, DOM 업데이트와 비즈니스 규칙을 분리할 필요가 있다.
2. 전역변수가 없어야 한다. / 전역변수에 의존하지 않아야 한다.
		- 전역 변수를 읽는 것은 암묵적 입력이고, 바꾸는 것은 암묵적 출력이다.
		- 암묵적 입출력은 사이드 이펙트이므로, 없애야 한다.
		- 암묵적 입력은 인자로, 암묵적 출력은 리턴값으로 변경해야 한다.

3. DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안된다. / 함수가 결과값을 리턴해야 한다.
		- DOM을 직접 조작해서 함수의 암묵적 출력으로 사용하고 있다.
		- 이는 함수의 리턴값으로 바꿀 수 있다.

## 액션에서 계산 빼내기

```ts
// Before
const calcCartTotal = () => {
	shoppingCartTotal = shoppingCart.reduce((acc, cur) => { // ❌ 전역변수인 shoppingCart에 의존(암시적 입력)
		acc += cur.price
    return acc
	}, 0) // ❌ 리턴없이 전역변수의 값을 바로 변경(암시적 출력)

  setCartTotalDom() // 액션
  updateShippingIcons() // 액션
	updateTexDom() // 액션
}
```

위 코드는 아래처럼 수정될 수 있다.

```ts
// After
const calcTotal = (cart: Item[]): number => { // 🟢 명시적 입출력
  return cart.reduce((acc, cur) => { // 🟢 전역 변수 대신 인자 사용
		acc += cur.price // 🟢 Dom 조작과 관련 없음
    return acc
	}, 0) 
}

const calcCartTotal = () => { 
  shoppingCartTotal = calcTotal(shoppingCart); 
  setCartTotalDom()
  updateShippingIcons()
	updateTexDom()
}
```

- 전역변수를 제거하여, 암시적 입출력 대신 명시적 입출력을 사용한다.
- DOM 조작과 비즈니스로직이 분리되어, DOM이 없을 때도 `calcTotal` 를 테스트 할 수 있다.

## 액션에서 또 다른 계산 빼내기
```ts
// Before
const addItemToCart = (name: string, price: number) => {
	shoppingCart.push({ // ❌ 전역변수인 shoppingCart에 의존(암시적 입/출력)
		name,
		price
	})
	calcCartTotal();
}
```

```ts
// After
const addItem = (cart: Item[], name: string, price: number): Item[] => { // 🟢 전역 변수를 없애고, 명시적 입력에만 의존한다.
  const newCart = cart.slice() // 🟢 전역 변수를 직접 바꾸지 않고 복사본을 만든다.
  newCart.push({
		name,
		price
	})
  return newCart; // 🟢 명시적 출력을 반환한다.
}

const addItemToCart = (name: string, price: number) => {
	shoppingCart = addItem(shoppingCart, name, price) // 🟢 업데이트된 값을 전역변수에 할당한다.
	calcCartTotal();
}
```

<details>
<summary>쉬는 시간</summary>
<p>

### 코드가 더 많아졌다.
- 일반적으로는 코드가 더 적은게 좋다. 단기적으로는 그렇지만 시간이 지나면서 함수로 분리한 것에 장점을 얻을 수 있다.
- 코드를 테스트하기 쉬워졌다.
- 재사용하기 좋아졌다.
- 테스트 코드는 짧아진다.

### 다른 곳에서 쓰지 않더라도 계산을 분리해야하는가?
- 함수형 프로그래밍의 목적 중에는 어떤 것을 분리해서 더 작게 만들려고 하는 것도 있다.
- 작은 것은 테스트하기 쉽고 재사용하기 쉽고 이해하기 쉽다.

### 계산으로 바꾼 값에서도 변수를 변경하고 있다.
- 불변값은 생성 후에 바뀌면 안되지만, 초기화가 필요하다.
- 지역 변수를 변경하는 곳은 나중에 초기화할 값으로 새로 생성한다.
- 지역 변수이기 때문에 함수 밖에서는 접근 할 수 없다.
</p>
</details>

## 계산의 추출을 단계별로 알아보기
### 1. 계산 코드를 찾아 빼낸다.
- 빼낼 코드를 찾는다.
- 새로운 코드를 함수로 만들고 리팩터링 한다.
- 인자가 필요하면 추가한다.
- 원래코드에서 빼낸 부분에 새 함수를 부르도록 바꾼다.

### 2. 새 함수에 암묵적 입출력을 찾는다.
- 암묵적 입력은 함수를 부르는 동안 결과에 영향을 줄 수 있는 것이다.
- 암묵적 출력은 함수 호출의 결과로 영향을 받는 것을 말한다.
- 함수 인자를 포함해 함수 밖 변수를 읽거나 DB에서 값을 가져오는 것은 입력이다.
- 리턴값을 포함해 전역 변수를 바꾸거나, 공유 객체를 바꾸거나 웹요청을 보내는 것은 출력이다.

### 3. 압묵적 입력은 인자로, 암묵적 출력은 리턴값으로 바꾼다.
- 암묵적 입력 -> 인자, 암묵적 출력 -> 리턴값
- 인자와 리턴값은 불변이다. 리턴값이 나중에 바뀐다면 암묵적 출력이다.

## 세금 계산 빼내기

```ts
// Before
const updateTexDom = () => {
  setTaxDom(shoppingCartTotal * 0.1);
}
```

```ts
// After
const calcTax = (amount: number): number => {
  return amount * 0.1
}

const updateTexDom = () => {
  setTaxDom(calcTax(shoppingCartTotal));
}
```

## 무료배송 아이콘 계산 빼내기
```ts
// Before
const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtns() // html에서 구매버튼 전체 가져오기
  buyBtns.forEach(btn => {
    const item = btn.item
    if (item.price + shoppingCartTotal >= 20) {
      btn.showFreeShippingIcon() // 무료 배송 표시
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}
```

```ts
// After
const getIsFreeShipping = (total: number, price: number): boolean => {
  if (price + total >= 20) {
    return true
  } else {
    return false
  }
}

const updateShippingIcons = () => {
  const buyBtns: HTMLButtonElement[] = getBuyBtns() // html에서 구매버튼 전체 가져오기
  buyBtns.forEach(btn => {
    const item = btn.item
    if (getIsFreeShipping(shoppingCartTotal, item.price)) {
      btn.showFreeShippingIcon() // 무료 배송 표시
    } else {
      btn.hideFreeShippingIcon()
    }
  });
}
```

## 전체 코드
```ts
const shoppingCart: Item[] = []; // Action
let shoppingCartTotal = 0; // Action

const addItemToCart = (name: string, price: number) => { // Action
	shoppingCart = addItem(shoppingCart, name, price) // 암시적 입력: shoppingCart
	calcCartTotal();
}

const calcCartTotal = () => { // Action
  shoppingCartTotal = calcTotal(shoppingCart); // 암시적 출력: shoppingCart
  setCartTotalDom()
  updateShippingIcons()
	updateTexDom()
}

const updateShippingIcons = () => { // Action
  const buyBtns: HTMLButtonElement[] = getBuyBtns()
  buyBtns.forEach(btn => {
    const item = btn.item
    if (getIsFreeShipping(shoppingCartTotal, item.price)) { // 암시적 입력: shoppingCart
      btn.showFreeShippingIcon() // 암시적 출력: DOM
    } else {
      btn.hideFreeShippingIcon() // 암시적 출력: DOM
    }
  });
}

const updateTexDom = () => { // Action
  setTaxDom(calcTax(shoppingCartTotal)); // 암시적 출력: DOM
}

const calcTotal = (cart: Item[]): number => { // Calculate
  return cart.reduce((acc, cur) => {
		acc += cur.price
    return acc
	}, 0) 
}

const getIsFreeShipping = (total: number, price: number): boolean => { // Calculate
  if (price + total >= 20) {
    return true
  } else {
    return false
  }
}

const calcTax = (amount: number): number => { // Calculate
  return amount * 0.1
}

const addItem = (cart: Item[], name: string, price: number): Item[] => { // Calculate
  const newCart = cart.slice()
  newCart.push({
		name,
		price
	})
  return newCart;
}
```

## 요점 정리
- 액션은 암묵적인 입력 또는 출력을 가지고 있다.
- 계산의 정의에 따르면 계산은 암묵적인 입력 및 출력이 없어야 한다.
- 공유변수 (전역변수)는 일반적으로 암묵적 입력 및 출력이 된다.
- 암묵적 입력은 인자로 바꿀 수 있다.
- 암묵적 출력은 리턴값으로 바꿀 수 있다.
- 함수형 원칙을 적용하면 액션은 줄어들고 계산은 늘어난다는 것을 확인했다.
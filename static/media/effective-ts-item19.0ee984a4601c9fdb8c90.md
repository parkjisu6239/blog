# Item 19. 추론 가능한 타입을 사용해 장황한 코드를 방지하기

- 타입 스크립트의 추론은 상당히 정확하다. 따라서 모든 변수에 타입을 지정할 필요가 없다.
- 그럼에도 타입을 추가하는 것이 좋은 경우가 있고, 떄에 따라 적절히 사용해야 한다.

## 타입 추론을 생략 하는 경우

### 타입 체커의 타입 추론만으로도 가능한 경우
아래와 같은 상황에서는 굳이 명시적 타입 구문을 사용할 필요 없이, 타입 스크립트의 타입 추론만을 사용하는 것이 좋다.

불필요한 타입 선언은, 원본 타입이 변경될 때마다 수동으로 바꿔줘야 되서 좋지 않을때가 있다. 이러한 경우에는 Destructuring 하여 사용 하는 것이 좋다. 대신 함수의 인자로 받을 떄는 인자의 타입만 명시해주면, 함수 안에서의 변수 타입을 확실히 할 수 있다.
```ts
// number로 추론된다.
let x = 12;

// value가 string으로 추론된다.
const person = {
  name: 'Sojourner Truth',
  born: {
    where: 'Swartekill, NY',
    when: 'c.1797',
  },
  died: {
    where: 'Battle Creek, MI',
    when: 'Nov. 26, 1883'
  }
};

// 헬퍼메서드의 결과도 원본 배열에 맞게 추론된다.
function square(nums: number[]) {
  return nums.map(x => x * x);
}
const squares = square([1, 2, 3, 4]);

// const 로 선언한 문자열은, 문자열이 아니라 리터럴로 정확하게 추론된다.
const axis2 = 'y';  // Type is "y"
```

### 함수 매개변수에 기본값이 있는 경우
이상적인 타입 스크립트 코드는 함수/메서드 시그니처 타입 구문을 포함하는 것이지만, 일부 생략할수도 있다.

```ts
function parseNumber(str: string, base=10) { // base는 number로 추론된다.
  // ...
}
```

### 함수의 매개변수 타입이 명확한 경우

라이브러리나 매개변수 타입이 명시된 함수의 경우 인자의 타입이 자동으로 추론된다. 아래 예시의 경우 굳이 `request`, `response` 의 타입을 명시하지 않아도, 자동으로 추론된다.
```ts
// express
namespace express {
  export interface Request {}
  export interface Response {
    send(text: string): void;
  }
}

interface App {
  get(path: string, cb: (request: express.Request, response: express.Response) => void): void;
}

// Don't do this:
app.get('/health', (request: express.Request, response: express.Response) => {
  response.send('OK');
});

// Do this:
app.get('/health', (request, response) => {
  response.send('OK');
});
```

## 타입을 명시적으로 사용하는 경우(생략하지 않고)

### 객체 리터럴을 정의하는 경우
객체 리터럴을 선언할 때 명시적 타입을 사용하면, 선언하는 곳에서 에러를 표시한다. 그런데 선언할때는 타입을 지정하지 않는다면, 잘못된 타입에 대해 사용하는 곳에서 에러를 발생시킨다. 사용하기 전에 선언 단계에서 오류를 잡는 것이 더 낫다.

```ts

interface Product {
  id: string;
  name: string;
  price: number;
}

function logProduct(product: Product) {
  const id: number = product.id;
     // ~~ Type 'string' is not assignable to type 'number'
  const name: string = product.name;
  const price: number = product.price;
  console.log(id, name, price);
}

// Bad
const furby = {
  name: 'Furby',
  id: 630509430963,
  price: 35,
};

logProduct(furby);
        // ~~~~~ Argument .. is not assignable to parameter of type 'Product'
        //         Types of property 'id' are incompatible
        //         Type 'number' is not assignable to type 'string'

// Good
const furby: Product = {
  name: 'Furby',
  id: 630509430963, // Type 'number' is not assignable to type 'string'
  price: 35,
};
```

### 함수의 반환 타입을 명시해서 오류를 줄이는 경우
위와 마찬가지로 타입 추론이 가능할지라도, 함수를 호출하고나서야 오류를 발견하지 않도록 타입 구문을 명시하는 것이 좋다.

아래는 함수의 반환타입은 number | promise 이다. 의도는 promise 였을 것이다. 아래처럼 반환타입이 없다면, 함수 선언부에서는 오류를 확인하기 어렵고, 사용하는 곳에서 오류를 볼 수있다.
```ts
const cache: {[ticker: string]: number} = {};
function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker]; // number
  }
  return fetch(`https://quotes.example.com/?q=${ticker}`) // promise
      .then(response => response.json())
      .then(quote => {
        cache[ticker] = quote;
        return quote;
      });
}
function considerBuying(x: any) {}
getQuote('MSFT').then(considerBuying);
              // ~~~~ Property 'then' does not exist on type
              //        'number | Promise<any>'
              //      Property 'then' does not exist on type 'number'
```

대신 아래처럼 함수 반환 타입을 명시하면, 함수 선언부에서 오류를 확인하고 수정할 수 있다.
```ts
const cache: {[ticker: string]: number} = {};
function getQuote(ticker: string): Promise<number> {
  if (ticker in cache) {
    return cache[ticker];
        // ~~~~~~~~~~~~~ Type 'number' is not assignable to 'Promise<number>'
  }
  // COMPRESS
  return Promise.resolve(0);
  // END
}
```

아래처럼 수정할 수 있겠다.
```ts
const cache: {[ticker: string]: number} = {};
function getQuote(ticker: string): Promise<number> {
  if (ticker in cache) {
    return new Promise((resolve) => resolve(cache[ticker]));
  }
  // COMPRESS
  return Promise.resolve(0);
  // END
}
```

이외에도 반환타입 명시를 하면 좋은 점들이 있다.
1. 함수에 대해 더욱 명확하게 알 수 있다.
2. 테스트 주도 개발에 도움이 된다.
3. 명명된 타입을 사용할 수 있다.


## 요약
- 타입스크립트가 타입을 추론할 수 있다면, 타입구문을 생략하는 것이 좋다.
- 이상적인 경우 함수/메서드의 시그니처에는 타입 구문이 있지만, 함수 내의 지역변수에는 타입구문이 없다.
- 추론될 수 있는 경우라도 객체 리터럴과 함수 반환에는 타입 명시를 고려하여 오류를 줄일 수 있다.
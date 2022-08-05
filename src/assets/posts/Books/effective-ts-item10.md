# Item 10. 객체 래퍼 타입 피하기

js에는 객체 이외에도 기본형 값들에 대한 일곱 가지 타입(string, number, boolean, null, undefined, symbol, bigint) 가 있다. 기본형들은 `불변` 이며, 메서드를 가지지 않는다는 점에서 객체와 구분된다. 그런데 기본형도 메서드를 가진 것 처럼 보인다.

## 기본형과 객체 래퍼
```ts
const num = 1
const str = "hello"

num.toString() // Method ?
str.charAt()
```

사실 `chartAt()` 이나 `toString()` 은 원시객체인 `string`, `number`의 매서드가 아니며 이를 감싼 객체(`String`, `Number`) 의 매서드이다.

```js
const stringObj = new String('foo');

console.log(typeof stringObj); // "object"
console.log(typeof stringObj.valueOf()); // "string"
```

즉, 기본형(원시타입)의 메서드로 보이는 것들은 기본형을 감싼 객체의 매서드이다. 우리가 `new String()` 으로 생성한 String의 인스턴스가 아님에도 매서드를 사용할 수 있는 것은 자바스트립트 내부적으로 기본형과 객테를 자유롭게 변환하기 때문이다. string 기본형에 chartAt 같은 메서드를 사용할 때, 자바스크립트는 기본형을 String 객체로 래핑(wrap) 하고, 메서드를 호출한 후, 마지막에 래핑한 객체를 버린다.

## 객체 래퍼 타입
객체 래퍼는 매서드를 호출하고, 속성을 반환하는 점에서 기본형과 동일하게 동작한다. 하지만 기본형과 객체 래퍼가 항상 동일하게 동작하는 것은 아니다. 예를 들어, String 객체는 오직 자기 자신하고만 동일하다.

```js
"hello" === new String("hello") // false
new String("hello") === new String("hello") // false
```

객체 래퍼 타입은 당황스러운 동작을 보일 떄가 있다. 위에서 설명한 것처럼, 기본형에서 메서드나 속성을 사용할 때 기본형을 객체 래퍼로 감싼 후 값을 반환하고, 래퍼는 버린다. 따라서 다음과 같은 상황이 발생한다.
```js
const x = "hello"
x.language = "English"
console.log(x.language) // undefined
```

## 주의할 것
기본형과 객체 래퍼 타입은 서로 다르지만 거의 동일하게 동작한다. 타입을 지정할 때도 기본형 대신 객체 래퍼 타입으로 지정해도 처음에는 문제가 없는 것 처럼 보인다.

```ts
function getStringLen(foo: String) {
  return foo.length;
}

getStringLen("hello");  // OK
getStringLen(new String("hello"));  // OK
```

그러나 string을 매개변수로 받는 메서드에 String 객체를 전달하는 순간 문제가 발생한다.
```ts
function isGreeting(phrase: String) {
  return [
    'hello',
    'good day'
  ].includes(phrase);
          // ~~~~~~
          // Argument of type 'String' is not assignable to parameter
          // of type 'string'.
          // 'string' is a primitive, but 'String' is a wrapper object;
          // prefer using 'string' when possible
}
```

`string`은 `String`에 할당할 수 있지만, `String`은 `string`에 할당할 수 없다. 대부분의 라이브러리와 마찬가지로 타입스크립트가 제공하는 타입 선언은 전부 기본형 타입으로 되어 있다.

래퍼 객체는 타입 구문의 첫 글자를 대문자로 표기하는 방법으로도 사용할 수 있다.
```ts
const s: String = "primitive";
const n: Number = 12;
const b: Boolean = true;
```

당연히 런타임 값을 객체가 아니고 기본형이다. 그러나 기본형 타입은 객체 래퍼에 할당할 수 있기 때문에 ts는 기본형 타입은 객체 래퍼에 할당하는 선언을 허용한다. (string < String) 하지만 가능할 뿐 전혀 권장되지 않고, 헷갈리기만 하니 타입은 반드시 기본형으로 해야한다.


## BigInt, Symbol
그런데 new 없이 BigInt와 Symbol을 호출하는 경우는 기본형을 생성하기 때문에 사용해도 좋다.
```js
typeof BigInt(1234) // "bigint"
typeof Symbol("syn") // "symbol"
```
이들은 BigInt와 Symbol "값"이지만, 타입스크립트 타입은 아니다. 위 예시는 런타임에서도 살아있는, 변수로 할당 가능합 값이 된다.


## 요약
- 기본형 값에 메서드를 제공하기 위해 js는 객체 래퍼 타입으로 변환한다. 이후 이를 버린다.
- 객체 래퍼 타입을 직접 사용하너 인스턴스를 생성하는 것을 피해야 한다.
- 타입스크립트 객체 래퍼 타입은 지양하고, 대신 기본형 타입을 사용해야 한다.

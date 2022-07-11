# [Clean Code] Chap2. 의미있는 이름


> 챕터 2에서는 의미있는 이름이 얼마나 중요한지, 의미있는 이름을 짓기 위한 가이드를 소개한다. 

<br/>

## TI;DL
- 의도를 분명히 밝혀라
- 그릇된 정보를 피해라
- 의미있게 구분하라
- 발음하기 쉬운 이름을 사용하라
- 검색하기 쉬운 이름을 사용해라
- 인코딩을 피해라
- 자신의 기억력을 자랑하지 마라
- 기발한 이름은 피하라
- 한 개념에 한 단어를 사용하라
- 말장난을 하지 마라
- 해법 영역에서 가져온 이름을 사용하라
- 문제 영역에서 가져온 이름을 사용하라
- 의미있는 맥락을 추가하라
- 불필요한 맥락을 없애라

## 의도를 분명히 밝혀라
`파일 생성 후 경과한 시간` 을 변수로 표현한다면? 두루뭉술한 변수보다는 명확한 이름이 좋다.
```ts
// Bad ❌
var d:number

// Good 👍
var daysSinceCreation: number
var fileAgeInDays: number
```

## 그릇된 정보를 피하라
읽는 사람으로 하여금 오해할만한 정보는 피하는 것이 좋다.
```ts
// Bad ❌ : List 가 아닌데, List 라는 접미사
const accountList = {
  manager: {
    name: "bob",
    age: "30",
    ...
  },
  superviser: {
    name: "lisa",
    age: "30",
    ...
  },
  owner: {
    ...
  }
}

// Good 👍
const accountGroup = {
  father: {
    name: "bob",
    age: "30",
    ...
  },
  mother: {
    name: "lisa",
    age: "30",
    ...
  },
  dauther: {
    ...
  }
}
```

## 의미있게 구분하라
여러개의 변수에 1,2,3.. 이라는 의미없는 접미사를 붙이는 것을 피하라.
```ts
// Bad ❌
const copyStr: string = (text1: string, text2: string) => {
  for (let i; i <text1.length; i++) {
    text2[i] = text1[i]
  }
  return text2
}

// Good 👍
const copyStr: string = (source: string, destination: string) => {
  for (let i; i <source.length; i++) {
    destination[i] = source[i]
  }
  return text2
}
```

읽는 사람이 차이를 알도록 이름을 지어라.
```ts
// Bad ❌
getActiveAccount()
getActiveAccounts()
getActiveAccountInfo()
```

## 발음하기 쉬운 이름을 사용하라
심한 축약어나 줄임말을 사용해서 발음을 어렵게 하기보다는 팀원과의 소통을 위해 길더라도 명확한 의미의 변수가 낫다.
```ts
// Bad ❌
var genymdhms // gerneration year month day hour minute second 의 줄임말

// Good 👍
var gernerationTimestamp
```

## 인코딩을 피하라
변수의 타입은 `type`으로 충분히 지정이 가능하니, 변수 이름에서 타입을 설명하지 마라.
```ts
// Bad ❌
var phoneString

// Good 👍
var phone: string
```

## 자신의 기억력을 자랑하지 마라
`i,j,k` 는 반복 루프에서만, 그것도 단순한 반복 루프에서만 사용하라. a,b,c,d,... 순서로 변수를 생성하지 마라.

## 클래스 이름
클래스 이름과 객체 이름은 명사나 명사구가 적합하다. 모호하거나 범용적으로 너무 많은 의미를 내포하는 단어를 사용하지 않는 것이 좋다.
```js
// Bad ❌
var Manager
var Processor
var Data
var Info

// Good 👍
var Customer
var WikiPage
var Account
var AddressParser
```

## 매서드 이름
매서드 이름은 동사나 동사구가 적합하다. `post~`, `delete~`, `save~` 등이 좋다. 일반적으로 접근자, 변경자, 조건자는 앞에 `get`, `set`, `is` 를 붙인다.
```js
// Good 👍
const user = new User()

user.setName("kate")
user.getName()
user.isAdmin()
```

## 기발한 이름은 피해라
기발한 이름은 이해하기 어렵고, 무슨 역할을 하는 함수인지 파악하기 어렵다. 의도를 분명히 하고 솔직하게 표현하라.

## 한 개념에 한 단어를 사용하라.
똑같은 매서드를 클래스마다 `fetch`, `retrieve`, `get` 등으로 제각각 부르면 혼란스럽다. 동일한 역할을 하는 매서드라면 이름을 통일하라.

## 말장난을 하지 마라
동일한 이름의 함수나 변수는 그것이 하는 기능이나 의미가 동일해야 한다. 같은 맥락이 아닌 경우에 일관성을 고려하여 동일한 이름을 사용하는 경우가 있는데 이는 좋지 않다.

지금까지 구현한 `add` 라는 매서드는 모두가 기존값 두 개를 더하거나 이어서 새로운 값을 만든다고 하자. 이때 새로운 `add` 매서드가 집합에 값을 하나 추가하는 기능을 한다면 이 매서드를 `add` 라고 하는 것이 좋을까? 그보다는 `append` 나 `insert` 가 더 적절하다.

## 해법 영역에서 가져온 이름을 사용하라
모든 이름을 문제(domain) 영역에서 가져올 필요는 없다. 프로그래머는 기술 영역(알고리즘 이름, 패턴이름, 수학용어)를 더 잘 아는 편이다. 이해하기 어려운 도메인 영역의 이름보다는 (개발자에게) 직관적인 해법 영역의 이름이 더 나을 때가 있다.

## 문제(domain) 영역에서 가져온 이름을 사용하라
바로 위와 상반되는 내용이다. 적절한 `프로그래머 용어`가 없다면 문제 영역에서 이름을 가져온다. 

## 의미있는 맥락을 추가하라
스스로 의미가 분명한 이름이 없지 않다. 대부분이 분명하다. 이는 마지막 수단으로 사용하는 것이 좋다.
예를 들어 `firstName, lastName, street, houseNumber, city, state, zipCode` 라는 변수들이 있으면 주소를 나타낸다는 사실을 쉽게 알 수 있다.

그런데 이중에서 `state` 만 달랑있으면 이게 주소의 일부라는 것을 알 수 있을까?
```ts
// Bad ❌
var firstName
var lastName
var street
var houseNumber
var city
var state
var zipCode

// Good 1 👍
var addrFirstName
var addrLastName
var addrStreet
var addrHouseNumber
var addrCity
var addrState
var addrZipCode

// Good 2 👍
var adress = {
  firstName: "",
  lastName: "",
  street: "",
  houseNumber: "",
  city: "",
  state: "",
  zipCode: "",
}

console.log(adress.state)
```

## 불필요한 맥락을 없애라
변수 이름에서 중복이 너무 많고, 불필요한 수식어는 없애는 것이 좋다. 일반적으로는 (의미가 명확하다면) 짧은 이름이 긴 이름보다 좋다.
```ts
// Bad ❌
cosnt UserInfoTableContainer = () => {}

const UserInfoTableContainerTitle = ""
const UserInfoTableContainerTable = ...
```
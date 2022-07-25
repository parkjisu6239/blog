# [Functional Coding] Chap1. 쏙쏙 들어오는 함수형 코딩에 오신 것을 환영합니다.
> 이 장에서는 함수형 사고가 무엇인지, 왜 함수형 사고가 더 좋은 소프트웨어를 만들려는 개발자에게 도움이 되는지 설명한다.

![메뚜기월드에오신걸환영합니다](https://mblogthumb-phinf.pstatic.net/20130107_271/somblog_1357489423438aiKdr_JPEG/15.jpg?type=w2)

## TI;DL
- 학문적인 함수형 코딩과 실용적인 함수형 코딩의 정의.
- 함수형 사고, 액션/계산/데이터를 구분할 줄 아는 것.
	- 액선 : 시간과 횟수에 의존하는 코드
	- 계산 : 시간에 의존하지 않으며, 입력값이 같다면 항상 같은 결과를 출력한다.
	- 데이터 : 정적이고 해석이 필요하다. 저장하거나 이해하기 쉽고 전송하기 편리하다.

## 함수형 프로그래밍이란 무엇인가요?
함수향 프로그래밍의 정의는 [위키](https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98%ED%98%95_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D) 에서도 확인 할 수 있다.
- `수학 함수` 를 사용하고 `부수효과(side effect)`를 피하는 것이 특징인 프로그래밍 패러다임
- `부수 효과` 없이 `순수 함수(pure function)`만 사용하는 프로그래밍 스타일

`부수효과` 는 함수가 리턴값 이외에 하는 모든 일을 말한다. 예를 들면 이메일을 보내거나(fetch), 전역 상태 수정하기(set)가 있다. 하지만 사이드 이펙트는 함수의 목적이다 의의이다. 이 내용은 아래에서 알아보자.

`순수 함수`, `수학 함수` 는 인자에만 의존하고 부수효과가 없는 함수를 말한다. 인자에만 의존한다는 말은 **같은 인자를 넣으면 항상 같은 리턴값을 돌러준다는 의미이다**
우리가 어릴 때 배웠던 수학에서의 `함수` 와 흡사하게 x 를 넣었을 때 항상 같은 y 가 나오는 함수는 순수함수라고 한다.

![함수](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Function_machine2.svg/220px-Function_machine2.svg.png)

위 정의에 따르면 함수형 프로그래머는 항상 부수효과를 피하고 순수 함수만 사용해야 할 것 같지만, 현실에서는 그러기는 불가능하다.

## 실용적인 측면에서의 함수형 프로그래밍 정의의 문제점
위 정의에는 문제가 있다. 문제는 다음과 같다.
1. 부수효과는 필요하다.
	- 이메일을 전송하는 프로그램을 만드는데, 이메일을 보내는 행위가 사이드이펙트라면 어떻게 만들것인가?
2. 함수형 프로그래밍은 부수효과를 잘 다룰 수 있습니다.
	- 부수 효과를 잘 다룰 수 있는 도구가 많이 있다.
	- 함수형 프로그래머는 순수하지 않은 함수도 사용한다.
3. 함수형 프로그래밍은 실용적이다.
	- 함수형 프로그래밍으로 잘 만들어진 좋은 소프트웨어가 많이 있다.

## 함수형 프로그래밍을 학문적 지식이 아닌 기술과 개념으로 보기
이 책에서는 함수형 프로그래밍을 위에서 설명한 학문으로 정의하지 않는다. 대신 함수형 사고를 어떻게 해야하는지 설명한다.

## 액션, 계산, 데이터 구분하기
함수형 프로그래머는 직감적으로 코드를 세 분류로 나눈다.
1. 액션
2. 계산
3. 데이터

### 액션
액션은 함수를 부르는 시점, 횟수에 의존하는 함수이다.
예를 들면 `sendEmail(to, from, subject, body)`, `saveUserData(user)`, `getCurrentTime()`가 있다.

### 계산
계산은 동일한 입력값에 대해서는 항상 같은 출력값을 반환한다. 시점이나 횟수에 의존하지 않는다. 계산은 테스트하기 쉽고 언제든지 몇 번을 불러도 안전하다.
`sum(numbers)`, `string_length(str)`

### 데이터
데이터는 이벤트에 대한 기록, DB이다. 알아보기 쉬운 속성으로 되어 있고, 실행하지 않아도 그 자체로 의미가 있다. 데이터는 여러 형태로 해석할 수 있다.
```js
const numbers = [1,2,3,4,5]

const user = {
	firstName: "Eric",
	lastName: "Normand"
}

```

## 액션, 계산, 데이터를 구분하면 어떤 장점이 있나요?
함수형 프로그래밍은 요즘 유행하는 분산 시스템이 잘 어울린다.

여러 컴퓨터가 네트워크를 통해 통신하기 때문에, 처리할 메시지가 뒤섞을 수 있고 중복되거나 유실되기도 한다. **시간에 따라 바뀌는 값을 모델링**할 때 동작 방법을 이해하는 것이 중요하다. 실행 시점이나 횟수에 의존하는 코드를 분리하거나 없애면, 코드를 더 쉽게 이해할 수 있고 버그를 줄일 수 있다.

데이터와 계산을 시점이나 횟수에 의존하지 않는다. 따라서 액션을 데이터와 계산으로 바꾸거나, 영향의 범위를 줄인다면 코드를 더 간결하고 안전하게 짤 수 있다.

> 분산시스템의 규칙 3가지
> 1. 메시지 순서가 바뀔 수 있다.
> 2. 메시지는 한 번 이상 도착할 수도 있고, 도착하지 않을 수도 있다.
> 3. 응답을 받지 못하면 무슨일이 생겼는지 알 수 없다.
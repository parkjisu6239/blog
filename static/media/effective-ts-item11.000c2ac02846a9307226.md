# Item 11. 잉여 속성 체크의 한계 인지하기

> 구조적 타이핑 관점에서 잉여 속성 체크가 어떻게 동작하는지 알아보자. 잉여 속성 체크와 할당 가능 검사는 별도로 동작한다.

## 잉여 속성 체크
`잉여 속성 체크`는 타입이 명시된 변수에 객체 리터럴을 할당할 때 타입 스크립트는 해당 타입의 속성이 있는지, 그리고 `그 외 속성은 없는지` 확인하는 것이다.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}
const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
// ~~~~~~~~~~~~~~~~~~ Object literal may only specify known properties,
//                    and 'elephant' does not exist in type 'Room'
};
```

위 예시는 잉여 속성 체크에 의해서 오류가 발생한 것이다. 그런데 이전에 살펴본 [구조적 타이핑](effective-ts-ch1.md) 관점에서 보면 오류가 발생하지 않아야 한다. 이는 임시 변수를 도입해보면 알 수 있다.

```ts
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
};
const r1: Room = obj;  // OK
```

obj의 타입은 `{ numDoors: 1, ceilingHeightFt: 10, elephant: 'present' }` 로 추론되며, 이는 Room의 부분집합을 포함한다. 따라서 Room 에 할당가능하며 타입 체커도 통과되는 것이다. 

## 구조적 타이핑, 잉여 속성 체크 ?
첫 번째 예제에서는, 구조적 타이핑의 오류를 잡을 수 있도록 `잉여 속성 체크` 라는 과정이 수행되었다. 하지만 두번째에서는 그렇지 않고 구조적 타이핑 관점에서 할당이 가능했다.

이를 통해 잉여 속성 체크가 조건에 따라 동작하지 않는다는 한계가 있으며, 통상적인 `할당 가능 검사`와 함께 쓰이면 구조적 타이핑이 무엇인지 혼란스러워질 수 있다. `잉여 속성 체크`와 `할당 가능 검사`는 별도의 과정이라는 것을 알아야 타입 시스템을 더 잘 이해할 수 있다.

## 타입 체커의 잉여 속성 체크
타입 스크립트는 런타임 오류를 발견하는 것 뿐만아니라, 의도와 다르게 작성된 코드를 찾으려고 한다. 아래 예시에서는 오타로 `darkMode` 를 잘 못 쓴것도 잡아내고 있다. 이는 런타임에서는 오류 없이 단지 `undefined` 가 될 뿐이지만, 타입체커는 이를 잡아낸다.
```ts
function setDarkMode() {}
interface Options {
  title: string;
  darkMode?: boolean;
}

function createWindow(options: Options) {
  if (options.darkMode) {
    setDarkMode();
  }
  // ...
}

createWindow({
  title: 'Spider Solitaire',
  darkmode: true
// ~~~~~~~~~~~~~ Object literal may only specify known properties, but
//               'darkmode' does not exist in type 'Options'.
//               Did you mean to write 'darkMode'?
});
```

`Option` 타입은 범위가 매우 넓기 때문에, 순수한 구조적 타입 체커는 이런 종류의 오류를 찾아내지 못한다. `Option` 타입의 속성 외에 잉여 속성을 가지는 모든 객체는 `Option` 타입 범위에 속하게 된다.

```ts
const o1: Options = document;  // OK
const o2: Options = new HTMLAnchorElement;  // OK
```

`document` 와  `HTMLAnchorElement` 의 인스턴스 모두 해당 속성을 가지고 있기 때문에 위의 할당문은 정상이다.

## 잉여 속성 체크를 피하기

잉여 속성 체크를 이용하면 기본적으로 타입 시스템의 구조적 본질을 해치지 않으면서도 객체 리터럴에 알 수 없는 속성을 허용하지 않을음로써, 앞에서 다룬 Room, Option 예제 같은 문제점을 방지할 수 있다. (그래서 엄격한 객체 리터럴 체크라고도 불린다.)  `document` 와  `HTMLAnchorElement` 는 객체 리터럴이 아니기 때문에 `잉여 속성 체크` 가 되지 않는다. 하지만 {title, darkmode} 객체는 체크가 된다.

```ts
const o: Options = { darkmode: true, title: 'Ski Free' };
                  // ~~~~~~~~ 'darkmode' does not exist in type 'Options'...
```

오류를 사라지게 하려면 아래 처럼 리터럴이 아니게 할당하면 된다.

```ts
const intermediate = { darkmode: true, title: 'Ski Free' }; // 객체 리터럴
const o: Options = intermediate;  // OK
```

위 예제의 첫 번째 줄의 오른쪽은 객체 리터럴이지만, 두번째 줄의 오른쪽은 객체 리터럴이 아니다. 따라서 오류가 사라진다.

잉여 속성 체크는 타입 단언문을 사용할 때도 적용되지 않는다.

```ts
const o = { darkmode: true, title: 'Ski Free' } as Options;  // OK
```

잉여 속성 체크를 원하지 않는다면, 인덱스 시그니처를 사용해서 타입스크립트가 추가적인 속성을 예상하도록 할 수 있다.

```ts
interface Options {
  darkMode?: boolean;
  [otherOptions: string]: unknown;
}
const o: Options = { darkmode: true };  // OK
```

이런 방법이 데이터를 모델링하는데 적절한지 아닌지에 대해서는 아이템 15에서 다룬다. 

## `약한(weak) 타입` 체크
```ts
interface LineChartOptions {
  logscale?: boolean;
  invertedYAxis?: boolean;
  areaChart?: boolean;
}
const opts = { logScale: true };
const o: LineChartOptions = opts;
   // ~ Type '{ logScale: boolean; }' has no properties in common
   //   with type 'LineChartOptions'

const opts1 = { logscale: true };
const o4: LineChartOptions = opts1; // Ok
```

선택적 속성만 가지는 `약한 타입`에도 비슷한 체크가 동작한다.

구조적 관점에서 `LineChartOptions` 타입은 모든 속성이 선택적이므로, 모든 객체를 포함할 수 있다. 이런 약한 타입에 대해서는 타입스크립트는 값 타입과 선언 타입에 공통된 속성이 있는지 확인하는 별도의 체크를 수행한다. `공통 속성 체크`는 `잉여 속성 체크`와 마찬가지로 오타를 잡는데 효과적이며 구조적으로 엄격하지 않다.

그러나 잉여 속성 체크와 다르게, 약한 타입과 관련된 할당문마다 수행된다. 임시 변수를 제거하더라도 공통 속성 체크는 여전히 동작한다.

잉여 속성 체크는 구조적 타이핑 시스템에서 허용되는 속성 이름의 오타 같은 실수를 잡는데 효과적인 방법이다. 선택적 필드를 포함하는 `Options` 같은 타입에 특히 유용한 반면, 적용 범위도 매우 제한적이며 오직 `객체 리터럴`에만 적용된다.


## 요약
- 객체 리터럴을 변수에 할당하거나 함수에 매개변수로 전달할 때 잉여 속성 체크가 수행된다.
- 잉여 속성 체크는 오류를 찾는 효과적인 방법이지만, 타입스크립트 타입 체커가 수행하는 일반적인 구조적 할당 가능성 체크와 역할이 다르다.
- 잉여 속성 체크에는 한계가 있다.(객체 리터럴만 검사) 임시 변수를 도입하면 잉여 속성 체크를 건너 뛸 수 있다.
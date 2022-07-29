# Item6. 편집기를 사용하여 타입 시스템 탐색하기

## TS 가 하는 일
타입스크립트를 설치하면, 다음 두가지를 실행할 수 있다.
- 타입스크립트 컴파일러
- 단독으로 실행할 수 있는 타입스크립트 서버

## 언어서비스
타입스크립트는 TS -> JS 컴파일이 주된 목적이지만, `언어 서비스`를 제공한다는 점이 중요하다. `언어 서비스`는 코드 자동완성, 명세 검사, 검색, 리팩터링 등을 말한다.

IDE 마다 다르지만, 대부분 변수나 함수에 마우스를 올려두면 타입이나, 명세를 표시해준다. 또한 조건문 안에서 타입 좁히기를 한 후에 좁혀진 타입도 잘 표시된다.

IDE 에서의 오류를 보면 타입시스템이 어떻게 타입을 체크하는지 볼 수 있다.
```ts
function getElement(elOrId: string|HTMLElement|null): HTMLElement {
  if (typeof elOrId === 'object') { // -> ❗️ null type도 object 라서 걸러지지 않는다.
    return elOrId;
 // ~~~~~~~~~~~~~~ 'HTMLElement | null' is not assignable to 'HTMLElement'
  } else if (elOrId === null) {
    return document.body;
  } else {
    const el = document.getElementById(elOrId); // -> ❗️ elOrId 가 string 이라도 null 일 수 있다.
    return el;
 // ~~~~~~~~~~ 'HTMLElement | null' is not assignable to 'HTMLElement'
  }
}
```

또, IDE에서 `정의로 이동` 을 타고 들어가면 라이브러리의 구조나 타입을 모두 볼 수 있고, 파라미터들의 정보도 정확히 볼 수 있다.
# Item 17. 변경 관련된 오류 방지를 위해 readonly 사용하기

- 자바스크립트에서 객체는 불변성을 유지해야 한다.
- 객체를 업데이트하거나, 인자로 받아 사용할 때는 복제본을 만들어야 한다.
- 불변성을 명확하게 하고, 오류를 줄이기 위해서 ts에서는 readonly를 사용할 수 있다.


## readonly
```ts
const arr : readonly number[] = [1,2,3]
arr.push(4) // Property 'push' does not exist on type 'readonly number[]'.ts(2339)
```

- 배열은 읽기전용이된다.
- length는 읽을수는 있지만 바꿀 수는 없다.
- 배열을 변경하는 pop, push 등등 다른 메서드를 호출할 수 없다.

모든 number[]는 readonly number[] 이다. 따라서, number[]는 readonly number[]의 부분집합(서브타입)이다.

변경 가능한 배열을 readonly에 할당할 수 있지만, 반대는 안된다.

## readonly의 장점
- 타입스크립트는 매개변수가 함수 내에서 변경이 일어나는지 체크한다.
- 호출하는 쪽에서 함수가 매개변수를 변경하지 않는다는 보장을 한다.
- 호출하는쪽에서 함수에 readonly 배열을 매개변수로 넣을 수도 있다.
- 함수의 매개변수를 변경하지 않는다면, readonly로 선언해야 한다. 더 넓은 타입으로 호출할 수도 있고, 의도치 않은 변경은 방지될 것이다.
  - 그런데 어떤 함수를 readonly로 만들면, 그 함수를 호출하는 모든 함수도 readonly로 만들어야 한다.
  - 다른 라이브러리에 있는 함수를 호출할때는 타입 단언문으로 일반 타입으로 바꿔야할수도 있다.

## example
아래는 여러줄의 소설을 인자로 받아서, 단락을 나누는 함수이다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const paragraphs: string[][] = [];
  const currPara: string[] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(currPara);
      currPara.length = 0;  // Clear the lines
    }
  };

  for (const line of lines) {
    if (!line) {
      addParagraph();
    } else {
      currPara.push(line);
    }
  }
  addParagraph();
  return paragraphs;
}
```
하지만 위 함수에서 currPara 자체를 변형하면서, push 하고 있다. 래퍼런스 자료형의 주소가 복사되어 들어가는 것으로, 결과가 의도치 않게 나올 것이다. [[], [], []] 이런식으로 나온다. 중간에 currPara.length = 0 를 해주는게, paragraphs 의 요소에도 바로 반영이 되기 떄문이다.

이는 불변성을 유지하지 못하고, 객체(배열)을 그대로 사용했기 떄문이 발생하는 문제이다.
위와 같은 문제는 readonly를 사용하면 잠재적인 오류를 찾을 수 있다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const currPara: readonly string[] = []; // readonly
  const paragraphs: string[][] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(
        currPara
     // ~~~~~~~~ Type 'readonly string[]' is 'readonly' and
     //          cannot be assigned to the mutable type 'string[]'
      );
      currPara.length = 0;  // Clear lines
            // ~~~~~~ Cannot assign to 'length' because it is a read-only 
            // property
    }
  };

  for (const line of lines) {
    if (!line) {
      addParagraph();
    } else {
      currPara.push(line);
            // ~~~~ Property 'push' does not exist on type 'readonly string[]'
    }
  }
  addParagraph();
  return paragraphs;
}
```

읽기전용으로 선언된 배열을 조작하려는 부분에서 미리 오류를 알 수 있다. 오류를 수정하면 아래처럼 작성할 수 있다.

```ts
function parseTaggedText(lines: string[]): (readonly string[])[] {
  let currPara: readonly string[] = []; // 1. readonly
  const paragraphs: (readonly string[])[] = []; // 2. currPara[] 를 원소로 받을 수 있게 readonly

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push([...currPara]); // 1. 스프레드로 복제본을 push
      paragraphs.push(currPara as string[]); // 3. 변경가능한 string[] 단언
      currPara = [];  // Clear lines
    }
  };

  for (const line of lines) {
    if (!line) {
      addParagraph();
    } else {
      currPara = currPara.concat(line) // 1. 새로운 복제본
    }
  }
  addParagraph();
  return paragraphs;
}
```

오류를 제거하기 위한 방법은 3가지다.
1. currPara 을 readolny로 변경하고, 복제본을 push 한다.
2. readolny 인 currPara를 원소로 가질 수 있도록 paragraphs 를 `(readonly string[])[]` 타입으로 변경한다.
3. 2번을 하지 않을거라면, paragraphs 에 currPara 를 push 할 때 `as string[]` 단언을 사용한다.


여기서 `(readonly string[])[]`과 `readonly string[][]` 은 다르다.
```ts
const arr1: (readonly string[])[] = [["aaa", "bbb"], ["ccc", "ddd"]]
const arr2: readonly string[][] = [["aaa", "bbb"], ["ccc", "ddd"]]

arr1[0] = ["eee", "bbb"]
arr[0][0] = "fff" // error! : readonly

arr2[0] = ["eee", "bbb"] // error! : readonly
arr2[0][0] = "fff"
```

## Readonly 제네릭
Readonly 는 정의된 타입을 readonly로 바꿔주는데, 이 역시 앝게 동작하기 때문에, 객체 안의 객체에는 적용되지 않는다.

```ts
interface Outer {
  inner: {
    x: number;
  }
}
const o: Readonly<Outer> = { inner: { x: 0 }};
o.inner = { x: 1 };
// ~~~~ Cannot assign to 'inner' because it is a read-only property
o.inner.x = 1;  // OK
```

깊은 readolny를 사용하려면 라이브러리를 사용할 수 있다. `ts-essentials` 에 있는 `DeepReadOnly` 를 사용하면 된다.

인덱스 시그니처에도 readonly 를 쓸 수 있다.
```ts
let obj: {readonly [k: string]: number} = {};
// Or Readonly<{[k: string]: number}
obj.hi = 45;
//  ~~ Index signature in type ... only permits reading
obj = {...obj, hi: 12};  // OK
obj = {...obj, bye: 34};  // OK
```

## 요약
- 만약 함수가 매개변수를 수정하지 않는다면, readonly로 선언하는 것이 좋다.
- readonly 매개변수는 인터페이스를 명확하게 하며, 매개변수가 변경되는 것을 방지한다.
- const 와 readonly의 차이를 이해해야한다.
  - const는 재정의(재할당)을 허용하지 않는다.
  - readonly는 수정만 금지하고, 재할당은 허용된다.
- readonly는 얕게 동작한다는 것을 명심해야 한다.!
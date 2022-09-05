# Item 18. 매핑된 타입을 사용하여 값을 동기화하기

## 타입 동기화
- 두 타입의 연관성을 표시할 수 있다.
- 둘중 하나가 변경되면, 나머지 하나도 자동으로 변경되거나 에러 메시지를 표시할 수 있다.

```ts
interface ScatterProps {
  // The data
  xs: number[];
  ys: number[];

  // Display
  xRange: [number, number];
  yRange: [number, number];
  color: string;

  // Events
  onClick: (x: number, y: number, index: number) => void;
}

const REQUIRES_UPDATE: {[k in keyof ScatterProps]: boolean} = {
  xs: true,
  ys: true,
  xRange: true,
  yRange: true,
  color: true,
  onClick: false,
};

function shouldUpdate(
  oldProps: ScatterProps,
  newProps: ScatterProps
) {
  let k: keyof ScatterProps;
  for (k in oldProps) {
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
      return true;
    }
  }
  return false;
}
```

> `REQUIRES_UPDATE` 를 선언할 때 `ScatterProps`의 key로 선언하므로써, 동기화 할 수 있다.

## 요약
- 매핑된 타입을 사용해서 관련된 값과 타입을 동기화하도록 하자
- 인터페이스에 새로운 속성을 추가할 때, 선택을 강제하도록 매핑된 타입을 고려해야한다.
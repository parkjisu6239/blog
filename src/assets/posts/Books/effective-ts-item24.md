# Item 24. 일관성있는 별칭 사용하기

## 별칭
객체나 배열에 별칭을 사용하면, 그 값이 아니라 주소가 복사된다.
```ts
const borough = {name: 'Brooklyn', location: [40.688, -73.979]};
const loc = borough.location;
```

따라서 값을 바꾸면 원본에도 영향을 끼친다. 
```ts
> loc[0] = 0;
> borough.location
[0, -73.979]
```

별칭을 남발해서 사용하면 제어 흐름을 분석하기 어려우므로 별칭을 신중하게 사용해야 한다. 그래야 코드를 잘 이해할 수 있고, 오류도 쉽게 찾을 수 있다.

## 별칭은 타입 좁히기가 안된다
중복을 줄이기 위해 별칭을 사용하는 경우, 원본과 별칭을 서로 다른 것으로 간주된다. 따라서 아래의 경우 원하는 결과를 얻을 수 없다. 일관성을 위해 별칭을 사용한다면 모두 별칭을 사용하도록 바꾸는 것이 좋다.
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;
  if (polygon.bbox) { // box 로 변경하면 OK
    if (pt.x < box.x[0] || pt.x > box.x[1] ||
      // ~~~ 객체가 'undefined'일 수 있습니다.
      pt.y < box.y[0] || pt.y > box.y[1]) {
      // ~~~ 객체가 'undefined'a 수 있습니다.
      return false;
    }
  }
  // ...
}
```

## 객체 비구조화
새로운 값으로 할당하는 별칭보다는 객체 비구조화를 사용하는 것이 좋다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const {bbox} = polygon;
  if (bbox) {
    const {x, y} = bbox;
    if (pt.x < x[0] || pt.x > x[1] ||
    pt.y < y[0] || pt.y > y[1]) {
      return false;
    }
  }
  // ...
}
```

객체 비구조화를 이용할 때는 두 가지를 주의해야한다.
- 비구조화하는 값이 선택적 속성인 경우, 타입 좁히기를 사용해야 한다.
- 배열이나 다른 구조에서는 적합하지 않다.

## 별칭을 일관성을 깨뜨린다
별칭은 타입 체커뿐만 아니라 런타임에도 혼동을 야기할 수 있다.

```ts
const { bbox } = polygon;
if (!bbox) {
  calculatePolygonBbox(polygon); // polygon.bbox가 채워진다
  // 함수에서 polygon을 바꾸는 경우 polygon.bbox와 bbox는 다른 값을 참조하게 된다
}
```

타입 스크립트의 제어 흐름 분석을 지역변수에서는 꽤 잘 동작하지만 객체의 속성에서는 주의해야 한다.

```ts
function fn(p: Polygon) { /* ... */ }

polygon.bbox // 타입이 BoundingBox | undefined
if (polygon.bbox) {
  polygon.bbox // 타입이 BoundingBox
  fn(polygon); // 이 함수에서 값을 바꿔버릴 수도 있다.
  polygon.bbox // ❌ 타입이 BoundingBox 로 추론되지만, 다른값으로 바뀌었을 수 있다.
}
```

함수가 특정 속성을 제거할 수 있으므로, 타입을 BoundingBox | undefined로 되돌리는 것이 안전하다. 그러나 함수를 호줄할 때마다 속성 체크를 반복해야 하기 때문에 좋지 않다. 그래서 타입스크립트는 함수가 타입 정제를 무효화하지 않는다고 가정한다.

## 요약
- 별칭은 타입스크립트가 타입을 좁히는 것을 방해한다. 따라서 별칭을 사용할 때는 일관되게 사용해야 한다.
- 비구조화 문법을 사용해서 일관된 이름을 사용하는 것이 좋다.
- 함수 호출이 객체 속성의 타입 정제를 무효화할 수 있다는 점을 주의해야 한다. 속성보다 지역 변수를 사용하면 타입 정제를 믿을 수 있다.
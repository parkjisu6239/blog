# Item 15. 동적 데이터에 인덱스 시그니처 사용하기 

## 인덱스 시그니처
```ts
type Rocket = {[property: string]: string};
const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940 kN',
};  // OK
```
타입스크립트에서는 `인덱스 시그니처`를 명시하여 유연하게 매핑을 표현할 수 있다.
- 키의 이름: 키의 위치만 표현하는 용도로, 타입체커에서는 사용하지 않는다.
- 키의 타입 : string | number | symbol의 조합 이지만, 보통 string
- 값의 타입 : 어떤것이든 될 수 있다.

## 인덱스 시그니처의 단점
하지만 위처럼 string, string으로만 체크하면 네가지 단점이 드러난다.
- 잘못된 키를 허용한다. string이기만 되면 되기때문에, 오탈자를 잡을 수 없다.
- 특정키가 필요하지 않다. `{}` 도 유효한 Rocket 타입이다.
- 키마다 다른 값을 가질 수 없다. 모두 string이어야 한다.
- 자동완성 기능이 제공되지 않는다.

인덱스 시그니처는 간편하지만, value를 하나의 타입으로 통일해야 하며 키에 제한이 없어서 자동완성이 되지 않는다.

인덱스 시그니처는 부정확하므로 더 나은 방법으로 interface 를 사용할 수 있다.

```ts
interface Rocket {
  name: string;
  variant: string;
  thrust_kN: number;
}
const falconHeavy: Rocket = {
  name: 'Falcon Heavy',
  variant: 'v1',
  thrust_kN: 15_200
};
```

## 외부 데이터 읽어오기
```ts
function parseCSV(input: string): {[columnName: string]: string}[] {
  const lines = input.split('\n');
  const [header, ...rows] = lines;
  return rows.map(rowStr => {
    const row: {[columnName: string]: string} = {};
    rowStr.split(',').forEach((cell, i) => {
      row[header[i]] = cell;
    });
    return row;
  });
}
```
일반적으로 csv의 행과 열이름을 미리 알수는 없다. 인덱스 시그니처는 데이터의 구조를 정확히 알수없는 경우에 유용하게 사용될 수 있다.

```ts
interface ProductRow {
  productId: string;
  name: string;
  price: string;
}

declare let csvData: string;
const products = parseCSV(csvData) as unknown as ProductRow[];
```
반면 열 이름을 알고 있는 경우에는 미리 선언해둔 타입으로 단언문을 사용할 수 있다. 하지만 단언문이 런타임에서 실제로 일치한다는 보장은 없다.

```ts
function safeParseCSV(
  input: string
): {[columnName: string]: string | undefined}[] {
  return parseCSV(input);
}
```

이럴때는 undefined을 추가할 수 있다.

```ts
const rows = parseCSV(csvData);
const prices: {[produt: string]: number} = {};
for (const row of rows) {
  prices[row.productId] = Number(row.price);
}

const safeRows = safeParseCSV(csvData);
for (const row of safeRows) {
  prices[row.productId] = Number(row.price);
      // ~~~~~~~~~~~~~ Type 'undefined' cannot be used as an index type
}
```

undefined 을 추가하면, row.price가 undefined일 수 있기 때문에 인덱스로 접근할 수 없다. 

> 연관 배열(associative array)의 경우, 객체에 인덱스 시그니처를 사용하는 대신 Map 타입을 사용하는 것을 고려할 수 있다. 이는 프로토타입 체인과 관련된 유명한 문제를 우회한다. 구체적인 예시는 아이템 58에서 볼 수 있다.

## 인덱스 시그니처의 대안

어떤 타입에 가능한 필드가 제한되어 있는 경우라면 인덱스 시그니처로 모델링하지 말야야 한다.

```ts
interface Row1 { [column: string]: number }  // Too broad
interface Row2 { a: number; b?: number; c?: number; d?: number }  // Better
type Row3 =
    | { a: number; }
    | { a: number; b: number; }
    | { a: number; b: number; c: number;  }
    | { a: number; b: number; c: number; d: number };
```

마지막 형태가 가장 정확하지만, 사용하기는 번거롭다. string 타입이 너무 광범위해서 인덱스 시그니처를 사용하는데 문제가 있다면 두가지 다른 대안을 생각할 수 있다.

### Record
Record는 키타입에 유연성을 제공하는 제네릭 타입이다.
```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```
특히 string 부분집합을 사용할 수 있다.

```ts
type Vec3D = Record<'x' | 'y' | 'z', number>;
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }
```

### 매핑된 타입 사용
매핑된 타입은 키마다 별도의 타입을 사용하게 해준다.

```ts
type Vec3D = {[k in 'x' | 'y' | 'z']: number};
// Same as above
type ABC = {[k in 'a' | 'b' | 'c']: k extends 'b' ? string : number};
// Type ABC = {
//   a: number;
//   b: string;
//   c: number;
// }
```

키를 몇몇의 제한된 조건으로 정의할 수 있고, value도 조건부 연산자를 통해 서로 다른 값을 줄 수 있다. (하지만 interface 객체 형태로 정의하는게 나아보인다.)

## 요약
- 런타임때까지 객체의 속성을 알 수 없을 경우에만 인덱스 시그니처를 사용하도록 하자
- 안전한 접근을 위해 인덱스 시그니처의 값 타입에 undefined 를 추가하는 것을 고려해야한다.
- 가능하다면 interface, Record, 매핑된 타입같은 인덱스 시그니처보다 정확한 타입을 사용하는 것이 좋다.
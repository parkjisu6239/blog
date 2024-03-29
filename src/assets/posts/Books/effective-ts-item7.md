# Item7. 타입이 값들의 집합이라고 생각하기
변수에는 다양한 값을 할당할 수 있고, 타입은 `할당 가능한 값들의 집합` 이라고 볼 수 있다. 이 집합은 타입의 `범위` 라고 부르기도 한다. 아무것도 할당할 수 없는 타입은 `never` 가 있고, 의미상 공집합이라고 보면 된다.

## 유닛타입
그 다음으로 작은 집합은 값 하나만을 포함하는 `유닛타입` 이라고도 불리는 `리터럴` 타입이다.
```ts
type A = 'A';
type B = 'B';
type Twelve = 12;
```

## 유니온 타입
타입을 두개 이상으로 묶으려면 `유니온 타입` 을 사용할 수 있다. 유니온 타입은 합집합으로 볼 수 있다.
```ts
type AB = 'A' | 'B';
type AB12 = 'A' | 'B' | 12;
const a: AB = 'A';  // OK, value 'A' is a member of the set {'A', 'B'}
const c: AB = 'C';  // ~ Type '"C"' is not assignable to type 'AB'
```

## 인터섹션 타입
앞서 봤던 구조적 타이핑 규칙에 따라 특정 속성을 가지면 그 타입으로 이해할 수 있다. 아래 예시에서 `&` 은 교집합으로, `PersonSpan`는 공집합으로 생각될 수 있지만, 그렇지 않다.
```ts
interface Identified {
  id: string;
}
interface Person {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}
type PersonSpan = Person & Lifespan; // -> ❓ 공집합?

const ps: PersonSpan = {
  name: 'Alan Turing',
  birth: new Date('1912/06/23'),
  death: new Date('1954/06/07'),
};  // OK -> Person 와 Lifespan 의 속성을 모두 가지는 타입
```

물론 위의 세개 속성만 포함하면, 그 이상의 속성을 포함하는 모든 변수는 `PersonSpan`로 할당 가능하다. 인터섹션 타입의 값은 각 타입 내의 속성을 모두 포함하는 것이 일반적이다.

## 유니온과 인터섹션
반면, 두 인터페이스의 유니온에서는 그렇지 않다.

```ts
type K = keyof (Person | Lifespan);  // Type is never, 두 속성의 공통된 부분이 없기 떄문!

keyof A&B = keyof A | keyof B; // A, B 를 둘다 포함 하는 superSet -> (Like 최소 공배수)
keyof A|B = keyof A & keyof B; // A, B 속성 중 공통으로 있는 것을 포함한 집합 -> (Like 최대 공약수)
```

## extends
더 일반적으로는 익터션섹 보다는 `extends` 키워드를 사용한다. 집합이라는 관점에서 ~의 부분집합이라는 의미로 받아들일 수 있다.
```ts
interface Person {
  name: string;
}
interface PersonSpan extends Person {
  birth: Date;
  death?: Date;
}
```

타입간의 포함관계를 잘 나타낼 수 있으며, 별도로 쓴것과 동일한 결과이다.
```ts
interface Vector1D { x: number; }
interface Vector2D extends Vector1D { y: number; }
interface Vector3D extends Vector2D { z: number; }

interface Vector1D { x: number; }
interface Vector2D { x: number; y: number; }
interface Vector3D { x: number; y: number; z: number; }
```

`extends` 키워드는 제네릭 타입에서 한정자로도 쓰이며, ~의 부분집합 의미로 쓰인다.
```ts
function getKey<K extends string>(val: any, key: K) {
  // ...
}
```

## 배열과 튜플
타입이 집합이라는 관점은 배열과 튜플의 관계를 명확하게 만든다.
```ts
const list = [1, 2];  // Type is number[]
const tuple: [number, number] = list;
   // ~~~~~ Type 'number[]' is missing the following
   //       properties from type '[number, number]': 0, 1
```

`number[]` 는 `[number, number]` 의 부분집합이 아니므로 tuple에 list를 할당할 수 없다. 반면 반대로는 잘 동작한다. 집합의 포함관계로 타입을 바라보면 이해가 쉽다.

트리플은 구조적 타이핑 관점으로 생각하면 쌍으로 할당 가능할 것으로 생각됩니다. 아래는 어떻게 될지 생각해봅시다.
```ts
const triple: [number, number, number] = [1, 2, 3];
const double: [number, number] = triple;
   // ~~~~~~ '[number, number, number]' is not assignable to '[number, number]'
   //          Types of property 'length' are incompatible
   //          Type '3' is not assignable to type '2'
```
트리플에 튜플을 할당할 수 없다. 타입스크립트는 숫자의 쌍을 `{0: number, 1: number}` 로 모델링하지 않고, `{0: number, 1: number, length: 2}` 로 모델링하여, 길이도 일치해야만 할당 가능하게 한다.

## Exclude
타입으로 표현 불가능한 집합도 있다. 정수에 대한 타입 x와 y 속성 외에 다른 속성이 없는 객체는 타입이 존재하지 않는다.

```ts
type T = Exclude<string|Date, string|number>;  // Type is Date
type NonZeroNums = Exclude<number, 0>;  // Type is still just number
```
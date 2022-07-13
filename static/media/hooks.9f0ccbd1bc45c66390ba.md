# React Hooks

> Hook은 함수 컴포넌트에서 React state와 생명주기 기능(lifecycle features)을 `연동(hook into)`할 수 있게 해주는 함수이다. 함수형 컴포넌트 안에서만 사용 가능하다.

## 기본 Hook

### useState
```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
...
type SetStateAction<S> = S | ((prevState: S) => S);
```
useState는 `initialState` 를 인자로 가지며, 초기값과 해당 state의 set 함수를 반환한다. state 는 컴포넌트가 리랜더링 될 때도 유지된다. setState 함수는 state 또는 콜백함수를 인자로 가진다. 콜백 함수는 인자로 이전 state 를 가질 수 있다.

js 에서 원시 데이터(string, number, boolean...)은 불변성을 유지하며 새로운 값을 할당하는 것이 간단하다. 하지만 객체나 array 의 경우 일부 원소를 수정하려면 아래 처럼 해야하는 번거로움이 있다. [Immer](https://immerjs.github.io/immer/) 를 사용하면 로직을 단순화 할 수 있다.

```js

const [todos, setTodos] = useState({...});

const toggleTodos = (idx: number) => {
  const todo = todos.find(todo => todo.id === idx)
  todo.isDone = !todo.isDone
  const newTodos = {
    ...todos,
    todo
  }
  setTodos(newTodos)
}
```

#### Example

```js
import React, { useState } from 'react';

function Example() {
  // "count"라는 새 상태 변수를 선언합니다
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}> // setCount((prev) => prev + 1) 도 가능
        Click me
      </button>
    </div>
  );
}
```


### useEffect
```js
function useEffect(effect: EffectCallback, deps?: DependencyList): void;

type EffectCallback = () => (void | Destructor);
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
```
side effect 를 수행하기 위한 함수이다. 첫 번쨰 인자로는 콜백함수, 두번째 인자로는 디펜던스 리스트를 받는다.
`deps` 리스트의 원소가 변경될 때 `effect` 를 실행하는 역할을 한다.
- `deps` 가 null 인경우, 컴포넌트가 리랜더링 될 때마다(어떤 state, props가 변경될 때 마다) 콜백함수를 실행한다.
- `deps` 가 `[]` 빈 리스트일 경우, 컴포넌트가 최초 마운트 된 직후에 한번만 콜백함수를 실행한다.
- `deps` 가 [value1, ...] 인 경우, 각 value의 변경이 감지 될 때마다(리랜더링 될때마다) 콜백함수를 실행한다.
디펜던시로 현재 컴포넌트에서 정의한 state를 넣고, 콜백함수에서 그 state 값을 수정하면 무한루프가 될 수 있으니 주의해야 한다.
일반적으로 props의 변경을 감지할 때 사용하거나, 최초 마운트 된 이후에 동작해야할 함수를 사용한 후 clean-up 할 때 사용한다. 

#### Example

```js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) { // useEffect 안에서만 사용하는 함수는 내부에서 정의하여 클린업 하는게 좋다.
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // effect 이후에 어떻게 정리(clean-up)할 것인지 표시합니다.
    return function cleanup() { // clean-up 할게 없으면 return은 없어도 된다.
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

### useContext
```js
function useContext<T>(context: Context<T>/*, (not public API) observedBits?: number|boolean */): T;

interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string | undefined;
}
```
context 객체(React.createContext에서 반환된 값)을 받아 그 context의 현재 값을 반환한다. context의 현재 값은 트리 안에서 이 Hook을 호출하는 컴포넌트에 가장 가까이에 있는 <MyContext.Provider>의 value prop에 의해 결정된다.

#### Example
```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light); // 컨텍스트 생성, defaultValue는 트리 안에서 적절한 Provider를 찾지 못했을 때만 쓰이는 값이다.

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}> // 컨텐스트를 공유할 컴포넌트를 Provider로 감싼다.
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext); // 컨텍스트를 공유하는 컴포넌트들은 useContext 로 접근할 수 있다.
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
Provider 하위에서 context를 구독하는 모든 컴포넌트는 Provider의 value prop가 바뀔 때마다 다시 렌더링 된다. 이때 value의 변경 감지는 Object.is와 동일한 알고리즘을 사용하기 때문에, **value 안에 객체나 배열이 있는 경우 변경 감지가 잘 되지 않을 수 있다.** 얕은 비교로 변경하기 때문이다. 2 depth 이상의 배열, 객체를 사용하지 않도록 주의!

## 추가 Hooks

### useReducer
```js
const [state, dispatch] = useReducer(reducer, initialArg, init);

type Reducer<S, A> = (prevState: S, action: A) => S;
type Dispatch<A> = (value: A) => void;
```
reducer 는 액션 타입에 따라 현재 상태를 기반으로 새로운 상태를 반환해주는 함수다. useState의 set 함수 세트를 사전에 구성해둔다고 생각하면 쉽다. 

- reducer : state, action을 인자로 갖는 함수, 일반적으로 내부에 switch 로 action.type 을 분기한다.
- initialArg : 초기값
- init: 초기화 함수
- dispatch: 인자를 reducer 함수로 보내주는 역할

#### Example
```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### useCallback
```js
function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
```
메모이제이션 된 콜백을 반환한다. 디펜던시 리스트의 원소가 변경되면, 그에 따라 변경된 콜백함수로 자동 수정된다.
일반적으로 함수는 한번 정의하면, 내부 로직이 바뀌지 않는다. 그런데 useCallback을 사용하면, 디펜던시가 변경됨에 따라 다른 함수를 반환한다. 따로, 파라미터를 변경하지 않아도 자동으로 변경되는 것이다.

useMemo와 같이 비교되는 편인데, useMemo는 값을 / useCallback은 함수를 반환한다. `useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 같다.

#### Example
```js
function Profile({name, age}) {
  const [helloMsg, setHelloMsg] = useState("")

  const onClick = useCallback(() => {
    if (age > 20) {
      setHelloMsg(`안녕하세요, ${name}님`)
    } else {
      setHelloMsg(`안녕, ${name}!`)
    }
  }, [age]) // props가 변경되면

  return (
    <>
      <span>{helloMsg}</span>
      <button onClick={onClick}>Hello</button> // onClick 함수가 변경된다.
    </>
  );
}
```

### useMemo
```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
useCallback 과 마찬가지로 콜백함수와, 디펜던시 배열을 받아서, 메모이제이션 된 값을 반환한다. 의존성이 변경되었을 때만 메모이제이션 된 값을 다시 계산한다. 

#### Example
```js
function Profile({name, age}) {
  const helloMsg = useMemo(() => {
    if (age > 20) {
      return `안녕하세요, ${name}님`
    } else {
      return `안녕, ${name}!`
    }}, [age]) // props age 가 바뀌면 자동으로 값이 변경된다.

  return (
    <span>{helloMsg}</span>
  );
}
```

### useRef
```js
const refContainer = useRef(initialValue);
```
useRef는 .current 프로퍼티로 전달된 인자(initialValue)로 초기화된 변경 가능한 ref 객체를 반환한다. 반환된 객체는 컴포넌트의 전 생애주기를 통해 유지될 것입니다. 일반적으로 DOM(input, canvas) 등을 조작하기 위해 사용한다. props나 state는 set, get을 명확하게 구분하고 데이터의 흐름이 한방향으로 흐는는데 비해, ref는 두 값을 연결하여 양쪽이 서로를 수정, 반환할 수 있게 된다.

#### Example
```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```
일반적인 유스케이스는 자식에게 명령적으로 접근하는 경우이다. 본질적으로 useRef는 .current 프로퍼티에 변경 가능한 값을 담고 있는 “상자”와 같다. 따라서 값에 접근하거나 조작할 때는 .current로 객체 자제에 접근해야 한다.


## Referencs
- [React Hook API](https://ko.reactjs.org/docs/hooks-reference.html)
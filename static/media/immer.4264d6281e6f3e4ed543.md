# Immer



## Immer 란?

> Immer는 변경할 수 없는 데이터 구조 처리를 단순화합니다 .

React 에서 배열이나 객체를 쉽게 업데이트할 수 있게 하는 라이브러로, 불변성을 유지하는 코드를 작성하기 쉽게 한다.

- React state, React or Redux reducers 와 사용할 수 있다
- 스프레드 없이 원본 데이터에 영향을 주지 않고 복사본을 만들 수 있다.



### 불변성

상태를 변경하지 않는 것. React는 기본적으로 state를 임의로 수정하는 것이 아니라 setState 등으로 수정한다. 객체를 수정하더라도 일부 원소를 수정하는 것이 아니라 setState로 완전히 새로운 값으로 대체하는 것이다.

react는 state의 얕은 비교를 통해 컴포넌트를 리랜더링한다. js에서 객체는 참조 타입으로, 객체의 원소가 달라지는 것은 얕은 참조에서 확인되지 않는다. 여전히 같은 참조값을 가지기 때문이다. 따라서 객체의 일부만 변경하는 것은 리랜더링이 일어나지 않는다.

결국 이러한 이유로 우리는 map 등을 사용하여 새로운 객체를 만들고, setState로 완전히 새로운 값을 할당하는 방식을 사용하곤 한다.



### A quick example for comparison

```js
const todos = [
  {
    id: 1,
    title: "immer 공부하기",
    isDone: false,
  },
  {
    id: 2,
    title: "typescript 공부하기",
    isDone: true,
  },
  {
    id: 3,
    title: "http 공부하기",
    isDone: false,
  }
]
```



#### Without Immer

immer 를 사용하지 않고, todo의 일부를 수정하고 새로운 todo를 추가하는 작업은 아래처럼 할 수 있다.

```js
const newTodos = todos.slice()
newTodos[0] = {
  ...newTodos[0],
  isDone: true
}
newTodos.push({
  id: 4,
  title: "https 공부하기",
  isDone: false,
})
```



#### With Immer

Immer 를 사용하면 프로세스가 더 간단해진다. 

produce 는 두가지 인자를 가지는데 첫번째 파라미터는 현재 상태값, 두번째 파라미터는 변경하고자 하는 새로운 상태값이다. produce는 baseState를 기반으로 draft(복사본)을 만들고 이를 새로운 변수로 할당하는 것이다.

```js
import produce from "immer"

const newTodos = produce(baseState, draft => {
    draft[0].isDone = true
    draft.push({
      id: 4,
      title: "https 공부하기",
      isDone: false,
    })
})
```

> 객체가 아무리 깊어도 draft.todos[0].tags["urgent"].author.age = 56 로 간단하게 변경할 수 있다. immer가 없으면 변경하지 않을 데이터에 대해서는 스프레드로 복사하거나 deepcopy를 해주어야 한다.



### Immer 가 동작하는 방식

사실 기존에 사용하던 방법과 크게 다르지는 않다. immer가 `currentState`를 기반으로 deepcopy 하여 draft 를 생성해주는것이다. 

모든 수정이 완료되면 Immer는 draft에 대한 변경를 기반으로 nextState 를 생성합니다. 즉, 변경할 수 없는 데이터의 모든 이점을 유지하면서 데이터를 수정하기만 하면 데이터와 상호 작용할 수 있다.


### 장점

- 객체 구조가 복잡해도 수정이 용이하다.
- 가독성이 좋고, 간결하게 코드를 짤 수 있다.
- Small: 3KB gzipped



## React + Immer



### useState + Immer

```js

import React, { useCallback, useState } from "react";
import produce from "immer";

const TodoList = () => {
  const [todos, setTodos] = useState([
    {
      id: "React",
      title: "Learn React",
      done: true
    },
    {
      id: "Immer",
      title: "Try Immer",
      done: false
    }
  ]);

  const handleToggle = (id) => {
    setTodos(
      produce((draft) => {
        const todo = draft.find((todo) => todo.id === id);
        todo.done = !todo.done;
      })
    )
  }

  const handleAdd = () => {
    setTodos(
      produce((draft) => {
        draft.push({
          id: "todo_" + Math.random(),
          title: "A new todo",
          done: false
        });
      })
    )
  }

  return (<div>{*/ See CodeSandbox */}</div>)
}
```



### useImmer

useState 대신 use-immer 패키지를 사용할 수 있다. 방법은 위와 동일하고, produce 대신 setTodos 를 바로 쓸 수 있는 것이다.

```js
import React, { useCallback } from "react";
import { useImmer } from "use-immer";

const TodoList = () => {
  const [todos, setTodos] = useImmer([
    {
      id: "React",
      title: "Learn React",
      done: true
    },
    {
      id: "Immer",
      title: "Try Immer",
      done: false
    }
  ]);

  const handleToggle = (id) => {
    setTodos((draft) => {
      const todo = draft.find((todo) => todo.id === id);
      todo.done = !todo.done;
    });
  }

  const handleAdd = () => {
    setTodos((draft) => {
      draft.push({
        id: "todo_" + Math.random(),
        title: "A new todo",
        done: false
      });
    });
  }
  
  ...
}
```



### useReducer + Immer

useState 와 사용하는 것과 거의 동일하다.

```js
import React, {useCallback, useReducer} from "react"
import produce from "immer"

const TodoList = () => {
    const [todos, dispatch] = useReducer(
        produce((draft, action) => {
            switch (action.type) {
                case "toggle":
                    const todo = draft.find(todo => todo.id === action.id)
                    todo.done = !todo.done
                    break
                case "add":
                    draft.push({
                        id: action.id,
                        title: "A new todo",
                        done: false
                    })
                    break
                default:
                    break
            }
        }),
        [
            /* initial todos */
        ]
    )

    const handleToggle = (id) => {
        dispatch({
            type: "toggle",
            id
        })
    }

    const handleAdd = () => {
        dispatch({
            type: "add",
            id: "todo_" + Math.random()
        })
    }

    // etc
}
```



## Examples

### Object mutations

```js
import produce from "immer"

const todosObj = {
    id1: {done: false, body: "Take out the trash"},
    id2: {done: false, body: "Check Email"}
}

// add
const addedTodosObj = produce(todosObj, draft => {
    draft["id3"] = {done: false, body: "Buy bananas"}
})

// delete
const deletedTodosObj = produce(todosObj, draft => {
    delete draft["id1"]
})

// update
const updatedTodosObj = produce(todosObj, draft => {
    draft["id1"].done = true
})
```



### Array mutation

```js
import produce from "immer"

const todosArray = [
    {id: "id1", done: false, body: "Take out the trash"},
    {id: "id2", done: false, body: "Check Email"}
]

// add
const addedTodosArray = produce(todosArray, draft => {
    draft.push({id: "id3", done: false, body: "Buy bananas"})
})

// delete by index
const deletedTodosArray = produce(todosArray, draft => {
    draft.splice(3 /*the index */, 1)
})

// update by index
const updatedTodosArray = produce(todosArray, draft => {
    draft[3].done = true
})

// insert at index
const updatedTodosArray = produce(todosArray, draft => {
    draft.splice(3, 0, {id: "id3", done: false, body: "Buy bananas"})
})

// remove last item
const updatedTodosArray = produce(todosArray, draft => {
    draft.pop()
})

// remove first item
const updatedTodosArray = produce(todosArray, draft => {
    draft.shift()
})

// add item at the beginning of the array
const addedTodosArray = produce(todosArray, draft => {
    draft.unshift({id: "id3", done: false, body: "Buy bananas"})
})

// delete by id
const deletedTodosArray = produce(todosArray, draft => {
    const index = draft.findIndex(todo => todo.id === "id1")
    if (index !== -1) draft.splice(index, 1)
})

// update by id
const updatedTodosArray = produce(todosArray, draft => {
    const index = draft.findIndex(todo => todo.id === "id1")
    if (index !== -1) draft[index].done = true
})

// filtering items
const updatedTodosArray = produce(todosArray, draft => {
    return draft.filter(todo => todo.done)
})
```

## Advanced Features
### Current

`current(param)`: Draft 의 현재 상태를 반환하는 함수로서, 함수를 호출할 당시의 파라미터의 스냅샷을 반환한다. 단계별로 수정되거나 추가되는 데이터를 다룰 때 디버깅에 사용할 수 있다.

```js
const base = {
    x: 0
}

const next = produce(base, draft => {
    draft.x++
    const orig = original(draft)
    const copy = current(draft)
    console.log(orig.x)
    console.log(copy.x)

    setTimeout(() => {
        // this will execute after the produce has finised!
        console.log(orig.x)
        console.log(copy.x)
    }, 100)

    draft.x++
    console.log(draft.x)
})
console.log(next.x)

// This will print
// 0 (orig.x)
// 1 (copy.x)
// 2 (draft.x)
// 2 (next.x)
// 0 (after timeout, orig.x)
// 1 (after timeout, copy.x) -> draft.x++ 적용 되지 않음!
```

### Patches
`Patches` 는 `produce`를 사용하여 `Draft`가 변경되는 동안, 모든 변경 사항을 기록할 수 있다. commit을 남기는 것과 동일한 역할을 한다고 볼 수 있다. 따라서 `patches` 를 사용하면 지금까지 수행한 변경사항을 되돌리거나, 다른 변수에도 동일한 변경 사항을 적용할 수 있다.

```js
import produce, {applyPatches} from "immer"

import {enablePatches} from "immer"
enablePatches() // 패치 활성화

let state = {
    name: "Micheal",
    age: 32
}

let fork = state // 복사본 생성
let changes = [] // 변경 사항을 담을 배열
let inverseChanges = [] // 변경의 역순을 담을 배열

fork = produce(
    fork,
    draft => {
        draft.age = 33
    },
    (patches, inversePatches) => { // produce의 3번째 인자
        changes.push(...patches)
        inverseChanges.push(...inversePatches)
    }
)

state = produce(state, draft => {
    draft.name = "Michel"

state = applyPatches(state, changes) // state에 fork의 변경 사항 적용하기

expect(state).toEqual({
    name: "Michel", // 직접 바꾼 것
    age: 33 // patch 적용한 것
})

state = applyPatches(state, inverseChanges) // 되돌리기
expect(state).toEqual({
    name: "Michel", // 그대로
    age: 32 // Reverted
})
```

### Async producers
async/await를 사용하여 produce가 promise 객체를 반환할 수 있다.

```js
import produce from "immer"

const user = {
    name: "michel",
    todos: []
}

const loadedUser = await produce(user, async function(draft) {
    draft.todos = await (await window.fetch("http://host/" + draft.name)).json()
})
```

## 참고문서
- [immer](https://immerjs.github.io/)


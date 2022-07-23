# Compound Component Design Pattern in React

## Compound Coponent Degisn Pattern
Compound Coponent(이하 CC)는 로직과 UI를 표현적으로 분리하면서 상위 구성 요소가 하위 구성 요소와 통신할 수 있는 표현적이고 유연한 방법을 제공하는 React 패턴이다.

Headless 패턴으로 구현하여 확장성이 용이하고, 자식에게 필요이상의 props를 넘길 필요가 없다.

## 예시로 알아보기
전체 코드는 [여기](https://github.com/parkjisu6239/TIL/tree/master/compound-coponent)

카드 아이템을 초기에 3개만 보여준다. 더보기를 클릭하면 전체가 다 보이고, 접기를 누르면 초기 상태인 3개까지만 보여준다.

### Card
Card의 최상위 컴포넌트이다.
```js
import React from "react"
import {
  CardContent, // 아이템 리스트 랜더 컴포넌트
  Expand, // 펼치기 컨트롤러
  Collapse, // 접기 컨트롤러
  CardItem // 아이템
} from "./components"

import "./Card.css"

// children 에게 props drilling 대신 state를 공유하기 위해 사용
export const CardContext = React.createContext()

const Card = ({children}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true)

  const toggle = () => {
    setIsCollapsed(prev => !prev)
  }

  // children 에게 공유할 state
  const value = {isCollapsed, toggle}

  return (
    <CardContext.Provider value={value}>
      <div className="card">
        {children}
      </div>
    </CardContext.Provider>
  )
}

Card.CardContent = CardContent;
Card.Expand = Expand;
Card.Collapse = Collapse;
Card.CardItem = CardItem;

export default Card
```

### CardContent
```js
import React from "react"
import { CardContext } from  "../Card"

const LIMIT = 3

// children : React.ReactChildren[]
export const CardContent = ({children}) => {
  // 부모에서 준 context
  const { isCollapsed } = React.useContext(CardContext)

  if (isCollapsed) {
    return children.slice(0, LIMIT).map((child) => (
      <div>{child}</div>
    ))
  }

  return children.map((child) => (
    <div>{child}</div>
  ))
}
```

### Card Controller
```js
import React from "react"
import { CardContext } from  "../Card"

export const Expand = ({children}) => {
  const { isCollapsed, toggle } = React.useContext(CardContext)
  return isCollapsed && React.cloneElement(children, {onClick: toggle}) // 컴포넌트에 속성 주입
}

export const Collapse = ({children}) => {
  const { isCollapsed, toggle } = React.useContext(CardContext)
  return !isCollapsed && React.cloneElement(children, {onClick: toggle})
}
```

### Usage
```js
import Card from "./Card";
import content from "./content";

const CardExample = () => {
  return (
    <div>
      <Card>
        <Card.CardContent> // CardContent 의 children은 List
          {content.map((item, index) => {
            return <Card.CardItem key={index} item={item} />;
          })}
        </Card.CardContent>

        <Card.Expand>
          <button>show more</button>
        </Card.Expand>

        <Card.Collapse>
          <button>show less</button>
        </Card.Collapse>
      </Card>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <CardExample/>
    </div>
  );
}

export default App;
```

## 장단

- 장점
  - props drilling 을 피할 수 있다.
  - renderComponent와 합성하여 유연하게 사용할 수 있다.
  - 케이스가 많아 props 가 복잡해지는 문제를 방지할 수 있다.
  - 컴포넌트간 포함관계를 직관적으로 이해할 수 있다.
- 단점
  - 공유자원을 위해서는 context를 생성해야 한다.
  - js 로는 타입 children이 어떤 형태인지 몰라 헷갈린다(ts 쓰면 문제 없음)
  - 사용하는 곳에서 커스텀이 가능하나, 코드라인이 많아진다.
  - 스타일링이 매번 다르게 들언다면 결국 props가 늘어나긴 한다.(큰 틀만 잡아주고, children으로 주면 어느정도 해결 가능)

## Reference
- [Compound Component Design Pattern in React, Medium](https://betterprogramming.pub/compound-component-design-pattern-in-react-34b50e32dea0)
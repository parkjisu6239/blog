# React `Render Props` in functional component

전체 코드는 [여기](https://github.com/parkjisu6239/React-Play-Ground/blob/master/src/components/templates/RenderProps/RenderProps.tsx)

> [Render Props](https://ko.reactjs.org/docs/render-props.html) 란 React 컴포넌트 간에 코드를 공유하기 위해 > 함수 props를 이용하는 간단한 테크닉입니다. (React 공식 문서 설명)

## renderProps 를 사용하는 이유
일반적으로 컴포넌트에서 state, props 를 하위 컴포넌트로 내려주기 위해서 부모컴포넌트 안에서 자식 컴포넌트를 import 하여 nested 하게 컴포넌트를 구성한다.

```ts
import ListItem from "./ListItem"

interface Props {
  list: Item[]
}

const List = ({ list }: Props ) => {
  ...

  return (
    list.map(item => <ListItem {...item} />)
  )
}
```

하지만 이럴 경우 비슷하지만 약간씩 다른 자식 컴포넌트를 랜더링 하고 싶거나, 몇가지 추가적인 분기를 하고 싶을 때는 부모 컴포넌트의 로직을 수정해야 한다.

```ts
import ListItem from "./ListItem"
import ListItemCard from "./ListItemCard"

interface Props {
  list: Item[],
  isCard?: boolean // 조건이 추가될 떄마다 props 추가
}

const List = ({ list, isCard }: Props ) => {
  ... // 일부 로직도 수정이 필요할 수도 있음

  return (
    {list.map(item => {
      if (isCard) {
        return <ListItemCard {...item} />
      } else {
        return <ListItem {...item} />
      }
    })}
}
```

이렇게 되면 컴포넌트의 재사용성이 떨어지고 지나치게 많은 props를 drilling 하게 되어 컴포넌트가 지저분해진다.

이 문제를 해결하기 위한 방법으로 `renderProps` 를 사용할 수 있다. 이를 사용하면 부모 컴포넌트의 props를 자식 컴포넌트에 넘겨줄 수 있고, 재사용성을 높일 수 있다.

## 예제 1
이 예제는 리액트 공식문서에 나와있는 예제를 재구성한 것이다.

아래는 마우스의 좌표를 트래킹하고, 이를 p 태그에 표시하는 컴포넌트이다.
```ts
const Mouse = ({ children }: Props) => {
  const { mousePos, handleMouseMove } = useMouse();

  return (
    <div className={backCss} onMouseMove={handleMouseMove}>
      <p>
        The current mouse position is ({mousePos.x}, {mousePos.y})
      </p>
    </div>
  );
};

export default Mouse;
```

마우스를 트래킹 하는 부분과, presenter를 분리하기 위해 `useMouse` 커스텀훅을 사용했다. util 함수로 만들어도 무방하다.
```ts
const useMouse = () => {
  const [mousePos, setMousePos] = React.useState<Pos>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  return { mousePos, handleMouseMove };
};

export default useMouse;
```

이때, 위에서 구한 마우스 좌표를 이용하여 마우스에 고양이 사진을 넣고 싶다고 하자. 그렇다면 아래와 같이 수정할 수 있다. p 태그 대신 원하는 컴포넌트(Cat)로 대체 했다.

```ts
import Cat from "./Cat"

const MouseWithCat = ({ children }: Props) => {
  const { mousePos, handleMouseMove } = useMouse();

  return (
    <div className={backCss} onMouseMove={handleMouseMove}>
      <Cat pos={mousePos}>
    </div>
  );
};

export default MouseWithCat;
```

하지만 고양이가 아니라 강아지를 보여주고 싶다면 ? 이외에도 다른 컴포넌트와 조합하고 싶다면 사용할 떄마다 `MouseWith~` 컴포넌트가 필요할 것이다. 이상적인 형태는 `mousePos` 라는 state를 자식에게 내려 줄 수있는 `Mouse` 컴포넌트와, 마우스 좌표를 이용할 자식 컴포넌트가 분리되어서, 사용하는 곳에서 조합하는 것이다.

여기에 render prop를 사용할 수 있다. `<Mouse>` 컴포넌트 안에 `<Cat>` 컴포넌트를 하드 코딩(hard-coding)해서 결과물을 바꾸는 대신에, `<Mouse>`에게 동적으로 렌더링할 수 있도록 해주는 함수 prop을 제공하는 것이다. — 이것이 render prop의 개념이다.

```ts
// Mouse.ts
interface Props {
  children: (pos: Pos) => React.ReactChild; // 💡 좌표를 받아 React Component를 반환하는 함수!
}

const Mouse = ({ children }: Props) => {
  const { mousePos, handleMouseMove } = useMouse();

  return (
    <div className={backCss} onMouseMove={handleMouseMove}>
      {children(mousePos)} // 함수 실행 return React Component
    </div>
  );
};


// Cat.ts
interface Props {
  pos: Pos
}

const Cat = ({ pos }: Props) => ( // pos 를 받는 컴포넌트
  <img className={catCss(pos)} src={Nyan} alt="nyan" />
);



// RenderProps.ts (사용하는 곳)
const RenderProps = () => {
  return (
    <div>
      <Mouse>
        {(pos) => <Cat pos={pos} />} // pos 를 받아서, 그것을 Cat에 props로 넘기는 함수
      </Mouse>
    </div>
  );
};
```

이제 컴포넌트의 행위를 복제하기 위해 하드 코딩할 필요 없이 render 함수에 prop으로 전달해줌으로써, `<Mouse>` 컴포넌트는 동적으로 트래킹 기능을 가진 컴포넌트들을 렌더링할 수 있다. 즉, `props drilling` 을 피하고, 동적으로 컴포넌트를 사용할 수 있다. 이렇게 하면 pos 만 필요한 `Cat` 컴포넌트와, 마우스 트래킹 담당자는 `Mouse` 의 관심사를 완전히 분리할 수 있다.

### 결과

![nyan](react.assets/nyan.gif)

## 예제 2

```ts
// ListItem.ts
interface Props {
  name: string,
  id: string
}

const ListItem = ({ name, id }: Props) => ( // name, id만 받아서 표시하는 item 컴포넌트
  <p>{`${id}: ${name}`}</p>
);


// List.ts
interface Props {
  list: {name: string, id: string}[],
  children: (name: string, id: string) => React.ReactChild // 💡 name, id 를 받아서 컴포넌트를 반환하는 함수
}

const List = ({ list, children }: Props) => (
  <ul>
    {list.map((item) => (
      <li key={item.id}>{children(item.name, item.name)}</li> // 함수를 실행한다.
    ))}
  </ul>
);


// App.ts
const App = () => {
  const [list, setList] = useState(fetch(...))

  return (
    <List list={list}>
      {(name, id) => <ListItem name={name} id={id} />} // 부모의 list를 단순히 반복 랜더링하는 역할
    </List>
  )
}
```

위 예시 처럼 renderProps 를 사용하면, 아래와 같은 형태를 피할 수 있다.
```ts
const List = ({list}: Props) => {
  ...
  return (
    <ul>
      {list.map(item => 
        {
          return (<li key={list.id}><ListItem name={list.name} id={list.id}/></li>)
        }
      )}
    </ul>
  )
}
```

## 요약
- renderProps를 사용하면 컴포넌트의 재사용성을 높일 수 있다.
- 관심사 분리를 할 수 있다. (상위 컴포넌트에서는 로직을 담당, 하위 컴포넌트는 presenter 역할하는 것을 분리 가능)
- props dirilling 을 피할 수 있다. useContext 없이 props를 쉽게 공유할 수 있다.
- container 컴포넌트(App 같은 컴포넌트)에서 컴포넌트 구조를 쉽게 눈으로 파악할 수 있다.

## TIL
- 컴포넌트안에 또 컴포넌트 ... 를 피할 수 있고 가독성이 높아지는 것 같다.
- 조합 가능성이 적은(?) 컴포넌트일 떄는 compound 보다 간단히 만들 수 있다. compound는 context 공유를 위한 추가적인 코드가 많아지는데, render props는 그런게 없다.
- 같은 props를 받고, 다른 모습(?) 으로 랜더링 하는 컴포넌트가 없다면 굳이 사용할 필요가 없다.
  - ListItem 역할을 하는 컴포넌트들이 있는 경우(ListCard, ListRow, ItemDetail 모두 같은 props를 받아 다르게 랜더하는 컴포넌트) 유용하다.
  - 각 프레젠터 안에서 onClick, .. 등등 이벤트핸들러가 동일한 경우 이것도 List에서 정의해서 내려주면 되기때문. 그리고 이때 이벤트 핸들러는 cloneElement 로 주입해주어도 될듯.
  - 그런데 그게 아니고, 하나의 리스트 하나의 아이템이라면 굳이 renderProps를 쓸 이유가 없음.


<details>
<summary>cloneElement 를 써서 이벤트 핸들러를 준다면?</summary>
<p>

```ts
// List.ts
interface Props {
  list: {name: string, id: string}[],
  children: (name: string, id: string) => React.ReactElement
}

const List = ({ list, children }: Props) => { 
  const onClick = () => ...
  const onChange = () => ...

  return (
    <ul>
      {list.map((item) => (
        <li key={item.id}>
          {React.cloneElement(children(item.name, item.name), {onClick, onChange})}
        </li>
      ))}
    </ul>)
};
```

</p>
</details>

## 참고
- [React render props](https://ko.reactjs.org/docs/render-props.html)
- [HOC, cloneElement와 비교, Medium](https://medium.com/trabe/advanced-composition-in-react-cloneelement-hocs-and-renderprops-a20971aec50e)
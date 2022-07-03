import { css } from "@emotion/css"
import { NavLink } from "react-router-dom"

import { basicColor } from "styles/color"
import { postInfo } from "assets/posts/info"

const menusCss = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0;
  padding: 10px;
  list-style: none;
  a {
    text-decoration: none;
    color: ${basicColor.gray5};
    :hover {
      color: black;
      border-left: 2px solid ${basicColor.gray9};
      padding-left: 7px;
      margin-left: 5px;
    }
  }
`

const MenuList = () => {
  let activeStyle = {
    color: "black",
    borderLeft: `2px solid ${basicColor.gray9}`,
    paddingLeft: "7px",
    marginLeft: "5px",
  };
  
  return (
    <section>
      <ul className={menusCss}>
        {Object.keys(postInfo).map((category, idx) => (
          <li key={idx}>
            <NavLink 
              to={`/post/${category}`}
              style={({ isActive }) => isActive ? activeStyle : undefined}>
              {category.replace('-', " ")}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MenuList
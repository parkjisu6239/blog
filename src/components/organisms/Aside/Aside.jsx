import { css } from "@emotion/css"

import { basicColor } from "styles/color"

import Footer from "components/atoms/Footer"
import Header from "components/atoms/Header"
import MenuList from "components/molecules/MenuList"
import { mobile } from "styles/view"

const asideCss = css`
  background-color: ${basicColor.gray0};
  min-width: 300px;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 10fr 1fr;
  border-right: 1px solid ${basicColor.gray2};

  > * {
    padding: 10px;
  }

  section {
    border-bottom: 1px solid ${basicColor.gray2};
  }

  ${mobile} {
    display: none;
  }
`

const Aside = () => {
  return (
    <aside className={asideCss}>
      <Header/>
      <MenuList/>
      <Footer/>
    </aside>
  )
}

export default Aside
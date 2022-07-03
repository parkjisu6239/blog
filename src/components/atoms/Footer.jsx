import { GoMarkGithub } from "react-icons/go"
import { MdEmail, MdHome } from "react-icons/md"
import { css } from "@emotion/css"
import { Link } from "react-router-dom"

import { basicColor } from "styles/color"
import { github, email } from "constans/main"


const footerCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  max-height: 100px;
  a {
    color: ${basicColor.gray5};
    :hover {
      color: ${basicColor.gray7};
    }
  }
`

const Footer = () => {
  return (
    <footer className={footerCss}>
      <a href={github}><GoMarkGithub size={30}/></a>
      <Link to="/"><MdHome size={34}/></Link>
      <a href={`mailto:${email}`}><MdEmail size={32}/></a>
    </footer>
  )
}

export default Footer
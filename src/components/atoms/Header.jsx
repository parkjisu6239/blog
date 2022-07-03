import { css } from "@emotion/css";
import { Link } from "react-router-dom";

import { basicColor } from "styles/color";
import { blogTitle } from "constans/main";

const logoSectionCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: larger;
  font-weight: bold;
  height: 50px;
  border-bottom: 1px solid ${basicColor.gray2};
`;

const Header = () => {
  return (
    <header className={logoSectionCss}>
      <Link to="/">{blogTitle}</Link>
    </header>
  );
};

export default Header;

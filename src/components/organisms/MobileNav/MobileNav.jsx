import { css, cx } from "@emotion/css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

import { basicColor } from "styles/color";

import Header from "components/atoms/Header";
import MenuList from "components/molecules/MenuList";
import { desktop } from "styles/view";
import { useState } from "react";
import Footer from "components/atoms/Footer";

const navCss = css`
  background-color: ${basicColor.gray0};
  ${desktop} {
    display: none;
  }
`;

const hamburgerCss = css`
  position: absolute;
  left: 20px;
  top: 15px;
  cursor: pointer;
`;

const menuCss = css`
  display: none;
  > * {
    border-bottom: 1px solid ${basicColor.gray2};
  }
  footer {
    justify-content: flex-end;
    padding: 10px 20px;
    svg {
      width: 25px;
      height: 25px;
    }
  }
`;

const openMenuCss = css`
  display: block;
`;

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((prev) => {
      return !prev;
    });
  };

  const renderIcon = () => {
    return (
      <div onClick={toggleIsOpen} className={hamburgerCss}>
        {!isOpen ? <GiHamburgerMenu size={20} /> : <IoCloseSharp size={20} />}
      </div>
    );
  };

  return (
    <nav className={navCss}>
      {renderIcon()}
      <Header />
      <div className={cx(menuCss, { [openMenuCss]: isOpen })}>
        <div
          className={css`
            padding: 10px;
          `}
        >
          <MenuList />
        </div>
        <Footer />
      </div>
    </nav>
  );
};

export default MobileNav;

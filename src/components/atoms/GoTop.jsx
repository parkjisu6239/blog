import { css } from "@emotion/css";
import { BiArrowToTop } from "react-icons/bi";

import { basicColor } from "styles/color";
import { mobile } from "styles/view";

const goTopCSs = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 30px;
  right: 40px;
  border-radius: 50%;
  padding: 10px;
  color: ${basicColor.gray5};
  border: 2px solid ${basicColor.gray3};
  height: 20px;
  width: 20px;
  cursor: pointer;
  :hover {
    background-color: ${basicColor.gray3};
    color: white;
  }
  ${mobile} {
    bottom: 15px;
    right: 20px;
  }
`;

const GoTop = () => {
  const onClick = () => {
    // Desktop
    document.querySelector("#post-wrapper").scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Mobile
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={goTopCSs} onClick={onClick}>
      <BiArrowToTop size={20} />
    </div>
  );
};

export default GoTop;

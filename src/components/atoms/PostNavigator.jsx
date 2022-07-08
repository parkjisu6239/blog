import { IoIosArrowBack } from "react-icons/io";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";

import { basicColor } from "styles/color";
import { mobile, smallMobile } from "styles/view";

const navigatorCss = (isNext) => css`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  flex-direction: ${isNext ? "row-reverse" : "row"};
  border-radius: 3px;
  border: 1px solid ${basicColor.gray2};
  text-align: ${isNext && "end"};
  color: ${basicColor.gray7};
  :hover {
    color: ${basicColor.gray9};
    box-shadow: 0 2px 2px -2px ${basicColor.gray9};
  }
  svg {
    position: relative;
    left: 0;
    color: ${basicColor.gray5};
    transform: ${isNext && "rotate(180deg)"};
    transition: left 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  :hover {
    svg {
      color: ${basicColor.gray9};
      left: ${isNext ? "10px" : "-10px"};
    }
  }
`;

const postCss = css`
  display: grid;
  gap: 5px;
`;

const ellipsisCss = css`
  width: 20vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${mobile} {
    width: 25vw;
  }
  ${smallMobile} {
    width: 60vw;
  }
`;

const PostNavigator = ({ type, category, post }) => {
  return (
    <Link
      to={`/post/${category}/${post.fileName}`}
      className={navigatorCss(type === "next")}
    >
      <IoIosArrowBack size={30} />
      <div className={postCss}>
        <h4 className={ellipsisCss}>{post.title}</h4>
        <small>{post.createdAt}</small>
        <small className={ellipsisCss}>{post.desc}</small>
      </div>
    </Link>
  );
};

export default PostNavigator;
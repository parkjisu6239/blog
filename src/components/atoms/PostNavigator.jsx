import PropTypes from "prop-types";
import { IoIosArrowBack } from "react-icons/io";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";

import { basicColor } from "styles/color";
import { mobile, smallMobile } from "styles/view";
import { postTrans } from "constans/main";
import { postType } from "constans/types";

const navigatorCss = (isNext) => css`
  display: flex;
  padding: 20px;
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
  ${smallMobile} {
    padding: 15px;
    gap: 10px;
  }
`;

const postCss = (type) => css`
  text-align: ${type === "prev" ? "start" : "end"};
  display: grid;
  gap: 5px;
`;

const ellipsisCss = css`
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
      <div className={postCss(type)}>
        <small>{postTrans[type]}</small>
        <h4 className={ellipsisCss}>{post.title}</h4>
      </div>
    </Link>
  );
};

PostNavigator.propTypes = {
  type: PropTypes.string,
  category: PropTypes.string,
  post: PropTypes.shape(postType),
};

export default PostNavigator;

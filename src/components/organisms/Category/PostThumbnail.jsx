import { css } from "@emotion/css";
import { Link } from "react-router-dom";

import { basicColor } from "styles/color";
import { mobile } from "styles/view";

const thumbnailCss = css`
  display: grid;
  gap: 10px;
  padding: 15px;
  border: 1px solid ${basicColor.gray2};
  border-radius: 5px;
  text-decoration: none;
  span {
    font-size: small;
    color: ${basicColor.gray5};
  }
  :hover {
    border-left: 20px solid ${basicColor.theme1};
  }
`;

const headerCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  h2 {
    font-size: large;
    color: ${basicColor.gray9};
    text-decoration: none;
    font-weight: bold;
  }
  ${mobile} {
    flex-direction: column;
    align-items: flex-start;
    span {
      font-size: x-small;
    }
  }
`;

const PostThumbnail = ({ category, post }) => {
  return (
    <Link className={thumbnailCss} to={`/post/${category}/${post.fileName}`}>
      <div className={headerCss}>
        <h2>{post.title}</h2>
        <span>{post.createdAt}</span>
      </div>
      <span>{post.desc}</span>
    </Link>
  );
};

export default PostThumbnail;

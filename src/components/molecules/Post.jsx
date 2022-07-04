import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/css";

import { mobile } from "styles/view";
import { postInfo } from "assets/posts/info";
import { setMetaTags } from "utils/misc";

import Markdown from "components/atoms/Markdown";
import Empty from "components/atoms/Empty";
import GoTop from "components/atoms/GoTop";

const postCss = css`
  padding: 30px 0;
  ${mobile} {
    padding-top: 0;
  }
`;

const thumbnailImg = css`
  width: 100%;
`;

const Post = () => {
  const param = useParams();
  const { category } = param;
  const { fileName } = param;
  let mdPath;
  let curPost;

  try {
    if (!category) {
      mdPath = require("assets/posts/README.md");
    } else {
      mdPath = require(`assets/posts/${category}/${fileName}`);
      curPost = postInfo[category].find((post) => post.fileName === fileName);
    }
  } catch {
    return <Empty />;
  }

  useEffect(() => {
    if (!curPost) return;
    setMetaTags({
      title: curPost.title,
      description: curPost.desc,
    });
  }, [curPost]);

  return (
    <article className={postCss}>
      {!category && (
        <img src="thumbnail.png" alt="thumbnail" className={thumbnailImg} />
      )}
      <Markdown mdPath={mdPath} category={category} />
      <GoTop />
    </article>
  );
};

export default Post;

import { useParams } from "react-router-dom";
import { css } from "@emotion/css";

import Markdown from "components/atoms/Markdown";
import Empty from "components/atoms/Empty";
import GoTop from "components/atoms/GoTop";
import { mobile } from "styles/view";

const postCss = css`
  padding: 30px 0;
  ${mobile} {
    padding-top: 0;
  }
`;

const Post = () => {
  const param = useParams();
  const { category } = param;
  const { fileName } = param;
  let mdPath;

  try {
    if (!category) {
      mdPath = require("assets/posts/README.md");
    } else {
      mdPath = require(`assets/posts/${category}/${fileName}`);
    }
  } catch {
    return <Empty />;
  }

  return (
    <article className={postCss}>
      <Markdown mdPath={mdPath} />
      <GoTop />
    </article>
  );
};

export default Post;

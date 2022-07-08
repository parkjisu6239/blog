import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/css";

import { mobile, smallMobile } from "styles/view";
import { postInfo } from "assets/posts/info";
import { setMetaTags } from "utils/misc";
import { basicColor } from "styles/color";

import Markdown from "components/atoms/Markdown";
import Empty from "components/atoms/Empty";
import GoTop from "components/atoms/GoTop";
import If from "components/atoms/If";
import PostNavigator from "components/atoms/PostNavigator";

const postCss = css`
  display: grid;
  padding: 30px 0;
  ${mobile} {
    padding-top: 0;
  }
`;

const thumbnailImg = css`
  width: 100%;
`;

const postNavigatorWrapperCss = (idx) => css`
  margin-top: 40px;
  border-top: 1px solid ${basicColor.gray2};
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  gap: 10px;
  ${mobile} {
    padding: 40px;
  }
  ${smallMobile} {
    padding: 40px 10px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  a {
    grid-column-start: ${idx === 0 && "none"};
  }
`;

const Post = () => {
  const param = useParams();
  const { category } = param;
  const { fileName } = param;
  let mdPath;
  let curPost;
  let idx = 0;
  let allPostCount = 0;

  try {
    if (!category) {
      mdPath = require("assets/posts/README.md");
    } else {
      mdPath = require(`assets/posts/${category}/${fileName}`);
      idx = postInfo[category].findIndex((post) => post.fileName === fileName);
      curPost = postInfo[category][idx];
      allPostCount = postInfo[category].length;
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
      <If condition={!category}>
        <img src="thumbnail.png" alt="thumbnail" className={thumbnailImg} />
      </If>
      <Markdown mdPath={mdPath} category={category} />
      <If condition={allPostCount > 1}>
        <section className={postNavigatorWrapperCss(idx)}>
          <If condition={idx > 0}>
            <PostNavigator
              type="prev"
              category={category}
              post={postInfo[category]?.[idx - 1]}
            />
          </If>
          <If condition={idx < allPostCount - 1}>
            <PostNavigator
              type="next"
              category={category}
              post={postInfo[category]?.[idx + 1]}
            />
          </If>
        </section>
      </If>
      <GoTop />
    </article>
  );
};

export default Post;

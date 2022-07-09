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
  padding: 30px 0;
  ${mobile} {
    padding-top: 0;
  }
`;

const thumbnailImg = css`
  width: 100%;
`;

const postNavigatorSection = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid ${basicColor.gray2};
  gap: 30px;
  margin-top: 40px;
  padding: 30px;
  ${mobile} {
    gap: 10px;
    margin-top: 20px;
    padding: 20px;
  }
`;

const navigatorDecsCss = css`
  font-size: smaller;
  color: ${basicColor.gray5};
`;

const postNavigatorWrapperCss = (idx) => css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  ${smallMobile} {
    grid-template-columns: 1fr;
    gap: 10px;
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
        <section className={postNavigatorSection}>
          <span className={navigatorDecsCss}>
            ⬇ {category} 카테고리의 또 다른 글 ⬇
          </span>
          <div className={postNavigatorWrapperCss(idx)}>
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
          </div>
        </section>
      </If>
      <GoTop />
    </article>
  );
};

export default Post;

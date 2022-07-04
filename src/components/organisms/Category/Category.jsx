import { useState } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/css";
import Pagination from "@mui/material/Pagination";

import { postInfo } from "assets/posts/info";
import { basicColor } from "styles/color";
import { mobile } from "styles/view";

import Empty from "components/atoms/Empty";
import MarkDown from "components/atoms/Markdown";
import PostThumbnail from "./PostThumbnail";

const categoryCss = css`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  gap: 30px;
  ${mobile} {
    padding: 0;
  }
`;

const titleCss = css`
  text-align: center;
  color: #3d3d3d;
  padding-bottom: 5px;
  border-bottom: 1px solid #3d3d3d;
  width: 200px;
  align-self: center;
`;

const categoryDecsCss = css`
  padding: 10px 30px;
  border-radius: 5px;
  border: 1px solid ${basicColor.gray2};
  ${mobile} {
    padding: 5px 20px;
  }
`;

const postListWrapperCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const postCountCss = css`
  align-self: flex-end;
  font-size: small;
  color: ${basicColor.gray5};
`;

const postListCss = css`
  display: grid;
  gap: 10px;
  width: 100%;
`;

const Category = () => {
  const { category } = useParams();
  let pagePerPost = 5;
  let posts = postInfo[category].reverse();
  const [page, setPage] = useState(1);
  let mdPath;

  if (posts == null) {
    return <Empty />;
  }

  const changePage = (event, nextPage) => {
    setPage(nextPage);
  };

  try {
    if (category === "All") {
      posts = Object.keys(postInfo)
        .map((categoryKey) =>
          postInfo[categoryKey].map((post) => {
            return {
              category: categoryKey,
              ...post,
            };
          })
        )
        .reduce((prev, cur) => [...prev, ...cur], []);
      posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      pagePerPost = 7;
      console.log(posts);
    } else {
      mdPath = require(`assets/posts/${category}/README.md`);
    }
  } catch {
    return <Empty />;
  }

  return (
    <article className={categoryCss}>
      <h1 className={titleCss}>{category.replace("-", " ")}</h1>
      {mdPath && (
        <section className={categoryDecsCss}>
          <MarkDown mdPath={mdPath} />
        </section>
      )}
      <section className={postListWrapperCss}>
        <span className={postCountCss}>{posts.length} posts</span>
        <div className={postListCss}>
          {posts
            .slice((page - 1) * pagePerPost, page * pagePerPost)
            .map((post, idx) => {
              return (
                <PostThumbnail
                  category={post.category ?? category}
                  post={post}
                  key={idx}
                />
              );
            })}
        </div>
        <Pagination
          count={Math.ceil(posts.length / pagePerPost)}
          page={page}
          onChange={changePage}
          shape="rounded"
        />
      </section>
    </article>
  );
};

export default Category;

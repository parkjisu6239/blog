import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/css";
import Pagination from "@mui/material/Pagination";

import { postInfo } from "assets/posts/info";
import { getAllPost, isTextIncludes } from "utils/misc";
import { basicColor } from "styles/color";
import { mobile } from "styles/view";

import Empty from "components/atoms/Empty";
import MarkDown from "components/atoms/Markdown";
import PostSearch from "components/molecules/PostSearch";
import PostThumbnail from "../../molecules/PostThumbnail";

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

const pagePerPost = 5;

const Category = () => {
  const { category } = useParams();
  const [rawPostList, setRawPostList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [readme, setReadme] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const changePage = (event, nextPage) => {
    setPage(nextPage);
  };

  const searchPost = (event) => {
    event.preventDefault();
    setPostList(
      rawPostList.filter((post) => isTextIncludes(searchValue, post.title))
    );
    setPage(1);
  };

  const resetSearchValue = () => {
    setSearchValue("");
    setPostList(rawPostList);
    setPage(1);
  };

  useEffect(() => {
    try {
      let posts;
      if (category === "All") {
        posts = getAllPost();
        setReadme(null);
      } else {
        posts = postInfo[category].reverse();
        setReadme(require(`assets/posts/${category}/README.md`));
      }
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRawPostList(posts);
    } catch {
      setRawPostList(null);
    }
  }, [category]);

  useEffect(() => {
    setPostList(rawPostList);
  }, [rawPostList]);

  if (!postList) {
    return <Empty />;
  }

  return (
    <article className={categoryCss}>
      <h1 className={titleCss}>{category.replace("-", " ")}</h1>
      <PostSearch
        onSubmit={searchPost}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        reset={resetSearchValue}
      />
      {readme && (
        <section className={categoryDecsCss}>
          <MarkDown mdPath={readme} />
        </section>
      )}
      <section className={postListWrapperCss}>
        <span className={postCountCss}>{postList.length} posts</span>
        <div className={postListCss}>
          {postList
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
          count={Math.ceil(postList.length / pagePerPost)}
          page={page}
          onChange={changePage}
          shape="rounded"
        />
      </section>
    </article>
  );
};

export default Category;

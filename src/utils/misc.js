/* eslint-disable prettier/prettier */
import { postInfo } from "assets/posts/info";
import { og } from "constans/main";

export const isFileinCategory = (category, file) => {
  if (
    postInfo[category].find((post) => {
      return post.fileName === file;
    })
  ) {
    return true;
  }
  return false;
};

export const setMetaTags = ({
  title = og.title,
  description = og.description,
}) => {
  // set title
  document
    .querySelector("meta[property=\"og:title\"]")
    .setAttribute("content", `${title}`);

  // set description
  document
    .querySelector("meta[property=\"og:description\"]")
    .setAttribute("content", description);

  // set url
  document
    .querySelector("meta[property=\"og:url\"]")
    .setAttribute("content", window.location.href);
};

export const getAllPost = () => {
  return Object.keys(postInfo)
    .map((categoryKey) =>
      postInfo[categoryKey].map((post) => {
        return {
          category: categoryKey,
          ...post,
        };
      })
    )
    .reduce((prev, cur) => [...prev, ...cur], []);
}

const plattenText = (text) => {
  return text.toUpperCase().replaceAll(" ", "")
}

export const isTextIncludes = (_pattern, _target) => {
  const pattern = plattenText(_pattern)
  const target = plattenText(_target)
  return target.includes(pattern)
}
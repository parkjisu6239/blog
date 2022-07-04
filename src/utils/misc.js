import { postInfo } from "assets/posts/info";
import { og } from "constans/main"

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

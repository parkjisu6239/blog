import { postInfo } from "assets/posts/info";

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

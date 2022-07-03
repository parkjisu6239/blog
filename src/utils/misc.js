import { postInfo } from "assets/posts/info"

export const isFileinCategory = (category, file) => {
  if (postInfo[category].find(post => post.fileName === file)){
    return true
  } else {
    return false
  }
}
import { css } from "@emotion/css";
import { Outlet } from "react-router-dom";

import MobileNav from "components/organisms/MobileNav";
import { mobile } from "styles/view";

const postWrapperCss = css`
  width: 100%;
  overflow-x: hidden;
`;

const postBodyCss = css`
  margin: 30px auto;
  padding: 20px;
  max-width: 800px;
  ${mobile} {
    margin-top: 10px;
  }
`;

const PostWrapper = () => {
  return (
    <div id="post-wrapper" className={postWrapperCss}>
      <MobileNav />
      <main className={postBodyCss}>
        <Outlet />
      </main>
    </div>
  );
};

export default PostWrapper;

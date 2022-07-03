import { css } from "@emotion/css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Aside from "components/organisms/Aside";
import Category from "components/organisms/Category";
import PostWrapper from "components/templates/PostWrapper";
import Post from "components/molecules/Post";
import Empty from "components/atoms/Empty";
import { mobile } from "styles/view";

const appCss = css`
  display: flex;
  height: 100%;
  ${mobile} {
    display: block;
  }
`;

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className={appCss}>
        <Aside />
        <Routes>
          <Route path="/" element={<PostWrapper />}>
            <Route path="" element={<Post />} />
            <Route path="post">
              <Route path=":category" element={<Category />} />
              <Route path=":category/:fileName" element={<Post />} />
            </Route>
            <Route path="*" element={<Empty />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

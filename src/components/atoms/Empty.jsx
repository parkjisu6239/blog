import { css } from "@emotion/css";
import { ImFileEmpty } from "react-icons/im";

import { basicColor } from "styles/color";

const emptyCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 30px;
  padding: 200px 0;
  color: ${basicColor.gray3};
  span {
    color: ${basicColor.gray7};
  }
`;

const Empty = () => {
  return (
    <div className={emptyCss}>
      <ImFileEmpty size={30} />
      <span>There are no posts</span>
    </div>
  );
};

export default Empty;

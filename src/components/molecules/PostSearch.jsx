import PropTypes from "prop-types";
import { css } from "@emotion/css";
import { BsSearch } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";

import { basicColor } from "styles/color";

const formCss = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  height: 30px;
  > * {
    height: 100%;
  }
  button {
    cursor: pointer;
  }
`;

const inputCss = css`
  min-width: 200px;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid ${basicColor.gray2};
`;

const PostSearch = ({ onSubmit, value, onChange, reset }) => {
  return (
    <form onSubmit={onSubmit} className={formCss}>
      <input
        id="search"
        name="search"
        onChange={onChange}
        value={value}
        placeholder="🔎 Search Posts"
        className={inputCss}
      />
      <button type="submit">
        <BsSearch />
      </button>
      <button type="button" onClick={reset}>
        <GrPowerReset />
      </button>
    </form>
  );
};

PostSearch.propTypes = {
  onSubmit: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  reset: PropTypes.func,
};

export default PostSearch;

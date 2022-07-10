import PropTypes from "prop-types";

const If = ({ condition, children }) => {
  if (condition) {
    return children;
  }
  return null;
};

If.propTypes = {
  condition: PropTypes.boolean,
  children: PropTypes.ReactNodeLike,
};

export default If;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { basicColor } from "styles/color";

const markDownCss = css`
  display: block;
  word-wrap: break-word;
  overflow: hidden;
  color: ${basicColor.gray9};
  line-height: 1.7;

  blockquote {
    color: ${basicColor.gray7};
    margin: 10px;
    padding: 5px 10px;
    border-left: 5px ${basicColor.gray1} solid;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 5px 0;
  }

  a {
    color: ${basicColor.link};
    :hover {
      text-decoration: underline;
    }
  }

  h1 {
    font-size: 32px;
    margin-bottom: 30px;
    border-bottom: 1px solid ${basicColor.gray2};
  }

  h2 {
    font-size: 24px;
    margin-top: 30px;
    margin-bottom: 20px;
    line-height: 1.25;
    padding-bottom: 5px;
    border-bottom: 1px solid ${basicColor.gray2};
  }

  h3 {
    font-size: 20px;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 18px;
  }

  h5 {
    font-size: 16px;
  }

  h6 {
    font-size: 14px;
  }

  h4,
  h5,
  h6 {
    margin-top: 20px;
    margin-bottom: 5px;
  }

  img {
    max-width: 100%;
  }

  ul,
  ol {
    padding-left: 20px;
  }

  pre {
    margin: 20px 0;
  }

  :not(pre) code {
    background-color: ${basicColor.gray1};
    border-radius: 5px;
    padding: 2px 4px;
    color: ${basicColor.tomato};
    margin: 0;
  }

  table {
    display: block;
    width: 100%;
    margin: 20px 0;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    border-spacing: 0;
    border-collapse: collapse;
    tr {
      border-top: 1px solid ${basicColor.gray2};
    }

    th,
    td {
      padding: 6px 13px;
      border: 1px solid ${basicColor.gray2};
    }

    tr:nth-child(2n) {
      background: ${basicColor.gray1};
    }
  }
`;

const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={materialDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const MarkDown = ({ mdPath, category }) => {
  const categoryPath = category ? `/${category}` : "";
  const [md, setMd] = useState("");

  useEffect(() => {
    fetch(mdPath)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        setMd(text);
      });
  }, [mdPath]);

  return (
    md && (
      <ReactMarkdown
        className={markDownCss}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={CodeBlock}
        transformImageUri={(uri) =>
          uri.startsWith("http")
            ? uri
            : require(`assets/posts${categoryPath}/${uri}`)
        }
      >
        {md}
      </ReactMarkdown>
    )
  );
};

MarkDown.propTypes = {
  mdPath: PropTypes.string,
  category: PropTypes.string,
};

export default MarkDown;

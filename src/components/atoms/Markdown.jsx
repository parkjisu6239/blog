import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
  }

  h1 {
    padding-bottom: 3px;
    border-bottom: 1px solid ${basicColor.gray2};
  }

  h2 {
    font-size: 1.3rem;
  }

  img {
    width: 50%;
  }

  ul,
  ol {
    padding-left: 20px;
  }

  pre {
    margin: 20px 0;
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
        style={duotoneLight}
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

export default MarkDown;

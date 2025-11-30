import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // 选择主题

// 自定义代码块渲染器
const CodeBlock = ({ inline, className, children, ...props }) => {
  // 非行内代码且有类名（如 ```js）
  if (!inline && className) {
    const match = /language-(\w+)/.exec(className || "");
    return (
      <SyntaxHighlighter
        style={dracula} // 代码高亮主题
        language={match ? match[1] : "text"} // 解析语言（如 js、python）
        PreTag="div" // 包裹标签
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  }
  // 行内代码
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

// 自定义 Markdown 渲染组件
export const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        // 覆盖默认代码块渲染
        code: CodeBlock,
        // 可选：自定义其他元素（如标题、列表）
        h1: (props) => (
          <h1 style={{ fontSize: "1.8rem", margin: "1rem 0" }} {...props} />
        ),
        ul: (props) => (
          <ul style={{ paddingLeft: "2rem", margin: "0.5rem 0" }} {...props} />
        ),
        a: (props) => (
          <a
            style={{ color: "#165DFF", textDecoration: "underline" }}
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

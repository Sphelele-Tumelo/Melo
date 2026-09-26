
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import { FiCheck, FiCopy } from "react-icons/fi";

import "katex/dist/katex.min.css";


function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#E9E9E9] bg-white">
      <div className="flex items-center justify-between border-b border-[#E9E9E9] bg-[#F7F7F7] px-3 py-2">
        <span className="text-[11px] font-medium text-[#7A7F87]">
          {language || "text"}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-medium text-[#666B73] transition-colors hover:text-[#202124]"
        >
          {copied ? (
            <FiCheck className="h-3.5 w-3.5" />
          ) : (
            <FiCopy className="h-3.5 w-3.5" />
          )}

          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || "text"}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "14px",
          fontSize: "13px",
          lineHeight: "1.6",
          background: "#FCFCFC",
        }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}


export default function MarkdownMessage({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className="
        prose
        prose-neutral
        max-w-none

        text-[16px]
        leading-[1.75]

        prose-p:my-3
        prose-headings:font-semibold
        prose-headings:text-[#202124]

        prose-h1:mb-4
        prose-h1:mt-6
        prose-h1:text-2xl

        prose-h2:mb-3
        prose-h2:mt-5
        prose-h2:text-xl

        prose-h3:mb-2
        prose-h3:mt-4
        prose-h3:text-lg

        prose-strong:font-semibold
        prose-strong:text-[#202124]

        prose-a:text-[#F15A24]
        prose-a:no-underline
        hover:prose-a:underline

        prose-ul:my-3
        prose-ol:my-3
        prose-li:my-1

        prose-blockquote:border-l-[#F15A24]
        prose-blockquote:text-[#5F6368]

        prose-hr:my-6
        prose-hr:border-[#E5E5E5]

        prose-table:my-4
        prose-table:w-full
        prose-table:overflow-hidden
        prose-table:rounded-xl

        prose-th:bg-[#F7F7F7]
        prose-th:px-3
        prose-th:py-2
        prose-th:text-left
        prose-th:text-sm
        prose-th:font-semibold

        prose-td:border-t
        prose-td:border-[#E9E9E9]
        prose-td:px-3
        prose-td:py-2
        prose-td:text-sm

        prose-code:rounded
        prose-code:bg-[#F3F3F3]
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:text-[13px]
        prose-code:font-normal
        prose-code:text-[#24292F]

        prose-pre:bg-transparent
        prose-pre:p-0
      "
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
        ]}
        rehypePlugins={[
          rehypeKatex,
        ]}
        components={{
          code({
            className,
            children,
            ...props
          }) {
            const match = /language-(\w+)/.exec(
              className || ""
            );

            const codeContent = String(children);

            const isBlock =
              Boolean(match) ||
              codeContent.includes("\n");

            if (isBlock) {
              return (
                <CodeBlock
                  language={match?.[1] || ""}
                  value={codeContent.replace(/\n$/, "")}
                />
              );
            }

            return (
              <code
                className="
                  rounded
                  bg-[#F3F3F3]
                  px-1.5
                  py-0.5
                  text-[13px]
                  text-[#24292F]
                "
                {...props}
              >
                {children}
              </code>
            );
          },

          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-[#E9E9E9]">
                <table className="w-full min-w-[420px] border-collapse">
                  {children}
                </table>
              </div>
            );
          },

          img({ ...props }) {
            return (
              <img
                {...props}
                className="my-4 max-w-full rounded-xl"
                loading="lazy"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
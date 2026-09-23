// components/MarkdownMessage.tsx
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#E9E9E9]">
      <div className="flex items-center justify-between bg-[#F5F5F5] px-3 py-1.5">
        <span className="text-[11px] font-medium text-[#8A8F98]">{language || "text"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-[#5F6368] hover:text-[#202124]"
        >
          {copied ? <FiCheck className="h-3 w-3" /> : <FiCopy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{ margin: 0, padding: "12px", fontSize: "13px" }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isBlock = match || String(children).includes("\n");

          if (isBlock) {
            return (
              <CodeBlock
                language={match?.[1] || ""}
                value={String(children).replace(/\n$/, "")}
              />
            );
          }

          // Inline code (single backticks)
          return (
            <code className="rounded bg-[#F3F3F3] px-1.5 py-0.5 text-[13px]" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
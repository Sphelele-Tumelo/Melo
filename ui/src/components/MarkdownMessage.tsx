import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

function CodeBlock({
    language,
    value,
}: {
    language: string;
    value: string;
}) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(value);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }

    return (
        <div className="my-4 min-w-0 max-w-full overflow-hidden rounded-xl border border-[#E9E9E9]">
            <div className="flex min-w-0 items-center justify-between bg-[#F5F5F5] px-3 py-1.5">
                <span className="min-w-0 truncate text-[11px] font-medium text-[#8A8F98]">
                    {language || "text"}
                </span>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="ml-3 flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#5F6368] transition-colors hover:text-[#202124]"
                >
                    {copied ? (
                        <FiCheck className="h-3 w-3" />
                    ) : (
                        <FiCopy className="h-3 w-3" />
                    )}

                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <SyntaxHighlighter
                    language={language || "text"}
                    style={oneLight}
                    customStyle={{
                        margin: 0,
                        minWidth: "max-content",
                        padding: "12px",
                        fontSize: "13px",
                        lineHeight: "1.55",
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}


export default function MarkdownMessage({
    content,
}: {
    content: string;
}) {
    return (
        <div className="text-[15px] leading-7 text-[#2F3035]">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    /* -------------------------
                       Paragraphs
                    ------------------------- */

                    p({ children }) {
                        return (
                            <p className="mb-3 last:mb-0">
                                {children}
                            </p>
                        );
                    },

                    /* -------------------------
                       Headings
                    ------------------------- */

                    h1({ children }) {
                        return (
                            <h1 className="mb-4 mt-6 text-xl font-semibold tracking-[-0.02em] text-[#12111A] first:mt-0">
                                {children}
                            </h1>
                        );
                    },

                    h2({ children }) {
                        return (
                            <h2 className="mb-3 mt-6 text-lg font-semibold tracking-[-0.02em] text-[#12111A] first:mt-0">
                                {children}
                            </h2>
                        );
                    },

                    h3({ children }) {
                        return (
                            <h3 className="mb-2 mt-5 text-base font-semibold text-[#12111A] first:mt-0">
                                {children}
                            </h3>
                        );
                    },

                    /* -------------------------
                       Horizontal rules
                    ------------------------- */

                    hr() {
                        return (
                            <div className="my-5 h-px bg-[#E9E9E9]" />
                        );
                    },

                    /* -------------------------
                       Bold / emphasis
                    ------------------------- */

                    strong({ children }) {
                        return (
                            <strong className="font-semibold text-[#12111A]">
                                {children}
                            </strong>
                        );
                    },

                    em({ children }) {
                        return (
                            <em className="italic">
                                {children}
                            </em>
                        );
                    },

                    /* -------------------------
                       Lists
                    ------------------------- */

                    ul({ children }) {
                        return (
                            <ul className="mb-3 ml-5 list-disc space-y-1.5">
                                {children}
                            </ul>
                        );
                    },

                    ol({ children }) {
                        return (
                            <ol className="mb-3 ml-5 list-decimal space-y-1.5">
                                {children}
                            </ol>
                        );
                    },

                    li({ children }) {
                        return (
                            <li className="pl-1">
                                {children}
                            </li>
                        );
                    },

                    /* -------------------------
                       Blockquotes
                    ------------------------- */

                    blockquote({ children }) {
                        return (
                            <blockquote className="my-4 border-l-2 border-[#D8D8D8] pl-4 text-[#6F737A]">
                                {children}
                            </blockquote>
                        );
                    },

                    /* -------------------------
                       Links
                    ------------------------- */

                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#E95420] underline decoration-[#F2B39A] underline-offset-2 transition-colors hover:text-[#C74315]"
                            >
                                {children}
                            </a>
                        );
                    },

                    /* -------------------------
                       Inline code / code blocks
                    ------------------------- */

                    code({
                        className,
                        children,
                        ...props
                    }) {
                        const match =
                            /language-(\w+)/.exec(className || "");

                        const isBlock =
                            Boolean(match) ||
                            String(children).includes("\n");

                        if (isBlock) {
                            return (
                                <CodeBlock
                                    language={match?.[1] || ""}
                                    value={String(children).replace(
                                        /\n$/,
                                        ""
                                    )}
                                />
                            );
                        }

                        return (
                            <code
                                className="rounded-md bg-[#F3F3F3] px-1.5 py-0.5 font-mono text-[13px] text-[#303238]"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    /* -------------------------
                       Tables
                    ------------------------- */

                    table({ children }) {
                      return (
                          <div className="my-4 min-w-0 max-w-full overflow-x-auto rounded-xl border border-[#E9E9E9]">
                              <table className="w-full min-w-max border-collapse text-left text-[13px]">
                                  {children}
                              </table>
                          </div>
                      );
                    },

                    thead({ children }) {
                        return (
                            <thead className="bg-[#F7F7F7]">
                                {children}
                            </thead>
                        );
                    },

                    th({ children }) {
                        return (
                            <th className="border-b border-[#E9E9E9] px-3 py-2.5 font-semibold text-[#202124]">
                                {children}
                            </th>
                        );
                    },

                    td({ children }) {
                        return (
                            <td className="border-b border-[#EEEEEE] px-3 py-2.5 text-[#555A62]">
                                {children}
                            </td>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
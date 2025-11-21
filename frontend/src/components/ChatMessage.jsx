import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { User, Bot } from "lucide-react";
import { cn } from "../lib/utils";

export function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "group w-full py-6",
        isUser ? "bg-transparent" : "bg-muted/40"
      )}
    >
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          {content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return inline ? (
                      <code
                        className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground">
                  cyber buddy is thinking...
                </span>
              </div>
              <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                live
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

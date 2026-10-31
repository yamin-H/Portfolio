import { isValidElement } from "react";
import Image from "next/image";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import CornerFrame from "@/components/ui/CornerFrame";
import InkLine from "@/components/ui/InkLine";
import TLink from "@/components/ui/TLink";
import CopyCode from "@/components/writing/CopyCode";
import { blockMap, type BlockKind } from "@/components/diagrams/iso/blocks";
import type { BlockState } from "@/components/diagrams/iso/tones";

const theme = createCssVariablesTheme({
  name: "paper",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

type H = React.ComponentPropsWithoutRef<"h2">;

function Anchor({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="ml-2 font-mono text-[0.6em] text-accent opacity-0 transition-opacity duration-[240ms] group-hover:opacity-100 focus-visible:opacity-100"
    >
      #
    </a>
  );
}

async function Pre({ children }: { children?: React.ReactNode }) {
  if (!isValidElement(children)) return <pre>{children}</pre>;
  const props = children.props as { className?: string; children?: React.ReactNode };
  const lang = /language-([\w+-]+)/.exec(props.className ?? "")?.[1] ?? "text";
  const code = String(props.children ?? "").replace(/\n$/, "");

  let html: string;
  try {
    html = await codeToHtml(code, { lang, theme });
  } catch {
    html = await codeToHtml(code, { lang: "text", theme });
  }

  return (
    <figure className="my-8 border border-ink/60 bg-paper-deep/50 font-mono">
      <figcaption className="flex items-center justify-between border-b border-rule px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        <span>{lang === "text" ? "code" : lang}</span>
        <CopyCode text={code} />
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

export function Figure({
  src,
  alt,
  caption,
  n,
  w = 1600,
  h = 900,
}: {
  src: string;
  alt?: string;
  caption?: string;
  n?: number;
  w?: number;
  h?: number;
}) {
  return (
    <figure className="my-10">
      <CornerFrame className="p-2 sm:p-3">
        <Image
          src={src}
          alt={alt ?? caption ?? ""}
          width={w}
          height={h}
          sizes="(min-width: 1024px) 672px, 100vw"
          unoptimized={src.endsWith(".svg")}
          className="h-auto w-full"
        />
      </CornerFrame>
      {(caption || n) && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-soft">
          {n ? <span className="text-accent">Fig. {n} · </span> : null}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Block({
  kind,
  state = "idle",
  label,
  caption,
}: {
  kind: BlockKind;
  state?: BlockState;
  label?: string;
  caption?: string;
}) {
  const B = blockMap[kind];
  return (
    <figure className="my-10">
      <div className={`mat mat-${kind} border border-rule bg-paper-deep/40 p-4`}>
        <B state={state} label={label} />
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Callout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-paper/60 px-5 py-4">
      {title && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          {title}
        </p>
      )}
      <div className="mt-2 text-[16px] leading-relaxed text-ink-soft [&_p]:my-0">
        {children}
      </div>
    </aside>
  );
}

export const mdxComponents = {
  h2: ({ id, children, ...r }: H) => (
    <h2
      id={id}
      {...r}
      className="group mt-14 scroll-mt-24 font-display text-3xl tracking-tight sm:text-4xl"
    >
      {children}
      <Anchor id={id} />
    </h2>
  ),
  h3: ({ id, children, ...r }: H) => (
    <h3
      id={id}
      {...r}
      className="group mt-10 scroll-mt-24 font-display text-2xl tracking-tight sm:text-3xl"
    >
      {children}
      <Anchor id={id} />
    </h3>
  ),
  h4: (p: H) => (
    <h4
      {...p}
      className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-accent"
    />
  ),
  p: (p: React.ComponentPropsWithoutRef<"p">) => (
    <p {...p} className="my-6 text-[17px] leading-[1.8]" />
  ),
  a: ({ href = "", children }: React.ComponentPropsWithoutRef<"a">) => {
    const cls =
      "text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-[240ms] hover:decoration-accent";
    if (href.startsWith("/") || href.startsWith("#")) {
      const label = href.startsWith("/writing")
        ? "Writing"
        : href.startsWith("/projects")
        ? "Work"
        : "Home";
      return (
        <TLink href={href} label={label} className={cls}>
          {children}
        </TLink>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  },
  ul: (p: React.ComponentPropsWithoutRef<"ul">) => (
    <ul
      {...p}
      className="my-6 space-y-2 text-[17px] leading-[1.7] [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:bg-accent [&>li]:before:content-['']"
    />
  ),
  ol: (p: React.ComponentPropsWithoutRef<"ol">) => (
    <ol
      {...p}
      className="my-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] marker:font-mono marker:text-accent"
    />
  ),
  strong: (p: React.ComponentPropsWithoutRef<"strong">) => (
    <strong {...p} className="font-semibold" />
  ),
  blockquote: (p: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...p}
      className="my-10 border-l-2 border-accent pl-6 font-display text-2xl italic leading-snug [&_p]:my-0 [&_p]:text-[length:inherit] [&_p]:leading-[inherit]"
    />
  ),
  hr: () => <InkLine className="my-12 text-ink-soft/50" />,
  table: (p: React.ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table {...p} className="w-full border-collapse text-left text-[15px]" />
    </div>
  ),
  th: (p: React.ComponentPropsWithoutRef<"th">) => (
    <th
      {...p}
      className="border-b border-ink/60 px-3 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-ink-soft"
    />
  ),
  td: (p: React.ComponentPropsWithoutRef<"td">) => (
    <td {...p} className="border-b border-rule px-3 py-2.5 align-top" />
  ),
  img: ({ src, alt }: React.ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="my-6 h-auto w-full border border-rule"
    />
  ),
  code: (p: React.ComponentPropsWithoutRef<"code">) => (
    <code
      {...p}
      className="border border-rule bg-paper-deep/60 px-1.5 py-0.5 font-mono text-[0.85em]"
    />
  ),
  pre: Pre,
  Figure,
  Block,
  Callout,
};
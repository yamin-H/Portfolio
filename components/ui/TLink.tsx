"use client";

import Link from "next/link";
import { usePageTransition } from "@/components/ui/PageTransition";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  label?: string;
};

export default function TLink({ href, label, onClick, children, ...rest }: Props) {
  const { go } = usePageTransition();

  // in-page anchors and external links stay plain
  if (href.startsWith("#") || /^(https?:|mailto:)/.test(href)) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

    return (
        <Link
            href={href}
            {...rest}
            onClick={(e) => {
                onClick?.(e);
                if (
                    e.defaultPrevented ||
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.altKey ||
                    e.button !== 0
                )
                    return;
                e.preventDefault();
                go(href, label);
            }}
        >
            {children}
        </Link>
    );
}
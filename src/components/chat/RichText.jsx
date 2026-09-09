import { Fragment } from 'react';

/**
 * Minimal markdown renderer for assistant replies — bold, links, and bullet or
 * numbered lists. Deliberately dependency-free: the assistant is prompted to
 * use only this small subset, so a full markdown library isn't worth the weight.
 *
 * Text is rendered as React nodes (never innerHTML) and hrefs are restricted to
 * http(s) and site-relative paths, so nothing in a reply can inject markup or a
 * javascript: URL.
 */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
const BOLD_PATTERN = /^\*\*([^*]+)\*\*$/;
const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
const BULLET_PATTERN = /^\s*[-*]\s+(.*)$/;
const ORDERED_PATTERN = /^\s*\d+\.\s+(.*)$/;

const isSafeHref = (href) => /^(https?:\/\/|\/)/i.test(href);

/** True for site-relative paths and absolute URLs pointing back at this app. */
const isSameOrigin = (href) => {
  if (href.startsWith('/')) return true;
  try {
    return new URL(href, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
};

const renderInline = (text) =>
  text
    .split(INLINE_PATTERN)
    .filter(Boolean)
    .map((part, index) => {
      const bold = BOLD_PATTERN.exec(part);
      if (bold) {
        return (
          <strong key={index} className="font-semibold text-slate-900">
            {bold[1]}
          </strong>
        );
      }

      const link = LINK_PATTERN.exec(part);
      if (link) {
        const [, label, href] = link;

        if (!isSafeHref(href)) {
          return <Fragment key={index}>{label}</Fragment>;
        }

        // Turf links come back absolute (built from the API's FRONTEND_URL), so
        // compare origins rather than assuming every http(s) link leaves the
        // app — otherwise our own booking pages open in a new tab.
        const isExternal = !isSameOrigin(href);

        return (
          <a
            key={index}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="font-semibold text-lime-700 underline underline-offset-2 hover:text-lime-800"
          >
            {label}
          </a>
        );
      }

      return <Fragment key={index}>{part}</Fragment>;
    });

/** Groups raw lines into paragraphs and runs of list items. */
const toBlocks = (text) => {
  const blocks = [];
  let list = null;

  const flush = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  String(text || '')
    .split('\n')
    .forEach((line) => {
      const bullet = BULLET_PATTERN.exec(line);
      if (bullet) {
        if (!list || list.type !== 'ul') {
          flush();
          list = { type: 'ul', items: [] };
        }
        list.items.push(bullet[1]);
        return;
      }

      const ordered = ORDERED_PATTERN.exec(line);
      if (ordered) {
        if (!list || list.type !== 'ol') {
          flush();
          list = { type: 'ol', items: [] };
        }
        list.items.push(ordered[1]);
        return;
      }

      flush();
      if (line.trim()) {
        blocks.push({ type: 'p', text: line });
      }
    });

  flush();
  return blocks;
};

export default function RichText({ text }) {
  return (
    <div className="space-y-2">
      {toBlocks(text).map((block, index) => {
        if (block.type === 'p') {
          return (
            <p key={index} className="leading-relaxed">
              {renderInline(block.text)}
            </p>
          );
        }

        const ListTag = block.type === 'ul' ? 'ul' : 'ol';

        return (
          <ListTag
            key={index}
            className={`space-y-1 pl-4 ${block.type === 'ul' ? 'list-disc' : 'list-decimal'}`}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}

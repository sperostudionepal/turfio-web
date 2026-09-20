/**
 * Compact page list for pagination controls: always the first and last page, the current page and its
 * neighbours, and "…" for the gaps. Returns numbers and { ellipsis: true, key } markers, e.g.
 * page 6 of 20 -> [1, …, 5, 6, 7, …, 20].
 * A gap of exactly one page shows that page instead of "…" (an ellipsis hiding one page is pointless).
 */
export function getPageItems(current, total, siblings = 1) {
  if (total <= 1) return [1];
  // Up to 7 pages: just show them all (the compact form would be no shorter)
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set([1, total]);
  for (let page = current - siblings; page <= current + siblings; page += 1) {
    if (page > 1 && page < total) pages.add(page);
  }
  const sorted = [...pages].sort((a, b) => a - b);

  const items = [];
  sorted.forEach((page, index) => {
    if (index > 0) {
      const gap = page - sorted[index - 1];
      if (gap === 2) items.push(sorted[index - 1] + 1);
      else if (gap > 2) items.push({ ellipsis: true, key: `gap-before-${page}` });
    }
    items.push(page);
  });
  return items;
}

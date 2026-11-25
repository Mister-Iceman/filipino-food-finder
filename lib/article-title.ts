// Some article titles were saved with the site name on the end
// ("Lumpia History | FilipinoFoodNearMe.org"). Show them without it on cards
// and headings, and add the site name once in the browser title.
export function displayTitle(title: string | null | undefined): string {
  return (title ?? '')
    .replace(/\s*[|–—-]\s*Filipino\s*Food\s*Near\s*Me(\.org)?(\s+Newsroom)?\s*$/i, '')
    .trim()
}

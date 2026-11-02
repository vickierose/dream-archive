# Dream input limits

New and updated dreams have a title of at most 40 UTF-16 code units (the same
count used by HTML maxlength and Zod) after trimming, and at most 10 symbol IDs.
The shared schema validates both browser submissions and create/update Server
Action arguments. The title field and symbol picker also prevent extra input
and show localized hints. Removing selected symbols remains possible at the limit.

Plots still require nonblank text and have no application-level maximum length.
Next.js's existing default 1 MB Server Action request-body limit remains in place;
it covers the entire encoded request, not just plot text. No transport limit is
raised and no database migration is required.

Existing titles and symbol links are not truncated or rewritten. Editing a legacy
dream above either limit requires shortening its title or removing symbols before
saving. Reading and exploring existing records continues to show all their data.

## Processing costs

- List, related-dream, symbol, and Explore queries omit plot text. Large plots are
  loaded only by dream detail/edit views; the journal form uses uncontrolled text
  inputs, avoiding full-form renders on every plot keystroke.
- Building a constellation generates k*(k-1)/2 pairs for each dream. The new
  symbol limit bounds this to 45 pairs per newly saved dream. Duplicate IDs and
  unknown symbols are excluded by the existing graph builder.
- Legacy dreams above 10 symbols still contribute all their pairs. The limit
  bounds new writes, not the total archive size or the cost of legacy data.
  Do not silently truncate those records to enforce a rendering budget.
- If large archives outgrow the current full-graph view, aggregate symbol/pair
  counts in SQL and load bounded graph subsets or a text view. This needs an
  explicit display policy and profiling; a per-dream limit alone cannot bound an
  arbitrarily large archive's graph.

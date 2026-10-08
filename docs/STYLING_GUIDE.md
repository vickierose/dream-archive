# Styling guide

Dream Archive uses a paper-and-ink palette, handwritten headings, and restrained decoration. The shared components and theme in this guide are the starting point for new UI and for changes to existing screens.

## Where styles belong

- `app/globals.css`: theme colors, fonts, surface radii, shadows, and small reusable utilities.
- `components/ui/`: reusable presentation and controls, without feature-specific data or actions.
- `components/layout/`: page headers and the application shell.
- `components/auth/`, `components/dreams/`, `components/symbols/`: feature composition and behavior.
- Pages: arrange components and set spacing between sections.

Use Tailwind utilities for local layout. Extract a component when a repeated pattern has a stable purpose, such as a dialog or panel. Avoid creating abstractions for every wrapper or spacing value.

## Typography

Nunito is the body default. Caveat is reserved for headings, branding, card titles, and dream narrative text. Use `font-base` only when it is useful to explicitly restore the body font inside a handwritten region.

| Role                    | Convention                                                 | Preferred component                              |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Page title              | Caveat, `text-4xl sm:text-5xl`, `leading-none`, `text-ink` | `PageHeader` or `Heading as="h1"`                |
| Section or dialog title | Caveat, `text-3xl leading-tight`, `text-ink`               | `SectionHeading`, `Dialog`, or `Heading as="h2"` |
| Card or smaller heading | Caveat, `text-2xl leading-tight`, `text-ink`               | `Heading size="subsection"`                      |
| Body copy               | Nunito, `text-sm leading-relaxed`                          | Native paragraph                                 |
| Supporting copy         | Nunito, `text-sm text-ink-soft`                            | Header description or paragraph                  |
| Metadata and hints      | Nunito, `text-xs text-ink-soft` or `text-ink-muted`        | Native text or `TextField` hint                  |
| Form label or legend    | Nunito, `text-sm font-semibold text-ink`                   | `FormField` or `field-label`                     |
| Feedback                | Nunito, `text-sm leading-relaxed`                          | `Feedback` or `FormError`                        |
| Dream narrative         | Caveat, `text-lg sm:text-xl leading-relaxed`               | Dream article paragraph                          |

Choose heading elements for document structure, not font size. A card title can be `Heading as="h2" size="subsection"`. `Heading` defaults to page size for `h1`, section size for `h2`, and subsection size for `h3`.

Use one page-level `h1`. Dialog titles are `h2`. `SectionHeading` accepts `id` for a section's `aria-labelledby`.

## Spacing and layout

Use the existing Tailwind spacing scale. These are the standard relationships:

| Relationship                        | Spacing                                             |
| ----------------------------------- | --------------------------------------------------- |
| Archive page gutters                | `px-6 sm:px-10`                                     |
| Archive page vertical padding       | `py-8`                                              |
| Back navigation to page header      | `mb-4` on the navigation wrapper                    |
| Page header to content              | `mb-8`, owned by `PageHeader`                       |
| Between major sections              | `mt-8`                                              |
| Section heading to content          | `mt-4` on the content                               |
| Heading to short description        | `mt-1`                                              |
| Between form fields/groups          | `space-y-6` on the form                             |
| Label to control                    | `mb-2`, owned by `FormField`                        |
| Control to error / hint             | `mt-2` / `mt-1`, owned by `FormField`               |
| Between related controls or actions | `gap-3`                                             |
| Panel or dialog padding             | `p-6 sm:p-8`                                        |
| Dialog title to body                | `mt-6`, owned by `Dialog`                           |
| Between dialog body blocks          | `space-y-6`, owned by `Dialog`                      |
| Card grid gap                       | `gap-6`; compact symbol grids use `gap-x-6 gap-y-8` |

**Give each gap one owner.** Do not add `mt-8` to a form immediately after `PageHeader`: the header already provides that space. Forms have no external top margin. Within a `space-y-6` form, `FormActions` needs no extra margin. Outside a stack, the caller supplies its margin.

Existing content widths are `max-w-md` for authentication, `max-w-3xl` for detail/editor pages, and `max-w-5xl` for archive overview pages. Use `mx-auto` for centered content. These widths do not require a new container component.

Decoration can use specific measurements: tape position, paperclips, and emoji artwork are not general spacing rules. Avoid carrying those values into ordinary forms or layouts.

## Color

Use named theme utilities instead of hex/RGB values in component classes.

- `paper`, `paper-light`, `paper-dark`: page and paper surfaces.
- `paper-lilac`, `paper-rose`, and their border tokens: decorative card variants.
- `ink`, `ink-soft`, `ink-muted`: primary text, supporting text, and hints.
- `purple`, `purple-dark`: primary actions and links.
- `lavender-*`: selection, hover, focus, and navigation backgrounds.
- `line`: standard borders.
- `danger`, `danger-light`: errors and destructive actions.
- `chip`, `tape`, `tape-gold`, `tape-rose`: decorative roles.

Add a named theme token when a new recurring color is needed. Reuse existing tokens when the intended role already exists. The emoji picker requires RGB channel values in its third-party CSS API; its overrides remain together in `globals.css`.

This guide does not introduce a dark palette or change the existing color-mode behavior.

## Shape and elevation

| Surface                             | Shape                    | Elevation                                                    |
| ----------------------------------- | ------------------------ | ------------------------------------------------------------ |
| Paper card                          | `rounded-paper` (2px)    | `shadow-paper`; interactive hover uses `shadow-paper-raised` |
| Input, textarea, navigation control | `rounded-control` (12px) | None                                                         |
| Panel                               | `rounded-panel` (12px)   | None; border defines the surface                             |
| Popover or option menu              | `rounded-panel`          | `shadow-popover`                                             |
| Dialog                              | `rounded-dialog` (16px)  | `shadow-dialog`                                              |
| Button, chip, selected token        | `rounded-full`           | None                                                         |

The dream narrative sheet intentionally keeps square corners. Small decorative emoji badges may use `shadow-sm`. Do not add elevation to every surface; reserve it for paper decoration and floating content.

`Panel` provides the standard border, paper-light background, clipped corners, and padding:

```tsx
<Panel>Panel content</Panel>

<Panel padding="none" className="mt-4">
  {dreams.map((dream) => <DreamLink key={dream.id} dream={dream} />)}
</Panel>
```

For a flush list, rows own their padding and separators. Empty list copy uses `p-6 text-sm leading-relaxed text-ink-soft`. Keep `TapedCard` for decorated linked cards rather than using it as a generic panel.

## Interaction states

- Use `Button` for ordinary actions and button-shaped links. Its `href` variant renders a link; the native variant supports `ref`, `disabled`, and native button attributes.
- Use `SelectableButton` for toggle choices. It owns `aria-pressed` and defaults to `type="button"`.
- `focus-ring` provides a visible purple keyboard outline with a 4px offset. Destructive buttons use the danger outline color.
- `control-interaction` adds the focus ring, pointer cursor, 200ms color transition, disabled opacity/cursor, and reduced-motion behavior.
- Custom controls must gate hover effects with `not-disabled:hover:*`. Disabled styling belongs in the control, not at every caller.
- Text links use `text-link`: purple text, a darker hover color, hover underline, and the shared keyboard focus ring.
- Inputs and the symbol combobox use a lavender border and a two-pixel lavender ring when focused. Invalid text fields use a danger border.
- Focus outlines inside clipped list panels use `focus-visible:-outline-offset-2` so the outline stays visible.
- Color transitions use 200ms. Components that animate opacity or transforms specify those properties explicitly and include `motion-reduce:transition-none`; moving cards also disable transforms for reduced motion.
- Selected navigation exposes `aria-current="page"`. Icon-only controls require an accessible label; decorative icons should be hidden from assistive technology.

Loading buttons provide both visible text and a busy state, and automatically disable themselves:

```tsx
<Button type="submit" loading={saving} loadingLabel="Saving...">
  Save
</Button>
```

The default loading label is `Please wait...`. Use an action-specific label when it communicates more clearly. Keep guards against repeated submissions in feature code; visual disabled styling is not a replacement for those guards.

## Forms and feedback

Use `TextField` for ordinary inputs and textareas. It forwards native props, event handlers, and refs, including React Hook Form registration. Use `as="textarea"` for multiline input.

```tsx
<TextField
  {...register("title")}
  id="title"
  label="Title"
  error={errors.title?.message}
/>
```

`TextField` connects its label, error, and hint to the control. It merges supplied `aria-describedby` values with its generated error/hint IDs. Pass `hint` for helper text, `leadingIcon` for an input icon, and `hideLabel` only when the visual context makes the field clear. A hidden label still needs meaningful text.

`className` styles the control; `wrapperClassName` styles the whole field. `FormField` is the lower-level label/error wrapper. When using it directly with a custom control, the caller must wire the control's `id`, `aria-invalid`, and `aria-describedby`. IDs must be unique within the rendered page.

Use `fieldset` and a `field-label` legend for grouped choices. The symbol combobox keeps its specialized keyboard and option-selection behavior.

Use `Feedback` for submission errors, notices, and asynchronous status messages:

```tsx
{
  error && <Feedback>{error}</Feedback>;
}
{
  notice && <Feedback tone="notice">{notice}</Feedback>;
}
```

Errors use `role="alert"`; notices use `role="status"`. Feedback has no external margin: use the parent's stack or add a margin at the call site. Empty feedback renders nothing. Field errors use `FormError`, which shares this treatment and supplies the field's error ID and spacing.

Use `FormActions` for wrapping, right-aligned action rows with `gap-3`. It supplies no external margin. It is also suitable for related actions at the bottom of a detail page.

## Dialogs

Use the shared `Dialog` for the native dialog surface, heading, title association, padding, backdrop, elevation, and body spacing.

```tsx
<Dialog
  ref={dialogRef}
  title="Edit dream"
  titleId="edit-dream-title"
  size="lg"
  onCancel={handleCancel}
>
  <DreamForm onSubmit={save} />
</Dialog>
```

- Sizes: `sm` = `max-w-md`, `md` = `max-w-lg` (default), `lg` = `max-w-3xl`.
- Default overflow is scrollable. `overflow="visible"` is reserved for content such as the symbol picker whose popover extends outside the dialog. Check it on short viewports when changing its content.
- All dialogs use the ink backdrop at 40% opacity with a small blur.
- Callers own `showModal()`, closing, initial focus, Escape/backdrop policy, and guards while requests are pending. `Dialog` forwards its ref and native handlers; it does not add a second lifecycle or dismissal policy.
- Keep forms inside dialogs. Do not put a dialog inside a form without accounting for form nesting and portal event propagation.

## Working on shared styles

1. Check whether a shared component or token already provides the treatment.
2. Prefer documented props and variants over conflicting Tailwind class overrides. Class-string order alone does not reliably resolve utility conflicts.
3. Keep presentation in shared components and feature behavior in feature components.
4. Check keyboard focus, disabled/loading/error states, narrow layouts, dialog overflow, and reduced motion when changing relevant UI.
5. Run TypeScript and lint checks. For theme/utility changes, verify Tailwind emits the new utilities; for component behavior changes, check the native attributes and handlers are preserved.
6. Update this guide when adding a common pattern or changing a convention.

The existing random taped-card decoration and mobile navigation behavior are outside this styling pass.

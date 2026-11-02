import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";
import { ErrorRecovery } from "./error-recovery";
import { RouteError } from "./route-error";

test("route error screens are localized and never render exception details", () => {
  const error = new Error("postgres://PRIVATE_CREDENTIALS/private-dream-content");
  error.stack = "PRIVATE_STACK_TRACE";
  Object.assign(error, { digest: "PRIVATE_DIGEST" });
  for (const [locale, messages] of [["en", en], ["uk", uk]] as const) {
    const html = renderToStaticMarkup(
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        <RouteError error={error} retry={() => {}} />
      </NextIntlClientProvider>,
    );
    assert.ok(html.includes(messages.RouteError.title));
    assert.ok(html.includes(messages.RouteError.retry));
    assert.ok(html.includes(messages.RouteError.home));
    assert.match(html, /role="alert"/);
    assert.match(html, /type="button"/);
    assert.match(html, /href="\/"/);
    assert.doesNotMatch(html, /PRIVATE_|postgres:|private-dream-content/);
  }
});

test("global recovery content renders without a locale provider or browser APIs", () => {
  for (const messages of [en.RouteError, uk.RouteError]) {
    const html = renderToStaticMarkup(
      <ErrorRecovery
        messages={messages}
        retry={() => { assert.fail("Retry must only run after user interaction"); }}
      />,
    );
    assert.ok(html.includes(messages.title));
    assert.ok(html.includes(messages.retry));
    assert.match(html, /tabindex="-1"/);
  }
});

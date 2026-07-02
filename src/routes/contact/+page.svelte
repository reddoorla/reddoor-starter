<script lang="ts">
  import { enhance } from "$app/forms";
  import { env } from "$env/dynamic/public";
  import Field from "$lib/components/Field.svelte";
  import { loadTurnstile } from "$lib/turnstile";
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Optional Cloudflare Turnstile. Dark until a site sets PUBLIC_TURNSTILE_SITE_KEY.
  // Trimmed so a stray-whitespace value stays dark (this fleet has hit trailing-space
  // config before). When set, the widget is rendered explicitly by the effect below.
  const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY?.trim();

  // The element the Turnstile widget renders into; bound only when configured.
  let turnstileEl = $state<HTMLDivElement>();

  // Render Turnstile explicitly whenever the container is mounted. This fires on a
  // full page load AND on client-side (SPA) navigation into this form — unlike an
  // auto-render <svelte:head> script, whose scan only runs on api.js's first load
  // and silently no-ops on later SPA nav, leaving a tokenless submit. The cleanup
  // removes the widget so it re-renders fresh on the next mount. See $lib/turnstile.
  $effect(() => {
    const el = turnstileEl;
    if (!turnstileSiteKey || !el) return;
    let widgetId: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !el.isConnected) return;
        widgetId = turnstile.render(el, { sitekey: turnstileSiteKey });
      })
      .catch(() => {
        // Offline / blocked / CSP: central ingest is fail-open, so a missing token
        // degrades to the honeypot + timing + heuristic screen, never a dropped lead.
      });
    return () => {
      cancelled = true;
      if (widgetId !== undefined) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // Widget already torn down (e.g. by navigation) — nothing to clean up.
        }
      }
    };
  });

  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let message = $state("");
  let submitting = $state(false);
</script>

<!--
  Canonical contact form (clone skeleton). EDIT PER SITE:
  - the page <title>, <h1>, and subhead copy below
  - the success-message copy
  - the field set (add/remove <Field>s + matching keys in +page.server.ts buildPayload)
  Forwards to the central dashboard ingest via createIngestAction; spam is handled
  by the hidden honeypot + a 2s fill-timing screen, plus optional Cloudflare Turnstile
  (set PUBLIC_TURNSTILE_SITE_KEY to enable — verified centrally by the dashboard).
  Requires FORMS_INGEST_URL + FORMS_INGEST_TOKEN in the deployed site's env (see .env.example).
-->

<svelte:head>
  <title>Contact</title>
</svelte:head>

<main class="max-w-2xl mx-auto px-8 py-16 space-y-8">
  <header class="space-y-2">
    <h1 class="text-3xl font-bold">Contact us</h1>
    <p class="text-secondary">Send us a message and we'll get back to you.</p>
  </header>

  <!-- One-and-done: on success the form unmounts. To allow another submission, keep the form mounted and reset the field state instead. -->
  {#if form?.success}
    <p
      role="status"
      class="border-2 border-green-600 bg-green-50 rounded p-4 text-green-900"
    >
      Thanks — your message is on its way. We'll be in touch soon.
    </p>
  {:else}
    <form
      method="POST"
      class="space-y-4"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
        };
      }}
    >
      <!-- Single top-level error; for multi-field validation summaries see $lib/components/Form.svelte. -->
      {#if form?.error}
        <p
          role="alert"
          class="border-2 border-red-600 bg-red-50 rounded p-4 text-red-900"
        >
          {form.error}
        </p>
      {/if}

      <!-- Anti-bot: per-request timing token + a hidden honeypot. Naive bots
           fill the honeypot; a too-fast fill is caught by the timing screen. -->
      <input type="hidden" name="ts" value={data.formTs} />
      <input
        type="text"
        name="bot-field"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        class="hidden"
      />

      <Field
        name="name"
        label="Name"
        autocomplete="name"
        required
        bind:value={name}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        autocomplete="email"
        required
        bind:value={email}
      />
      <Field
        name="phone"
        label="Phone"
        type="tel"
        autocomplete="tel"
        bind:value={phone}
      />
      <Field
        name="message"
        label="Message"
        type="textarea"
        maxlength={5000}
        required
        bind:value={message}
      />

      {#if turnstileSiteKey}
        <!-- Cloudflare Turnstile mount point. The effect above renders the widget
             here explicitly; it injects a hidden `cf-turnstile-response` input inside
             the form, which createIngestAction reads and forwards. Verification is
             central (the dashboard holds TURNSTILE_SECRET_KEY; sites carry only the
             public key). -->
        <div class="cf-turnstile" bind:this={turnstileEl}></div>
      {/if}

      <button
        type="submit"
        disabled={submitting}
        class="px-4 py-2 bg-primary text-white rounded bump disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  {/if}
</main>

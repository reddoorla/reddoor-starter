<script lang="ts">
  import Accordion from "$lib/components/Accordion.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Form from "$lib/components/Form.svelte";
  import Field from "$lib/components/Field.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import RichTextBody from "$lib/components/RichTextBody.svelte";
  import type { RichTextField } from "@prismicio/client";

  let modalOpen = $state(false);
  let email = $state("");
  let message = $state("");

  const items = [
    {
      label: "What is this page?",
      content:
        "A fixtures page exercising accessible component primitives for axe testing.",
    },
    {
      label: "What does it cover?",
      content:
        "Nav (focus-trapped menu), Accordion (disclosure), Modal (dialog), Form, Field, and rich-text heading normalization.",
    },
  ];

  const navLinks = [
    { text: "Accordion", href: "#accordion-heading" },
    { text: "Modal", href: "#modal-heading" },
    { text: "Form", href: "#form-heading" },
  ];

  // An editor-authored body that starts deep and skips a level (h3 → h5);
  // RichTextBody compresses the announced levels to 2 and 3.
  const richTextField = [
    { type: "heading3", text: "Editor heading (h3 tag)", spans: [] },
    {
      type: "paragraph",
      text: "The h3 above is announced as level 2 via aria-level.",
      spans: [],
    },
    { type: "heading5", text: "Skipped to h5 (h5 tag)", spans: [] },
    {
      type: "paragraph",
      text: "The h5 above is announced as level 3 — no gap in the outline.",
      spans: [],
    },
  ] as unknown as RichTextField;
</script>

<Nav {navLinks} />

<main class="max-w-3xl mx-auto px-8 pt-28 pb-16 space-y-12">
  <header class="space-y-2">
    <h1 class="text-3xl font-bold">Accessibility fixtures</h1>
    <p class="text-secondary">
      Used by the Playwright + axe-core CI gate. Every primitive on this page is
      expected to pass WCAG 2.2 AA.
    </p>
  </header>

  <section aria-labelledby="rich-text-heading" class="space-y-4">
    <h2 id="rich-text-heading" class="text-xl font-semibold">
      Rich text heading levels
    </h2>
    <RichTextBody field={richTextField} />
  </section>

  <section aria-labelledby="accordion-heading" class="space-y-4">
    <h2 id="accordion-heading" class="text-xl font-semibold">Accordion</h2>
    <Accordion {items} />
  </section>

  <section aria-labelledby="modal-heading" class="space-y-4">
    <h2 id="modal-heading" class="text-xl font-semibold">Modal</h2>
    <button
      type="button"
      onclick={() => (modalOpen = true)}
      class="px-4 py-2 border-2 border-primary rounded bump"
    >
      Open modal
    </button>
    <Modal bind:open={modalOpen}>
      <h3 class="text-lg font-semibold mb-2">Dialog title</h3>
      <p>Native dialog element with backdrop, ESC-to-close, and focus trap.</p>
    </Modal>
  </section>

  <section aria-labelledby="form-heading" class="space-y-4">
    <h2 id="form-heading" class="text-xl font-semibold">Form</h2>
    <Form method="POST" action="?/contact" class="space-y-4" errors={{}}>
      <Field
        name="email"
        label="Email"
        type="email"
        description="We use this only to reply."
        required
        bind:value={email}
      />
      <Field
        name="message"
        label="Message"
        type="textarea"
        required
        bind:value={message}
      />
      <button
        type="submit"
        class="px-4 py-2 bg-primary text-white rounded bump"
      >
        Send
      </button>
    </Form>
  </section>

  <section aria-labelledby="form-errors-heading" class="space-y-4">
    <h2 id="form-errors-heading" class="text-xl font-semibold">
      Form with errors
    </h2>
    <Form
      method="POST"
      class="space-y-4"
      errors={{
        email: "Email is required.",
        message: "Message must be at least 10 characters.",
      }}
    >
      <Field
        name="email"
        label="Email"
        type="email"
        required
        error="Email is required."
      />
      <Field
        name="message"
        label="Message"
        type="textarea"
        required
        error="Message must be at least 10 characters."
      />
      <button
        type="submit"
        class="px-4 py-2 bg-primary text-white rounded bump"
      >
        Send
      </button>
    </Form>
  </section>
</main>

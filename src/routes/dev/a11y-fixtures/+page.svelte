<script lang="ts">
  import Accordion from "$lib/components/Accordion.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Form from "$lib/components/Form.svelte";
  import Field from "$lib/components/Field.svelte";
  import PreNavTransition from "$lib/components/PreNavTransition.svelte";

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
      content: "Accordion (disclosure), Modal (dialog), Form, and Field.",
    },
  ];
</script>

<main class="max-w-3xl mx-auto px-8 py-16 space-y-12">
  <header class="space-y-2">
    <h1 class="text-3xl font-bold">Accessibility fixtures</h1>
    <p class="text-secondary">
      Used by the Playwright + axe-core CI gate. Every primitive on this page is
      expected to pass WCAG 2.2 AA.
    </p>
  </header>

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

<!-- Renders nothing at rest (overlay only appears mid-navigation, aria-hidden);
     mounted so the axe gate covers its resting state. -->
<PreNavTransition />

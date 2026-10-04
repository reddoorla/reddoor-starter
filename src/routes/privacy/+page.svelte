<script lang="ts">
  import { formatEffectiveDate } from "$lib/privacy/policy";
  import type { PrivacyServices } from "$lib/privacy/services";

  interface Props {
    data: {
      privacy: {
        legalName?: string;
        contactEmail?: string;
        effectiveDate?: string;
        draft: boolean;
        services: PrivacyServices;
      };
    };
  }

  let { data }: Props = $props();

  const p = $derived(data.privacy);
  const s = $derived(p.services);
  const owner = $derived(p.legalName?.trim() || "[client legal name]");
  const email = $derived(p.contactEmail?.trim() || "");
  const effective = $derived(formatEffectiveDate(p.effectiveDate?.trim()) ?? "[effective date]");
</script>

{#snippet contact()}
  {#if email}
    <a href={`mailto:${email}`} class="underline">{email}</a>
  {:else}
    <span>[privacy contact email]</span>
  {/if}
{/snippet}

<article class="max-w-2xl mx-auto px-8 py-16 space-y-8">
  {#if p.draft}
    <p
      data-testid="privacy-draft"
      class="border-2 border-amber-600 bg-amber-50 rounded p-4 text-amber-900 font-semibold"
    >
      DRAFT: this policy has not yet been reviewed by a lawyer and is not final.
    </p>
  {/if}

  <header class="space-y-2">
    <h1 class="text-3xl font-bold">Privacy Policy</h1>
    <p class="text-secondary">Effective {effective}</p>
  </header>

  <p>
    {owner} ("we") runs this website. This policy explains what information the site collects, why, who
    else receives it, and the choices you have.
  </p>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">What we collect</h2>
    {#if s.forms}
      <p>
        When you send us a form, we collect what you enter: your name, email address, phone number
        and message. We also record the IP address the form was sent from, which we use to limit
        abuse.
      </p>
    {/if}
    <p>
      Each time you load a page, the servers that host this site record technical details about the
      request: your IP address, your browser and device type, the page requested, the referring page
      and the time.
    </p>
    {#if s.ga4}
      <p>
        We also measure how visitors use the site: which pages are viewed, for how long, from what
        kind of device, and your approximate location, derived from your IP address.
      </p>
    {/if}
  </section>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">How we use it</h2>
    <ul class="list-disc pl-6 space-y-1">
      {#if s.forms}
        <li>To answer your message and follow up on your request.</li>
      {/if}
      <li>To run the site, keep it secure and fix problems.</li>
      {#if s.ga4}
        <li>To understand how the site is used and improve it.</li>
      {/if}
    </ul>
    <p>We do not sell your personal information, and we do not share it for advertising.</p>
  </section>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Who else receives it</h2>
    <p>
      We use the service providers below to run this site. Each receives only what it needs to do
      its job.
    </p>
    <ul class="list-disc pl-6 space-y-2">
      {#if s.forms}
        <li data-testid="service-forms">
          Form messages go to Reddoor, the agency that builds and maintains this site for us.
          Reddoor stores them in a database hosted by Turso and emails them to us through Resend.
        </li>
      {/if}
      {#if s.turnstile}
        <li data-testid="service-turnstile">
          Cloudflare Turnstile checks that a form is sent by a person rather than a bot. To do that
          it reads signals from your browser, such as how the page was loaded and interacted with.
        </li>
      {/if}
      {#if s.mailchimp}
        <li data-testid="service-mailchimp">
          If you sign up for our newsletter, your email address is sent to Mailchimp, which stores
          our mailing list and sends the newsletter. Every newsletter has a link to unsubscribe.
        </li>
      {/if}
      {#if s.ga4}
        <li data-testid="service-ga4">
          Google Analytics measures how visitors use the site. Google sets cookies to tell one visit
          from the next and receives your IP address, device and browser details, and the pages you
          view. Google may collect information about your online activities over time and across
          different websites. You can opt out with Google's
          <a href="https://tools.google.com/dlpage/gaoptout" class="underline">browser add-on</a>.
        </li>
      {/if}
      {#if s.googleFonts}
        <li data-testid="service-googleFonts">
          Some fonts load from Google Fonts, so your browser sends your IP address to Google when a
          page loads.
        </li>
      {/if}
      {#if s.adobeFonts}
        <li data-testid="service-adobeFonts">
          Some fonts load from Adobe Fonts, so your browser sends your IP address to Adobe when a
          page loads.
        </li>
      {/if}
      {#if s.vimeo}
        <li data-testid="service-vimeo">
          Some pages show video from Vimeo. Vimeo receives your IP address when the video loads, and
          its player may set cookies.
        </li>
      {/if}
      {#if s.youtube}
        <li data-testid="service-youtube">
          Some pages show video from YouTube, which is owned by Google. YouTube receives your IP
          address when the video loads, and its player may set cookies.
        </li>
      {/if}
      {#if s.netlify}
        <li data-testid="service-netlify">
          Netlify hosts this site and keeps the request records described above.
        </li>
      {/if}
    </ul>
  </section>

  <section data-testid="privacy-dnt" class="space-y-3">
    <h2 class="text-xl font-semibold">Do Not Track</h2>
    <p>
      Your browser may let you send a "Do Not Track" signal. There is no agreed standard for how a
      website should respond to it, so this site does not change what it collects when it receives
      one.
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Children</h2>
    <p>
      This site is not meant for children under 13, and we do not knowingly collect their
      information.
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Your choices</h2>
    <p>
      To ask what information we hold about you, or to have it corrected or deleted, email
      {@render contact()}.
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Changes to this policy</h2>
    <p>
      If we change this policy, we will post the new version on this page and update the effective
      date above.
    </p>
  </section>
</article>

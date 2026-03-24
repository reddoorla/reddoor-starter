declare namespace svelteHTML {
    interface HTMLAttributes<T> {
      netlify?: boolean;
      'netlify-honeypot'?: string;
    }
  }

interface VimeoPlayer {
  on(event: string, callback: () => void): void;
  ready(): Promise<void>;
}

interface Window {
  Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayer };
}
  
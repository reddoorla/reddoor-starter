import { browser } from "$app/environment";

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;

function createViewport() {
  let width = $state(browser ? window.innerWidth : DEFAULT_WIDTH);
  let height = $state(browser ? window.innerHeight : DEFAULT_HEIGHT);
  let consumers = 0;

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  function subscribe() {
    if (!browser) return () => {};
    if (consumers === 0) {
      window.addEventListener("resize", handleResize);
      handleResize();
    }
    consumers++;
    return () => {
      consumers--;
      if (consumers === 0) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }

  return {
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    subscribe,
  };
}

export const viewport = createViewport();

<script lang="ts">
    import { onMount } from "svelte";

      let isInView = $state(false);
      let el:HTMLElement | undefined = $state();
      let transitionDelay = $state(0);


  let {
    style = "",
    transitionDelayMax = 400,
    transitionDuration = 2400,
    class:passedClasses = "",
    children
  } = $props();

      onMount(()=>{
          if (!el) return;

          transitionDelay = transitionDelayMax * (el.getBoundingClientRect().left / window.innerWidth);

          const observer = new IntersectionObserver(([entry]) => {
              if (entry.isIntersecting) {
                  isInView = true;
                  observer.disconnect();
              }
          }, { threshold: 0 });

          observer.observe(el);

          return () => observer.disconnect();
      })
  </script>
  
  
     
  
          <div bind:this={el} class="transition ease-fast-slow {passedClasses} {isInView ? "opacity-100 translate-y-0":"opacity-0 translate-y-[50%]"}" style="transition-delay:{transitionDelay}ms; transition-duration:{transitionDuration}ms; {style}">
              {@render children?.()}
          </div>
  
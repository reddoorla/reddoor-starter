<script lang='ts'>
    import placeholder from "../assets/images/placeholder.svg";
    
    export let image = placeholder;
    export let altText = "background image"
    </script>

        <div  class="max-w-screen-xl mx-auto relative w-full aspect-[16/9]">
            <img src={image} alt={altText} class="absolute bottom-0 h-full w-full object-color -z-10"/>
            <div class='w-full h-full p-[4%] xl:p-0'>
                <slot />
            </div>
        </div>
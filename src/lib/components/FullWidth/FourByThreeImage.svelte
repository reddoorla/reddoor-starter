<script lang="ts">
    import placeholder from "$lib/assets/images/image_placeholder.svg"

    export let twProps = "";
    export let image = placeholder;


    let rotationAngle = "36.8";
    let crossLength = "125%";
</script>

<div class="w-full my-8 {twProps}">
    <div class="w-full aspect-[4/3] {image===placeholder ? "border-light border-2 bg-light bg-opacity-25":""}  rounded-sm  flex items-center justify-center relative">
        <img src={image} alt="placeholder" class="z-10 {image==placeholder ? "w-16" : "w-full"}"/>
        <div class="absolute bg-light h-[2px] {image===placeholder ? "":"hidden"}" style="transform: rotate({rotationAngle}deg); width:{crossLength}"></div>
        <div class="absolute bg-light h-[2px] {image===placeholder ? "":"hidden"}" style="transform: rotate(-{rotationAngle}deg); width:{crossLength}"></div>
    </div>
</div>
<script lang="ts">
    import StyledSingleSelect from "./StyledSingleSelect.svelte";
    import DefaultButton from "../Buttons/DefaultButton.svelte";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

    const PRODUCTS = ["Apples", "Bananas", "Clementines"]

    let SubmitEvent:Event;

</script>

<form class="w-full flex flex-col gap-4">

        <div class="flex flex-col md:flex-row text-light items-center justify-center w-full">
            <div class="flex items-center justify-center w-full translate-x-[6px]">
            <FontAwesomeIcon icon={faEnvelope} color="#ffffff" class="h-5 -mr-8 z-10"/>
            <input class="w-full border-[1px] rounded-[3px] text-dark border-light h-10 pl-10 pt-[2.5px]" placeholder="Email" type="text"/>
            </div>
        </div>
        <StyledSingleSelect placeholder="Select product" items={PRODUCTS}/>

        <textarea class="border-[1px] rounded-[3px] text-dark border-light h-48 pl-4 pt-[2.5px]" placeholder="Type something..." />

        <div class="w-16">
            <DefaultButton text="submit" click={()=>SubmitEvent} twProps=""/>
        </div>
        
</form>

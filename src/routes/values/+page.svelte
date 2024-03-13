<script lang="ts">
  import ContentWidth from "$lib/components/ContentWidth/ContentWidth.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
  import ContentBox from "$lib/components/FullWidth/ContentBox.svelte";
  import placeholder from "$lib/assets/images/image_placeholder.svg"
  import HalfWidthImage from "$lib/components/HalfWidth/HalfWidthImage.svelte";
  import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
  import OutlineButton from "$lib/components/Buttons/OutlineButton.svelte";

  const loremParagraph = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed  do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    let activeValue = 2;

    const setActiveValue = (i:number) => activeValue=i;

    let innerWidth:number;
</script>

<svelte:head>
    <title>Values Blocks | Reddoor Wireframer</title>
</svelte:head>

<svelte:window bind:innerWidth />

<!-- values block #1 -->
<ContentWidth>
    <h2 class="mb-16">Here is our Value Proposition</h2>
    <div class="w-full flex flex-row justify-between">
        <ContentBox 
            icon={placeholder}
            labelText="Strategic Foundation"
            paragraphText={loremParagraph}
            twProps="w-[360px]"
        />
        <ContentBox 
            icon={placeholder}
            labelText="User-centric precision"
            paragraphText={loremParagraph}
            twProps="w-[360px]"
        />
        <ContentBox 
            icon={placeholder}
            labelText="iterate for excellence"
            paragraphText={loremParagraph}
            twProps="w-[360px]"
        />
    </div>

</ContentWidth>
<Spacer color="#424B5A" />

<!-- values block #2 -->

<ContentWidth >
    <h6 class="mb-16">HERE IS OUR VALUE PROPOSITION</h6>
    <div class="flex w-full mb-16 flex-col lg:flex-row">
        <div class="w-full lg:w-1/2 flex flex-col justify-start pr-6">
            <div class="w-full flex justify-between mb-16 w-s">
                <DefaultButton 
                    text="Value 1"
                    filled={activeValue===1}
                    click={()=>setActiveValue(1)}
                />
                <DefaultButton 
                    text="Value 2"
                    filled={activeValue===2}
                    click={()=>setActiveValue(2)}
                />
                <DefaultButton 
                    text="Value 3"
                    filled={activeValue===3}
                    click={()=>setActiveValue(3)}
                />
            </div>
            <ContentBox 
                icon=""
                titleTag="h3"
                titleText="Value 1"
                paragraphText={loremParagraph}
                linkText="Learn More"
                float="{innerWidth > 1024 ? "left" : "center"}"
                twProps="p-0 w-[480px] mx-auto lg:w-3/4 lg:ml-0"
            />
        </div>
        <HalfWidthImage twProps="pl-6 mt-0"/>
    </div>
</ContentWidth>
<Spacer color="#424B5A" />

<!-- values block #3 -->
<Spacer color="#424B5A" />

<!-- values block #4 -->
<Spacer color="#424B5A" />
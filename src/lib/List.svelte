<script lang="ts">
	import { onMount } from "svelte";

	export let itemCount: number;
	export let itemSize: number;
	export let height: number;
	export let width: string = "100%";

	export let overscan: number = 1;

	export let marginLeft: number = 0;
	export let marginTop: number = 0;
	export let layout: "vertical" | "horizontal" = "vertical";

	export let scrollToPosition: number | undefined = undefined;
	export let scrollToIndex: number | undefined = undefined;
	export let scrollToBehaviour: "auto" | "smooth" = "auto";

	let isVertical: boolean = layout === "vertical";
	let innerSize: number;
	let itemSizeInternal: string;
	let size: number = 0;

	let list: HTMLElement;
	let mounted: boolean = false;
	let scrollPosition: number = 0;
	let headerHeight: number = 0;
	let offsetHeight: number = 0;
	let clientHeight: number = 0;
	let offsetWidth: number = 0;
	let clientWidth: number = 0;

	let indexes: number[];

	const getIndexes = () => {
		const idxs = [];

		const startIndexTemp = Math.floor(scrollPosition / itemSize);
		const startIndexOverscan = startIndexTemp > overscan ? startIndexTemp - overscan : 0;
		const startIndex = startIndexOverscan >= 0 ? startIndexOverscan : startIndexTemp;

		const endIndexTemp = Math.min(itemCount, Math.floor((scrollPosition + size) / itemSize));
		const endIndexOverscan = endIndexTemp + overscan;
		const endIndex = endIndexOverscan < itemCount ? endIndexOverscan : itemCount;

		for (let i = 0; i < endIndex - startIndex; i++) idxs.push(i + startIndex);

		indexes = idxs;
	};

	const getItemStyle = (index: number) =>
		`position: absolute; transform: translate(${
			isVertical
				? `${marginLeft}px, ${index * itemSize + marginTop}px`
				: `${index * itemSize + marginLeft}px, ${marginTop}px`
		}); ${itemSizeInternal} will-change: transform, contents;`;

	const onScroll = ({ currentTarget }: { currentTarget: HTMLDivElement }) => {
		if (scrollToIndex === undefined && scrollToPosition === undefined) {
			if (isVertical) {
				scrollPosition = Math.max(0, currentTarget.scrollTop - headerHeight);
			} else {
				scrollPosition = currentTarget.scrollLeft;
			}
		}
	};

	$: if (list && scrollToIndex !== undefined) {
		list.scrollTo({
			[isVertical ? "top" : "left"]:
				scrollToIndex * itemSize + headerHeight + (isVertical ? marginTop : marginLeft),
			behavior: scrollToBehaviour,
		});
		scrollToIndex = undefined;
	}

	$: if (list && scrollToPosition !== undefined) {
		list.scrollTo({
			[isVertical ? "top" : "left"]: scrollToPosition + headerHeight,
			behavior: scrollToBehaviour,
		});
		scrollToPosition = undefined;
	}

	$: innerSize = Math.max(itemCount * itemSize, size);

	$: itemSizeInternal = isVertical
		? `height: ${itemSize}px; width: ${
				marginLeft > 0 ? `${clientWidth - marginLeft}px` : "100%"
		  };`
		: `height: ${
				marginTop > 0 ? `${clientHeight - marginTop}px` : "100%"
		  }; width: ${itemSize}px;`;

	$: size = isVertical ? offsetHeight : offsetWidth;

	$: {
		itemCount,
			itemSize,
			size,
			overscan,
			scrollPosition;
		getIndexes();
	}

	onMount(() => (mounted = true));
</script>

{#if mounted}
	<div
		style="position: relative; overflow: auto; height: {height}px; width: {width}; will-change: scroll-position;"
		on:scroll={onScroll}
		bind:this={list}
		bind:offsetHeight
		bind:clientHeight
		bind:offsetWidth
		bind:clientWidth
	>
		{#if $$slots.header}
			<div bind:offsetHeight={headerHeight}>
				<slot name="header" />
			</div>
		{/if}

		<div
			style="height: {isVertical ? `${innerSize}px` : '100%'}; width: {!isVertical
				? `${innerSize}px`
				: '100%'}; will-change: contents;"
		>
			{#each indexes as index}
				<slot name="item" {index} {scrollPosition} style={getItemStyle(index)}>
					Missing template
				</slot>
			{/each}
		</div>

		<slot name="footer" />
	</div>
{/if}

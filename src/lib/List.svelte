<script lang="ts">
	import { onMount } from "svelte";

	export let itemCount: number;
	export let itemSize: number;
	export let height: number;
	export let width: string = "100%";

	export let overScan: number = 1;

	export let marginLeft: number = 0;
	export let marginTop: number = 0;
	export let layout: "vertical" | "horizontal" = "vertical";

	export let scrollToIndex: number | undefined = undefined;
	export let scrollToPosition: number | undefined = undefined;
	export let scrollToBehavior: "auto" | "smooth" = "auto";

	let list: HTMLElement;
	let mounted: boolean = false;
	let scrollPosition: number = 0;
	let headerHeight: number = 0;
	let offsetHeight: number = 0;
	let clientHeight: number = 0;
	let offsetWidth: number = 0;
	let clientWidth: number = 0;


	export const scrollTo = {
		index: (index: number) => {
			scrollToIndex = index;
		},
		position: (position: number) => {
			scrollToPosition = position;
		},
	};

	const getIndexes = (
		itemCount: number,
		itemSize: number,
		size: number,
		overScan: number,
		scrollPosition: number
	) => {
		const indexes: number[] = [];

		const startIndexTemp = ~~(scrollPosition / itemSize);
		const startIndexOverScan = startIndexTemp > overScan ? startIndexTemp - overScan : 0;
		const startIndex = startIndexOverScan >= 0 ? startIndexOverScan : startIndexTemp;

		const endIndexTemp = Math.min(itemCount, ~~((scrollPosition + size) / itemSize));
		const endIndexOverScan = endIndexTemp + overScan;
		const endIndex = endIndexOverScan < itemCount ? endIndexOverScan : itemCount;

		for (let i = 0; i < endIndex - startIndex; i++) indexes.push(i + startIndex);

		return indexes;
	};

	const getItemStyle = (index: number) => {
		const ixis = index * itemSize;

		return `position: absolute; transform: translate(${
			isVertical
				? `${marginLeft}px, ${ixis + marginTop}px`
				: `${ixis + marginLeft}px, ${marginTop}px`
		}); ${itemSizeInternal} will-change: transform, contents;`;
	};

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
			behavior: scrollToBehavior,
		});
		scrollToIndex = undefined;
	}

	$: if (list && scrollToPosition !== undefined) {
		list.scrollTo({
			[isVertical ? "top" : "left"]: scrollToPosition + headerHeight,
			behavior: scrollToBehavior,
		});
		scrollToPosition = undefined;
	}

	$: isVertical = layout === "vertical";

	$: innerSize = Math.max(itemCount * itemSize, size);

	$: itemSizeInternal = isVertical
		? `height: ${itemSize}px; width: ${
				marginLeft > 0 ? `${clientWidth - marginLeft}px` : "100%"
		  };`
		: `height: ${
				marginTop > 0 ? `${clientHeight - marginTop}px` : "100%"
		  }; width: ${itemSize}px;`;

	$: size = isVertical ? offsetHeight : offsetWidth;

	$: indexes = getIndexes(
		itemCount,
		itemSize,
		size,
		overScan,
		scrollPosition
	);

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
				{@const style = getItemStyle(index)}

				<slot name="item" {index} {scrollPosition} {style}>Missing template</slot>
			{/each}
		</div>

		<slot name="footer" />
	</div>
{/if}

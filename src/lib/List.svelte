<script context="module">
	import { scrollStop as _scrollStop } from "./utils";

	const scrollStop = _scrollStop();
</script>

<script lang="ts">
	export let itemCount: number;
	export let itemSize: number;
	export let height: number;
	export let width = "100%";

	export let overScan = 1;

	export let marginLeft = 0;
	export let marginTop = 0;
	export let layout: "vertical" | "horizontal" = "vertical";

	export let scrollPosition = 0;
	export let scrollBehavior: ScrollBehavior = "auto";

	let list: HTMLElement;
	let _scrollPosition = scrollPosition;
	let headerHeight = 0;
	let offsetHeight = 0;
	let clientHeight = 0;
	let offsetWidth = 0;
	let clientWidth = 0;
	let indexes: number[] = [];

	let manualScroll = false;
	let isScrolling = false;

	export const setScrollIndex = (index: number, behavior: ScrollBehavior = scrollBehavior) => {
		scrollTo(index * itemSize + (isVertical ? marginTop : marginLeft), behavior);
	};

	export const setScrollPosition = (
		position: number,
		behavior: ScrollBehavior = scrollBehavior
	) => {
		scrollTo(position, behavior);
	};

	const scrollTo = (direction: number, behavior: ScrollBehavior = scrollBehavior) => {
		if (list) {
			manualScroll = true;

			list.scrollTo({ [isVertical ? "top" : "left"]: direction + headerHeight, behavior });
			scrollPosition = _scrollPosition;

			manualScroll = false;
		}
	};

	const scrollToManual = (scrollPosition: number) => {
		if (!manualScroll && !isScrolling) {
			manualScroll = true;

			list.scrollTo({ top: scrollPosition + headerHeight, behavior: scrollBehavior });

			manualScroll = false;
		}
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

		return `position: absolute; transform: translate3d(${
			isVertical
				? `${marginLeft}px, ${ixis + marginTop}px`
				: `${ixis + marginLeft}px, ${marginTop}px`
		}, 0px); ${itemSizeInternal} will-change: transform;`;
	};

	const onScroll = ({ currentTarget }: { currentTarget: HTMLDivElement }) => {
		isScrolling = true;

		if (!manualScroll) {
			_scrollPosition = Math.max(
				0,
				currentTarget[isVertical ? "scrollTop" : "scrollLeft"] - headerHeight
			);
			scrollPosition = _scrollPosition;
		}

		scrollStop(() => {
			isScrolling = false;
		});
	};

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

	$: if (offsetHeight) {
		indexes = getIndexes(itemCount, itemSize, size, overScan, _scrollPosition);
	}

	$: if (list) {
		scrollToManual(scrollPosition);
	}
</script>

<div
	style="position: relative; overflow: auto; height: {height}px; width: {width};"
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
			: '100%'};"
	>
		{#each indexes as index (index)}
			{@const style = getItemStyle(index)}

			<slot name="item" {index} {style}>Missing template</slot>
		{/each}
	</div>

	<slot name="footer" />
</div>

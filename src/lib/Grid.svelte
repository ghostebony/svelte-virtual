<script lang="ts">
	import { onMount } from "svelte";

	export let itemCount: number;
	export let itemHeight: number;
	export let itemWidth: number;
	export let height: number;
	export let width: string = "100%";

	export let overScan: number = 1;

	export let marginLeft: number = 0;
	export let marginTop: number = 0;

	export let scrollToIndex: number | undefined = undefined;
	export let scrollToPosition: number | undefined = undefined;
	export let scrollToBehavior: "auto" | "smooth" = "auto";

	let grid: HTMLElement;
	let mounted: boolean = false;
	let scrollPosition: number = 0;
	let headerHeight: number = 0;
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

	const roundTo = (x: number, multiple: number, type: "ceil" | "floor" = "ceil") => {
		if (type === "ceil") {
			return Math.ceil(x / multiple) * multiple;
		}
		return ~~(x / multiple) * multiple;
	};

	const getIndexes = (
		itemCount: number,
		itemHeight: number,
		height: number,
		columnCount: number,
		overScanColumn: number,
		scrollPosition: number
	) => {
		const indexes: number[] = [];

		const startIndexTemp = roundTo(
			(scrollPosition / itemHeight) * columnCount,
			columnCount,
			"floor"
		);
		const startIndexOverScan =
			startIndexTemp > overScanColumn ? startIndexTemp - overScanColumn : 0;
		const startIndex =
			startIndexTemp > 0 && startIndexOverScan >= 0 ? startIndexOverScan : startIndexTemp;

		const endIndexTemp = Math.min(
			itemCount,
			roundTo(((scrollPosition + height) / itemHeight) * columnCount, columnCount)
		);
		const endIndexOverScan = endIndexTemp + overScanColumn;
		const endIndex = endIndexOverScan < itemCount ? endIndexOverScan : itemCount;

		for (let i = 0; i < endIndex - startIndex; i++) indexes.push(i + startIndex);

		return indexes;
	};

	const getItemStyle = (index: number) =>
		`position: absolute; transform: translate(${
			(index % columnCount) * itemWidth + marginLeft
		}px, ${
			(Math.ceil((index + 1) / columnCount) - 1) * itemHeight + marginTop
		}px); height: ${itemHeight}px; width: ${itemWidth}px; will-change: transform;`;

	const onScroll = ({ currentTarget }: { currentTarget: HTMLDivElement }) => {
		if (scrollToIndex === undefined && scrollToPosition === undefined) {
			scrollPosition = Math.max(0, currentTarget.scrollTop - headerHeight);
		}
	};

	$: if (grid && scrollToIndex !== undefined) {
		grid.scrollTo({
			top:
				(Math.ceil((scrollToIndex + 1) / columnCount) - 1) * itemHeight +
				headerHeight +
				marginTop,
			behavior: scrollToBehavior,
		});
		scrollToIndex = undefined;
	}

	$: if (grid && scrollToPosition !== undefined) {
		grid.scrollTo({
			top: scrollToPosition + headerHeight,
			behavior: scrollToBehavior,
		});
		scrollToPosition = undefined;
	}

	$: columnCount = Math.max(
		~~((offsetWidth - marginLeft - (offsetWidth - clientWidth)) / itemWidth),
		1
	);

	$: innerHeight = Math.max((roundTo(itemCount, columnCount) * itemHeight) / columnCount, height);

	$: overScanColumn = columnCount * overScan;

	$: indexes = getIndexes(
		itemCount,
		itemHeight,
		height,
		columnCount,
		overScanColumn,
		scrollPosition
	);

	onMount(() => (mounted = true));
</script>

{#if mounted}
	<div
		style="position: relative; overflow: auto; height: {height}px; width: {width};"
		on:scroll={onScroll}
		bind:this={grid}
		bind:offsetWidth
		bind:clientWidth
	>
		{#if $$slots.header}
			<div bind:offsetHeight={headerHeight}>
				<slot name="header" />
			</div>
		{/if}

		<div style="height: {innerHeight}px; width: 100%;">
			{#each indexes as index}
				{@const style = getItemStyle(index)}

				<slot name="item" {index} {scrollPosition} {style}>Missing template</slot>
			{/each}
		</div>

		<slot name="footer" />
	</div>
{/if}

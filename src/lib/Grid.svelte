<script lang="ts">
	import { onMount } from "svelte";

	export let itemCount: number;
	export let itemHeight: number;
	export let itemWidth: number;
	export let height: number;
	export let width: string = "100%";

	export let overscan: number = 1;

	export let marginLeft: number = 0;
	export let marginTop: number = 0;

	export let scrollToPosition: number | undefined = undefined;
	export let scrollToIndex: number | undefined = undefined;
	export let scrollToBehaviour: "auto" | "smooth" = "auto";

	let columnCount: number;
	let innerHeight: number;
	let overscanColumn: number;

	let grid: HTMLElement;
	let mounted: boolean = false;
	let scrollPosition: number = 0;
	let headerHeight: number = 0;
	let offsetWidth: number = 0;
	let clientWidth: number = 0;

	let indexes: number[];

	const roundTo = (x: number, mutiple: number, type: "ceil" | "floor" = "ceil") =>
		Math[type](x / mutiple) * mutiple;

	const getIndexes = () => {
		const idxs = [];

		const startIndexTemp = roundTo(
			(scrollPosition / itemHeight) * columnCount,
			columnCount,
			"floor"
		);
		const startIndexOverscan =
			startIndexTemp > overscanColumn ? startIndexTemp - overscanColumn : 0;
		const startIndex =
			startIndexTemp > 0 && startIndexOverscan >= 0 ? startIndexOverscan : startIndexTemp;

		const endIndexTemp = Math.min(
			itemCount,
			roundTo(((scrollPosition + height) / itemHeight) * columnCount, columnCount)
		);
		const endIndexOverscan = endIndexTemp + overscanColumn;
		const endIndex = endIndexOverscan < itemCount ? endIndexOverscan : itemCount;

		for (let i = 0; i < endIndex - startIndex; i++) idxs.push(i + startIndex);

		indexes = idxs;
	};

	const getItemStyle = (index: number) =>
		`position: absolute; transform: translate(${
			(index % columnCount) * itemWidth + marginLeft
		}px, ${
			(Math.ceil((index + 1) / columnCount) - 1) * itemHeight + marginTop
		}px); height: ${itemHeight}px; width: ${itemWidth}px; will-change: transform, contents;`;

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
			behavior: scrollToBehaviour,
		});
		scrollToIndex = undefined;
	}

	$: if (grid && scrollToPosition !== undefined) {
		grid.scrollTo({
			top: scrollToPosition + headerHeight,
			behavior: scrollToBehaviour,
		});
		scrollToPosition = undefined;
	}

	$: columnCount = Math.max(
		Math.floor((offsetWidth - marginLeft - (offsetWidth - clientWidth)) / itemWidth),
		1
	);

	$: innerHeight = Math.max((roundTo(itemCount, columnCount) * itemHeight) / columnCount, height);

	$: overscanColumn = columnCount * overscan;

	$: {
		itemCount,
			itemHeight,
			height,
			columnCount,
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
		bind:this={grid}
		bind:offsetWidth
		bind:clientWidth
	>
		{#if $$slots.header}
			<div bind:offsetHeight={headerHeight}>
				<slot name="header" />
			</div>
		{/if}

		<div style="height: {innerHeight}px; width: 100%; will-change: contents;">
			{#each indexes as index}
				<slot name="item" {index} {scrollPosition} style={getItemStyle(index)}>
					Missing template
				</slot>
			{/each}
		</div>

		<slot name="footer" />
	</div>
{/if}

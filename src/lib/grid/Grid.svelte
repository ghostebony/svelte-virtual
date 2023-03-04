<script context="module" lang="ts">
	import { scrollSpeed as __scrollSpeed, scrollStop as _scrollStop } from "$lib/utils";

	const scrollStop = _scrollStop();
	const _scrollSpeed = __scrollSpeed();

	const round = {
		ceil: (x: number, multiple: number) => Math.ceil(x / multiple) * multiple,
		floor: (x: number, multiple: number) => ~~(x / multiple) * multiple,
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

		const startIndexTemp = round.floor(
			(scrollPosition / itemHeight) * columnCount,
			columnCount
		);
		const startIndexOverScan =
			startIndexTemp > overScanColumn ? startIndexTemp - overScanColumn : 0;
		const startIndex =
			startIndexTemp > 0 && startIndexOverScan >= 0 ? startIndexOverScan : startIndexTemp;

		const endIndexTemp = Math.min(
			itemCount,
			round.ceil(((scrollPosition + height) / itemHeight) * columnCount, columnCount)
		);
		const endIndexOverScan = endIndexTemp + overScanColumn;
		const endIndex = endIndexOverScan < itemCount ? endIndexOverScan : itemCount;

		for (let i = 0; i < endIndex - startIndex; i++) indexes.push(i + startIndex);

		return indexes;
	};

	const getRowIndex = (index: number, columnCount: number) => ~~(index / columnCount);
</script>

<script lang="ts">
	import type { ScrollBehavior } from "$lib/types";

	export let itemCount: number;
	export let itemHeight: number;
	export let itemWidth: number;
	export let height: number;
	export let width = "100%";

	export let overScan = 1;

	export let marginLeft = 0;
	export let marginTop = 0;

	export let scrollPosition = 0;
	export let scrollBehavior: ScrollBehavior = "auto";

	export let getKey: (index: number) => unknown = (index: number) => index;

	export let columnCount: number | undefined = undefined;

	let grid: HTMLElement;
	let _scrollPosition = scrollPosition;
	let headerHeight = 0;
	let offsetWidth = 0;
	let clientWidth = 0;
	let indexes: number[] = [];

	let manualScroll = false;
	let isScrolling = false;
	let isScrollingFast = false;

	export const scrollToIndex = (index: number, behavior: ScrollBehavior = scrollBehavior) => {
		scrollTo(getRowIndex(index, _columnCount) * itemHeight + marginTop, behavior);
	};

	export const scrollToPosition = (
		position: number,
		behavior: ScrollBehavior = scrollBehavior
	) => {
		scrollTo(position, behavior);
	};

	const scrollTo = (top: number, behavior: ScrollBehavior = scrollBehavior) => {
		if (grid) {
			manualScroll = true;

			grid.scrollTo({ top: top + headerHeight, behavior });
			scrollPosition = _scrollPosition;

			manualScroll = false;
		}
	};

	const scrollToManual = (scrollPosition: number) => {
		if (!manualScroll && !isScrolling) {
			manualScroll = true;

			grid.scrollTo({ top: scrollPosition + headerHeight, behavior: scrollBehavior });

			manualScroll = false;
		}
	};

	const getItemProps = (index: number) => {
		const rowIndex = getRowIndex(index, _columnCount);
		const columnIndex = index % _columnCount;

		return {
			rowIndex,
			columnIndex,
			style: `position: absolute; transform: translate3d(${
				columnIndex * itemWidth + marginLeft
			}px, ${
				rowIndex * itemHeight + marginTop
			}px, 0px); height: ${itemHeight}px; width: ${itemWidth}px; will-change: transform;`,
		};
	};

	const onScroll = ({ currentTarget }: { currentTarget: HTMLDivElement }) => {
		isScrolling = true;

		if (!manualScroll) {
			_scrollPosition = Math.max(0, currentTarget.scrollTop - headerHeight);
			scrollPosition = _scrollPosition;

			scrollSpeed(scrollPosition);
		}

		scrollStop(() => {
			isScrolling = false;
		});
	};

	$: _columnCount = !columnCount
		? Math.max(~~((offsetWidth - marginLeft - (offsetWidth - clientWidth)) / itemWidth), 1)
		: columnCount;

	$: innerHeight = (round.ceil(itemCount, _columnCount) * itemHeight) / _columnCount;

	$: overScanColumn = _columnCount * overScan;

	$: if (offsetWidth || _columnCount) {
		indexes = getIndexes(
			itemCount,
			itemHeight,
			height,
			_columnCount,
			overScanColumn,
			_scrollPosition
		);
	}

	$: if (grid) {
		scrollToManual(scrollPosition);
	}

	$: scrollSpeed = _scrollSpeed(height, {
		fast: () => {
			isScrollingFast = true;
		},
		slow: () => {
			isScrollingFast = false;
		},
	});
</script>

<div
	style:position="relative"
	style:overflow="auto"
	style:height="{height}px"
	style:width
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

	<div style:height="{innerHeight}px" style:width="100%">
		{#each indexes as index (getKey(index))}
			{@const { rowIndex, columnIndex, style } = getItemProps(index)}

			{#if !isScrollingFast || !$$slots.placeholder}
				<slot name="item" {index} {rowIndex} {columnIndex} {style}>Missing template</slot>
			{:else}
				<slot name="placeholder" {index} {rowIndex} {columnIndex} {style}>
					Missing placeholder
				</slot>
			{/if}
		{/each}
	</div>

	<slot name="footer" />
</div>

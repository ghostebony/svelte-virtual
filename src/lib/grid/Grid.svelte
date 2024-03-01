<script context="module" lang="ts">
	import {
		scrollSpeed as __scrollSpeed,
		scrollStop as _scrollStop,
		getGridIndices,
		getRowIndex,
		round,
	} from "$lib/utils";

	const scrollStop = _scrollStop();
	const _scrollSpeed = __scrollSpeed();
</script>

<script lang="ts">
	import type {
		GetKey,
		ScrollBehavior,
		ScrollEvent,
		ScrollToIndex,
		ScrollToPosition,
	} from "$lib/types";

	export let itemCount: number;
	export let itemHeight: number;
	export let itemWidth: number;
	export let height: number;
	export let width = "100%";
	export let spacing = 0;
	export let center = false;

	export let overScan = 1;

	export let marginLeft = 0;
	export let marginTop = 0;

	export let scrollPosition = 0;
	export let scrollBehavior: ScrollBehavior = "auto";

	export let getKey: GetKey = (index: number) => index;

	export let columnCount: number | undefined = undefined;

	let grid: HTMLElement;
	let _scrollPosition = scrollPosition;
	let headerHeight = 0;
	let offsetWidth = 0;
	let clientWidth = 0;
	let indices: number[] = [];

	let manualScroll = false;
	let isScrolling = false;
	let isScrollingFast = false;

	export const scrollToIndex: ScrollToIndex = (
		index: number,
		behavior: ScrollBehavior = scrollBehavior,
	) => {
		scrollTo(
			getRowIndex(index, _columnCount) * (itemHeight + spacing) + marginTop + headerHeight,
			behavior,
		);
	};

	export const scrollToPosition: ScrollToPosition = (
		position: number,
		behavior: ScrollBehavior = scrollBehavior,
	) => {
		scrollTo(position, behavior);
	};

	const scrollTo = (top: number, behavior: ScrollBehavior = scrollBehavior) => {
		if (grid) {
			manualScroll = true;

			grid.scrollTo({ top, behavior });

			manualScroll = false;
		}
	};

	const scrollToManual = (scrollPosition: number) => {
		if (!manualScroll && !isScrolling) {
			manualScroll = true;

			grid.scrollTo({ top: scrollPosition, behavior: scrollBehavior });

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
				columnIndex * itemWidth + marginLeft + spacing * columnIndex
			}px, ${
				rowIndex * itemHeight + marginTop + spacing * rowIndex
			}px, 0px); height: ${itemHeight}px; width: ${itemWidth}px; will-change: transform;`,
		};
	};

	const onScroll = (event: ScrollEvent) => {
		isScrolling = true;

		if (!manualScroll) {
			_scrollPosition = Math.max(0, event.currentTarget.scrollTop - headerHeight);
			scrollPosition = event.currentTarget.scrollTop;

			scrollSpeed(_scrollPosition);
		}

		scrollStop(() => {
			isScrolling = false;
		});
	};

	$: _columnCount = !columnCount
		? Math.max(Math.floor((offsetWidth - (spacing * (Math.floor(offsetWidth / itemWidth) - 1) + spacing)) / itemWidth), 1)
		: columnCount;

	$: rowCount = Math.ceil(itemCount / _columnCount);
	
	$: usedWidth = (itemCount < _columnCount ? itemCount : _columnCount) * (spacing + itemWidth);

	$: innerHeight = (round.ceil(itemCount, _columnCount) * (itemHeight + (rowCount > 1 ? spacing : 0))) / _columnCount;

	$: overScanColumn = _columnCount * overScan;

	$: if (offsetWidth || _columnCount) {
		indices = getGridIndices(
			itemCount,
			itemHeight,
			spacing,
			height,
			_columnCount,
			overScanColumn,
			_scrollPosition,
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
	on:scroll
	bind:this={grid}
	bind:offsetWidth
	bind:clientWidth
>
	<div
		style:width="{usedWidth}px"
		style:margin={center ? "auto" : 0}
	>
		{#if $$slots.header}
			<div bind:offsetHeight={headerHeight}>
				<slot name="header" />
			</div>
		{/if}

		<div style:height="{innerHeight}px" style:width="100%">
			{#each indices as index (getKey(index))}
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
</div>
<script lang="ts" module>
	import {
		scrollSpeed as __scrollSpeed,
		scrollStop as _scrollStop,
		getGridIndices,
		getRowIndex,
		round,
	} from "$lib/utils";

	const scrollStop = _scrollStop();
	const _scrollSpeed = __scrollSpeed();

	export type Item = { index: number; rowIndex: number; columnIndex: number; style: string };
</script>

<script lang="ts">
	import type {
		GetKey,
		OnScroll,
		ScrollBehavior,
		ScrollEvent,
		ScrollToIndex,
		ScrollToPosition,
	} from "$lib/types";
	import type { Snippet } from "svelte";

	interface Props {
		itemCount: number;
		itemHeight: number;
		itemWidth: number;
		height: number;
		width?: string;
		overScan?: number;
		marginLeft?: number;
		marginTop?: number;
		scrollPosition?: number;
		scrollBehavior?: ScrollBehavior;
		getKey?: GetKey;
		columnCount?: number;
		onscroll?: OnScroll;
		header?: Snippet;
		item: Snippet<[Item]>;
		placeholder?: Snippet<[Item]>;
		footer?: Snippet;
	}

	let {
		itemCount,
		itemHeight,
		itemWidth,
		height,
		width = "100%",
		overScan = 1,
		marginLeft = 0,
		marginTop = 0,
		scrollPosition = $bindable(0),
		scrollBehavior = "auto",
		getKey = (index: number) => index,
		columnCount,
		onscroll,
		header,
		item,
		placeholder,
		footer,
		...rest
	}: Props = $props();

	let grid: HTMLElement | undefined = $state();

	let _scrollPosition = $state(scrollPosition);

	let headerHeight = $state(0);

	let offsetWidth = $state(0);

	let clientWidth = $state(0);

	let indices: number[] = $state([]);

	let manualScroll = false;

	let isScrolling = false;

	let isScrollingFast = $state(false);

	export const scrollToIndex: ScrollToIndex = (
		index: number,
		behavior: ScrollBehavior = scrollBehavior,
	) => {
		scrollTo(
			getRowIndex(index, _columnCount) * itemHeight + marginTop + headerHeight,
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
		if (grid && !manualScroll && !isScrolling) {
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
				columnIndex * itemWidth + marginLeft
			}px, ${
				rowIndex * itemHeight + marginTop
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

	let _columnCount = $derived(
		!columnCount
			? Math.max(~~((offsetWidth - marginLeft - (offsetWidth - clientWidth)) / itemWidth), 1)
			: columnCount,
	);

	let innerHeight = $derived((round.ceil(itemCount, _columnCount) * itemHeight) / _columnCount);

	let overScanColumn = $derived(_columnCount * overScan);

	$effect(() => {
		if (offsetWidth || _columnCount) {
			indices = getGridIndices(
				itemCount,
				itemHeight,
				height,
				_columnCount,
				overScanColumn,
				_scrollPosition,
			);
		}
	});

	$effect(() => {
		if (grid) {
			scrollToManual(scrollPosition);
		}
	});

	let scrollSpeed = $derived(
		_scrollSpeed(height, {
			fast: () => {
				isScrollingFast = true;
			},
			slow: () => {
				isScrollingFast = false;
			},
		}),
	);
</script>

<div
	style:position="relative"
	style:overflow="auto"
	style:height="{height}px"
	style:width
	onscroll={(e) => {
		onScroll(e);

		onscroll?.(e);
	}}
	bind:this={grid}
	bind:offsetWidth
	bind:clientWidth
	{...rest}
>
	{#if header}
		<div bind:offsetHeight={headerHeight}>
			{@render header()}
		</div>
	{/if}

	<div style:height="{innerHeight}px" style:width="100%">
		{#each indices as index (getKey(index))}
			{@const { rowIndex, columnIndex, style } = getItemProps(index)}

			{#if !isScrollingFast || !placeholder}
				{@render item({ index, rowIndex, columnIndex, style })}
			{:else}
				{@render placeholder({ index, rowIndex, columnIndex, style })}
			{/if}
		{/each}
	</div>

	{@render footer?.()}
</div>

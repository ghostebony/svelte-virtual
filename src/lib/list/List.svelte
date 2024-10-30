<script lang="ts" module>
	import {
		scrollSpeed as __scrollSpeed,
		scrollStop as _scrollStop,
		getListIndices,
	} from "$lib/utils";

	const scrollStop = _scrollStop();
	const _scrollSpeed = __scrollSpeed();

	export type Item = { index: number; style: string };
</script>

<script lang="ts">
	import type { GetKey, OnScroll, ScrollBehavior, ScrollEvent } from "$lib/types";
	import type { Snippet } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";

	interface Props {
		itemCount: number;
		itemSize: number;
		/**
		 * @default "100%"
		 */
		height?: number | string;
		/**
		 * @default "100%"
		 */
		width?: number | string;
		stickyIndices?: number[];
		/**
		 * @default 1
		 */
		overScan?: number;
		/**
		 * @default 0
		 */
		marginLeft?: number;
		/**
		 * @default 0
		 */
		marginTop?: number;
		/**
		 * @default "vertical"
		 */
		layout?: "vertical" | "horizontal";
		/**
		 * @default 0
		 */
		scrollPosition?: number;
		/**
		 * @default "auto"
		 */
		scrollBehavior?: ScrollBehavior;
		/**
		 * @default
		 * ```ts
		 * (index: number) => index
		 * ```
		 */
		getKey?: GetKey;
		onscroll?: OnScroll;
		header?: Snippet;
		item: Snippet<[Item]>;
		placeholder?: Snippet<[Item]>;
		footer?: Snippet;
	}

	let {
		itemCount,
		itemSize,
		height = "100%",
		width = "100%",
		stickyIndices = [],
		overScan = 1,
		marginLeft = 0,
		marginTop = 0,
		layout = "vertical",
		scrollPosition = $bindable(0),
		scrollBehavior = "auto",
		getKey = (index: number) => index,
		onscroll,
		header,
		item,
		placeholder,
		footer,
		...rest
	}: Props & Omit<SvelteHTMLElements["div"], "placeholder"> = $props();

	let list: HTMLElement | undefined = $state();

	let _scrollPosition = $state(scrollPosition);

	let headerHeight = $state(0);

	let headerWidth = $state(0);

	let offsetHeight = $state(0);

	let clientHeight = $state(0);

	let offsetWidth = $state(0);

	let clientWidth = $state(0);

	let indices: number[] = $state([]);

	let manualScroll = false;

	let isScrolling = false;

	let isScrollingFast = $state(false);

	export function scrollToIndex(index: number, behavior: ScrollBehavior = scrollBehavior) {
		scrollTo(
			index * itemSize + (isVertical ? marginTop + headerHeight : marginLeft + headerWidth),
			behavior,
		);
	}

	export function scrollToPosition(position: number, behavior: ScrollBehavior = scrollBehavior) {
		scrollTo(position, behavior);
	}

	const scrollTo = (direction: number, behavior: ScrollBehavior = scrollBehavior) => {
		if (list) {
			manualScroll = true;

			list.scrollTo({ [isVertical ? "top" : "left"]: direction, behavior });

			manualScroll = false;
		}
	};

	const scrollToManual = (scrollPosition: number) => {
		if (list && !manualScroll && !isScrolling) {
			manualScroll = true;

			list.scrollTo({ top: scrollPosition, behavior: scrollBehavior });

			manualScroll = false;
		}
	};

	const getItemStyle = (index: number) => {
		const ixis = index * itemSize;

		return `position: absolute; transform: translate3d(${
			isVertical
				? `${marginLeft}px, ${ixis + marginTop}px`
				: `${headerWidth + ixis + marginLeft}px, ${marginTop}px`
		}, 0px); ${itemSizeInternal} will-change: transform;`;
	};

	const onScroll = (event: ScrollEvent) => {
		isScrolling = true;

		if (!manualScroll) {
			if (isVertical) {
				_scrollPosition = Math.max(0, event.currentTarget["scrollTop"] - headerHeight);
				scrollPosition = event.currentTarget["scrollTop"];
			} else {
				_scrollPosition = Math.max(0, event.currentTarget["scrollLeft"] - headerWidth);
				scrollPosition = event.currentTarget["scrollLeft"];
			}

			scrollSpeed(_scrollPosition);
		}

		scrollStop(() => {
			isScrolling = false;
		});
	};

	let isVertical = $derived(layout === "vertical");

	let innerSize = $derived(itemCount * itemSize);

	let itemSizeInternal = $derived(
		isVertical
			? `height: ${itemSize}px; width: ${
					marginLeft > 0 ? `${clientWidth - marginLeft}px` : "100%"
				};`
			: `height: ${
					marginTop > 0 ? `${clientHeight - marginTop}px` : "100%"
				}; width: ${itemSize}px;`,
	);

	let size = $derived(isVertical ? offsetHeight : offsetWidth);

	$effect(() => {
		if (size) {
			indices = getListIndices(itemCount, itemSize, size, overScan, _scrollPosition);
		}
	});

	$effect(() => {
		if (list) {
			scrollToManual(scrollPosition);
		}
	});

	let scrollSpeed = $derived(
		_scrollSpeed(size, {
			fast: () => {
				isScrollingFast = true;
			},
			slow: () => {
				isScrollingFast = false;
			},
		}),
	);
</script>

<!--
@component

- Usage:

```svelte
	<script>
		import { List } from "svelte-virtual";

		let items = [...];
	</script>

	<List itemCount={items.length} itemSize={20} height={500}>
		{#snippet item({ index, style })}
			<div {style}>
				{items[index]}
			</div>
		{/snippet}
	</List>
```
-->
<div
	style:position="relative"
	style:overflow="auto"
	style:height={typeof height === "number" ? `${height}px` : height}
	style:width={typeof width !== "number" ? width : `${width}px`}
	onscroll={(e) => {
		onScroll(e);

		onscroll?.(e);
	}}
	bind:this={list}
	bind:offsetHeight
	bind:clientHeight
	bind:offsetWidth
	bind:clientWidth
	{...rest}
>
	{#if header}
		{#if isVertical}
			<div bind:offsetHeight={headerHeight}>
				{@render header()}
			</div>
		{:else}
			<div bind:offsetWidth={headerWidth} style:position="absolute">
				{@render header()}
			</div>
		{/if}
	{/if}

	<div
		style:height={isVertical ? `${innerSize}px` : "100%"}
		style:width={!isVertical ? `${innerSize}px` : "100%"}
	>
		{#if stickyIndices.length && indices.length}
			{@const stickyIndex = Math.max(...stickyIndices.filter((i) => i < indices[0]))}

			{#if stickyIndex >= 0}
				<div
					style:position="sticky"
					style:top={isVertical ? `${marginTop}px` : "0px"}
					style:left={isVertical ? "0px" : `${marginLeft}px`}
					style:z-index="1"
				>
					{@render item({ index: stickyIndex, style: "" })}
				</div>
			{/if}
		{/if}

		{#each indices as index (getKey(index))}
			{@const style = getItemStyle(index)}

			{#if !isScrollingFast || !placeholder}
				{@render item({ index, style })}
			{:else}
				{@render placeholder({ index, style })}
			{/if}
		{/each}
	</div>

	{#if footer}
		{#if isVertical}
			<div>
				{@render footer()}
			</div>
		{:else}
			<div
				style:position="absolute"
				style:top="0px"
				style:left="{headerWidth + itemCount * itemSize + marginLeft}px"
			>
				{@render footer()}
			</div>
		{/if}
	{/if}
</div>

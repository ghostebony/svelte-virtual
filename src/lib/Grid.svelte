<script lang="ts">
	import { onMount } from "svelte";

	export let itemCount: number;
	export let itemHeight: number;
	export let itemWidth: number;
	export let marginLeft: number = 0;
	export let marginTop: number = 0;
	export let height: number;
	export let width: number;

	let columnCount: number;
	let innerHeight: number;
	let startIndex = 0;
	let tempStartIndex = 0;
	let endIndex = 0;

	let mounted = false;
	let scrollTop = 0;
	let offsetWidth: number = 0;
	let clientWidth: number = 0;

	let indexes: number[];

	$: if (mounted) {
		columnCount = Math.max(
			Math.floor((width - marginLeft - (offsetWidth - clientWidth)) / itemWidth),
			1
		);
		innerHeight = Math.max(
			(Math.ceil(itemCount / columnCount) * columnCount * itemHeight) / columnCount,
			height
		);

		tempStartIndex = Math.floor(
			Math.ceil(((scrollTop / itemHeight) * columnCount) / columnCount) * columnCount
		);

		endIndex = Math.min(
			itemCount,
			Math.floor(
				Math.ceil((((scrollTop + height) / itemHeight) * columnCount) / columnCount) *
					columnCount
			)
		);

		startIndex = tempStartIndex > 0 ? tempStartIndex - columnCount : tempStartIndex;

		indexes = [];
		for (let i = 0; i < endIndex - startIndex; i++) indexes.push(i + startIndex);
	}

	onMount(() => (mounted = true));
</script>

{#if mounted}
	<div
		style="position: relative; overflow: auto; height: {height}px; width: {width}px; will-change: scroll-position;"
		on:scroll={(e) => (scrollTop = Math.max(0, e.currentTarget.scrollTop))}
		bind:offsetWidth
		bind:clientWidth
	>
		<div style="height: {innerHeight}px; width: 100%; will-change: contents;">
			{#each indexes as index}
				{@const x = (index % columnCount) * itemWidth + marginLeft}
				{@const y = (Math.ceil((index + 1) / columnCount) - 1) * itemHeight + marginTop}

				<slot
					name="item"
					{index}
					style="position: absolute; transform: translate({x}px, {y}px); height: {itemHeight}px; width: {itemWidth}px; will-change: transform, contents;"
				>
					Missing template
				</slot>
			{/each}
		</div>
	</div>
{/if}

<script lang="ts">
	import { onMount } from "svelte";

	export let itemCount: number;
	export let itemSize: number;
	export let height: number;
	export let width: string = "100%";

	export let marginLeft: number = 0;
	export let marginTop: number = 0;
	export let layout: "vertical" | "horizontal" = "vertical";

	let isVertical = layout === "vertical";
	let innerSize: number;
	let startIndex = 0;
	let tempStartIndex = 0;
	let endIndex = 0;

	let mounted = false;
	let scroll = 0;
	let offsetHeight: number = 0;
	let offsetWidth: number = 0;

	let indexes: number[];

	$: if (mounted) {
		const size = isVertical ? offsetHeight : offsetWidth;

		innerSize = Math.max(itemCount * itemSize, size);

		tempStartIndex = Math.floor(scroll / itemSize);

		startIndex = tempStartIndex > 0 ? tempStartIndex - 1 : tempStartIndex;

		endIndex = Math.min(itemCount - 1, Math.floor((scroll + size) / itemSize));

		indexes = [];
		for (let i = 0; i < endIndex - (startIndex - 1); i++) indexes.push(i + startIndex);
	}

	onMount(() => (mounted = true));
</script>

{#if mounted}
	<div
		style="position: relative; overflow: auto; height: {height}px; width: {width}; will-change: scroll-position;"
		on:scroll={(e) =>
			(scroll = Math.max(0, e.currentTarget[isVertical ? "scrollTop" : "scrollLeft"]))}
		bind:offsetHeight
		bind:offsetWidth
	>
		<div
			style="height: {isVertical ? `${innerSize}px` : '100%'}; width: {!isVertical
				? `${innerSize}px`
				: '100%'}; will-change: contents;"
		>
			{#each indexes as index}
				{@const style = `position: absolute; transform: translate(${
					isVertical
						? `${marginLeft}px, ${index * itemSize + marginTop}px`
						: `${index * itemSize + marginLeft}px, ${marginTop}px`
				}); ${
					isVertical
						? `height: ${itemSize}px; width: ${
								marginLeft ? `${offsetWidth - marginLeft * 2}px` : "100%"
						  };`
						: `height: ${
								marginTop ? `${offsetHeight - marginTop * 2}px` : "100%"
						  }; width: ${itemSize}px;`
				} will-change: transform, contents;`}

				<slot name="item" {index} {style}>Missing template</slot>
			{/each}
		</div>
	</div>
{/if}

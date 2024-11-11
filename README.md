# svelte-virtual

## About

Svelte components for efficiently rendering large lists. Instead of rendering all your data, svelte-virtual renders only what's visible

## Installation

With npm:

```
npm i -D svelte-virtual@next
```

With yarn:

```
yarn add -D svelte-virtual@next
```

With pnpm:

```
pnpm add -D svelte-virtual@next
```

## Usage

### Vertical List [default] ([demo](https://svelte.dev/repl/70b159e914024f869180c28b8e7eb92d))

```svelte
<script>
	import { List } from "svelte-virtual";

	let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={20} height={500}>
	{#snippet item({ index, style })}
		<div {style}>
			{items[index]}
		</div>
	{/snippet}
</List>
```

### Horizontal List ([demo](https://svelte.dev/repl/160a5bf2e2a8484c8ffd03b219f5eb27))

```svelte
<script>
	import { List } from "svelte-virtual";

	let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={60} height={40} layout="horizontal">
	{#snippet item({ index, style })}
		<div {style}>
			{items[index]}
		</div>
	{/snippet}
</List>
```

### Grid ([demo](https://svelte.dev/repl/8e2b877da06c4532ae50482236abbcac))

```svelte
<script>
	import { Grid } from "svelte-virtual";

	let items = [...Array(100000).keys()];
</script>

<Grid itemCount={items.length} itemHeight={50} itemWidth={60} height={500}>
	{#snippet item({ index, style })}
		<div {style}>
			{items[index]}
		</div>
	{/snippet}
</Grid>
```

### Grid [using rows and columns] ([demo](https://svelte.dev/repl/1b2b8cdcb6674f2c8a9e434009f6df3b))

```svelte
<script>
	import { Grid } from "svelte-virtual";

	let itemCount = 100000;
	let columnCount = 5;

	let items = Array.from({ length: itemCount }, (_, l) =>
		Array.from({ length: columnCount }, (_, c) => `${l}-${c}`),
	);
</script>

<Grid itemCount={itemCount * columnCount} itemHeight={50} itemWidth={65} height={500} {columnCount}>
	{#snippet item({ rowIndex, columnIndex, style })}
		<div {style}>
			{items[rowIndex][columnIndex]}
		</div>
	{/snippet}
</Grid>
```

## Props

### List

| Property        | Type                                     | Default                    | Required? |
| :-------------- | :--------------------------------------- | :------------------------- | :-------: |
| itemCount       | `number`                                 |                            |     ✓     |
| itemSize        | `number`                                 |                            |     ✓     |
| height          | `number \| string`                       | `"100%"`                   |           |
| width           | `number \| string`                       | `"100%"`                   |           |
| stickyIndices   | `number[]`                               | `[]`                       |           |
| overScan        | `number`                                 | `1`                        |           |
| marginLeft      | `number`                                 | `0`                        |           |
| marginTop       | `number`                                 | `0`                        |           |
| layout          | `"vertical" \| "horizontal"`             | `"vertical"`               |           |
| scrollPosition  | `number`                                 | `0`                        |           |
| scrollAlignment | `"auto" \| "start" \| "center" \| "end"` | `"auto"`                   |           |
| scrollBehavior  | `"auto" \| "smooth"`                     | `"auto"`                   |           |
| getKey          | `(index: number) => unknown`             | `(index: number) => index` |           |

### Grid

| Property       | Type                         | Default                    | Required? |
| :------------- | :--------------------------- | :------------------------- | :-------: |
| itemCount      | `number`                     |                            |     ✓     |
| itemHeight     | `number`                     |                            |     ✓     |
| itemWidth      | `number`                     |                            |     ✓     |
| height         | `number`                     |                            |     ✓     |
| width          | `string`                     | `"100%"`                   |           |
| overScan       | `number`                     | `1`                        |           |
| marginLeft     | `number`                     | `0`                        |           |
| marginTop      | `number`                     | `0`                        |           |
| scrollPosition | `number`                     | `0`                        |           |
| scrollBehavior | `"auto" \| "smooth"`         | `"auto"`                   |           |
| getKey         | `(index: number) => unknown` | `(index: number) => index` |           |
| columnCount    | `number`                     | `undefined`                |           |

## Methods ([demo](https://svelte.dev/repl/8efc42f67dc5493aabe465c589af62e7))

<table>
	<thead>
		<tr>
			<th align="left">Method</th>
			<th align="left">Argument</th>
			<th align="left">Type</th>
			<th align="left">Default</th>
			<th align="center">Required?</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td rowspan="4">scrollToIndex</td>
		</tr>
		<tr>
			<td>index</td>
			<td><code>number</code></td>
			<td></td>
			<td align="center">✓</td>
		</tr>
		<tr>
			<td>alignment</td>
			<td><code>"auto" | "start" | "center" | "end"</code></td>
			<td><code>scrollAlignment</code></td>
			<td align="center"></td>
		</tr>
		<tr>
			<td>behavior</td>
			<td><code>"auto" | "smooth"</code></td>
			<td><code>scrollBehavior</code></td>
			<td align="center"></td>
		</tr>
		<tr>
			<td rowspan="3">scrollToPosition</td>
		</tr>
		<tr>
			<td>position</td>
			<td><code>number</code></td>
			<td></td>
			<td align="center">✓</td>
		</tr>
		<tr>
			<td>behavior</td>
			<td><code>"auto" | "smooth"</code></td>
			<td><code>scrollBehavior</code></td>
			<td align="center"></td>
		</tr>
	</tbody>
</table>

## Snippets

-   `item` - Snippet for each item
    -   Props:
        -   Shared:
            -   `index: number` - Item index
            -   `style: string` - Item style must be applied to the first child element of the snippet (look above for example)
        -   Only for `<Grid/>` ([demo](#grid-using-rows-and-columns-demo)):
            -   `rowIndex: number` - Item row index
            -   `columnIndex: number` - Item column index
-   `placeholder` (optional) - Snippet for each item (when scrolling fast, replaces `item` snippet. if not present, `item` snippet is used)
    -   Props:
        -   Shared:
            -   `index: number` - Item index
            -   `style: string` - Item style must be applied to the first child element of the snippet (look above for example)
        -   Only for `<Grid/>` ([demo](#grid-using-rows-and-columns-demo)):
            -   `rowIndex: number` - Item row index
            -   `columnIndex: number` - Item column index
-   `header` (optional) - Snippet for the elements that should appear at the top of the component
-   `footer` (optional) - Snippet for the elements that should appear at the bottom of the component

## License

[MIT](./LICENSE)

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
	import { List } from "svelte-virtual@next";

	let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={20} height={500}>
	<div slot="item" let:index let:style {style}>
		{items[index]}
	</div>
</List>
```

### Horizontal List ([demo](https://svelte.dev/repl/160a5bf2e2a8484c8ffd03b219f5eb27))

```svelte
<script>
	import { List } from "svelte-virtual@next";

	let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={60} height={40} layout="horizontal">
	<div slot="item" let:index let:style {style}>
		{items[index]}
	</div>
</List>
```

### Grid ([demo](https://svelte.dev/repl/8e2b877da06c4532ae50482236abbcac))

```svelte
<script>
	import { Grid } from "svelte-virtual@next";

	let items = [...Array(100000).keys()];
</script>

<Grid itemCount={items.length} itemHeight={50} itemWidth={60} height={500}>
	<div slot="item" let:index let:style {style}>
		{items[index]}
	</div>
</Grid>
```

## Props

### List

| Property       | Type                         | Default                    | Required? |
| :------------- | :--------------------------- | :------------------------- | :-------: |
| itemCount      | `number`                     |                            |     ✓     |
| itemSize       | `number`                     |                            |     ✓     |
| height         | `number`                     |                            |     ✓     |
| width          | `string`                     | `"100%"`                   |           |
| overScan       | `number`                     | `1`                        |           |
| marginLeft     | `number`                     | `0`                        |           |
| marginTop      | `number`                     | `0`                        |           |
| layout         | `"vertical" \| "horizontal"` | `"vertical"`               |           |
| scrollPosition | `number`                     | `0`                        |           |
| scrollBehavior | `"auto" \| "smooth"`         | `"auto"`                   |           |
| getKey         | `(index: number) => unknown` | `(index: number) => index` |           |

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

| Property          | Arguments                                        | Default          |
| :---------------- | :----------------------------------------------- | :--------------- |
| setScrollIndex    | `index: number, behavior: "auto" \| "smooth"`    | `scrollBehavior` |
| setScrollPosition | `position: number, behavior: "auto" \| "smooth"` | `scrollBehavior` |

## Slots

-   `item` - Slot for each item
    -   Props:
        -   Shared:
            -   `index: number` - Item index
            -   `style: string` - Item style, must be applied to the slot (look above for example)
        -   Only for `<Grid/>`:
            -   `rowIndex: number` - Item row index
            -   `columnIndex: number` - Item column index
-   `placeholder` (optional) - Slot for each item (when scrolling fast, replaces `item` slot. if not present, `item` slot is used)
    -   Props:
        -   Shared:
            -   `index: number` - Item index
            -   `style: string` - Item style, must be applied to the slot (look above for example)
        -   Only for `<Grid/>`:
            -   `rowIndex: number` - Item row index
            -   `columnIndex: number` - Item column index
-   `header` (optional) - Slot for the elements that should appear at the top of the component
-   `footer` (optional) - Slot for the elements that should appear at the bottom of the component

## License

[MIT](./LICENSE)

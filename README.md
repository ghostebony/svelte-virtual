# svelte-virtual

## About

Svelte components for efficiently rendering large lists. Instead of rendering all your data, svelte-virtual renders only what's visible

## Installation

With npm:

```
npm i -D svelte-virtual
```

With yarn:

```
yarn add -D svelte-virtual
```

With pnpm:

```
pnpm add -D svelte-virtual
```

## Usage

### Vertical List [default] ([demo](https://svelte.dev/repl/70b159e914024f869180c28b8e7eb92d?version=3.49.0))

```svelte
<script>
  import { List } from "svelte-virtual";

  let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={20} height={500}>
  <div slot="item" let:index let:style {style}>
    {items[index]}
  </div>
</List>
```

### Horizontal List ([demo](https://svelte.dev/repl/160a5bf2e2a8484c8ffd03b219f5eb27?version=3.49.0))

```svelte
<script>
  import { List } from "svelte-virtual";

  let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={60} height={40} layout="horizontal">
  <div slot="item" let:index let:style {style}>
    {items[index]}
  </div>
</List>
```

### Grid ([demo](https://svelte.dev/repl/8e2b877da06c4532ae50482236abbcac?version=3.49.0))

```svelte
<script>
  import { Grid } from "svelte-virtual";

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

| Property          | Type                         | Default      | Required? |
| :---------------- | :--------------------------- | :----------- | :-------: |
| itemCount         | `number`                     |              |     ✓     |
| itemSize          | `number`                     |              |     ✓     |
| height            | `number`                     |              |     ✓     |
| width             | `string`                     | `"100%"`     |           |
| overscan          | `number`                     | `1`          |           |
| marginLeft        | `number`                     | `0`          |           |
| marginTop         | `number`                     | `0`          |           |
| layout            | `"vertical" \| "horizontal"` | `"vertical"` |           |
| scrollToIndex     | `number \| undefined`        | `undefined`  |           |
| scrollToPosition  | `number \| undefined`        | `undefined`  |           |
| scrollToBehaviour | `"auto" \| "smooth"`         | `"auto"`     |           |

### Grid

| Property          | Type                  | Default     | Required? |
| :---------------- | :-------------------- | :---------- | :-------: |
| itemCount         | `number`              |             |     ✓     |
| itemHeight        | `number`              |             |     ✓     |
| itemWidth         | `number`              |             |     ✓     |
| height            | `number`              |             |     ✓     |
| width             | `string`              | `"100%"`    |           |
| overscan          | `number`              | `1`         |           |
| marginLeft        | `number`              | `0`         |           |
| marginTop         | `number`              | `0`         |           |
| scrollToIndex     | `number \| undefined` | `undefined` |           |
| scrollToPosition  | `number \| undefined` | `undefined` |           |
| scrollToBehaviour | `"auto" \| "smooth"`  | `"auto"`    |           |

## Methods ([demo](https://svelte.dev/repl/8efc42f67dc5493aabe465c589af62e7?version=3.49.0))

| Property          | Arguments          |
| :---------------- | :----------------- |
| scrollTo.index    | `index: number`    |
| scrollTo.position | `position: number` |

## Slots

-   `item` - Slot for each item
    -   Props:
        -   `index: number` - Item index
        -   `scrollPosition: number` - Item scroll position in the list
        -   `style: string` - Item style, must be applied to the slot (look above for example)
-   `header` - Slot for the elements that should appear at the top of the component
-   `footer` - Slot for the elements that should appear at the bottom of the component

## License

[MIT](./LICENSE)

# svelte-virtual

## Installation

```
npm install -D svelte-virtual
```

## Usage

### Vertical List [default] ([demo](https://svelte.dev/repl/70b159e914024f869180c28b8e7eb92d?version=3.49.0))

```svelte
<script lang="ts">
  import { List } from "svelte-virtual";

  let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={20} height={500} width={60}>
  <div slot="item" let:index let:style {style}>
    {items[index]}
  </div>
</List>
```

### Horizontal List ([demo](https://svelte.dev/repl/160a5bf2e2a8484c8ffd03b219f5eb27?version=3.49.0))

```svelte
<script lang="ts">
  import { List } from "svelte-virtual";

  let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={60} height={40} width={500} layout="horizontal">
  <div slot="item" let:index let:style {style}>
    {items[index]}
  </div>
</List>
```

### Grid ([demo](https://svelte.dev/repl/8e2b877da06c4532ae50482236abbcac?version=3.49.0))

```svelte
<script lang="ts">
  import { Grid } from "svelte-virtual";

  let items = [...Array(100000).keys()];
</script>

<Grid itemCount={items.length} itemHeight={50} itemWidth={50} height={500} width={500}>
  <div slot="item" let:index let:style {style}>
    {items[index]}
  </div>
</Grid>
```

## Props

### List

| Property   | Type                         | Required? |
| :--------- | :--------------------------- | :-------: |
| itemCount  | `number`                     |     ✓     |
| itemSize   | `number`                     |     ✓     |
| height     | `number`                     |     ✓     |
| width      | `number`                     |     ✓     |
| marginLeft | `number`                     |           |
| marginTop  | `number`                     |           |
| layout     | `"vertical" \| "horizontal"` |           |

### Grid

| Property   | Type     | Required? |
| :--------- | :------- | :-------: |
| itemCount  | `number` |     ✓     |
| itemHeight | `number` |     ✓     |
| itemWidth  | `number` |     ✓     |
| height     | `number` |     ✓     |
| width      | `number` |     ✓     |
| marginLeft | `number` |           |
| marginTop  | `number` |           |

## License

[MIT](./LICENSE)

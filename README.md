# svelte-virtual

## Installation

```
npm install -D svelte-virtual
```

## Usage

### Vertical List (default)

```svelte
<script lang="ts">
	import List from "svelte-virtual";

	let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={20} height={500} width={60}>
	<div slot="item" let:index let:style {style}>
		{items[index]}
	</div>
</List>
```

### Horizontal List

```svelte
<script lang="ts">
	import List from "svelte-virtual";

	let items = [...Array(100000).keys()];
</script>

<List itemCount={items.length} itemSize={60} height={40} width={500} layout="horizontal">
	<div slot="item" let:index let:style {style}>
		{items[index]}
	</div>
</List>
```

### Grid

```svelte
<script lang="ts">
	import Grid from "svelte-virtual";

	let items = [...Array(100000).keys()];
</script>

<Grid itemCount={items.length} itemHeight={50} itemWidth={50} height={500} width={500}>
	<div slot="item" let:index let:style {style}>
		{items[index]}
	</div>
</Grid>
```

See [documentation](https://svelte-virtual.pages.dev "Svelte Virtual documentation") for more.

## License

This library is licensed under the MIT license; see the LICENSE file for more.

export function scrollStop(refresh = 100) {
	let isScrolling: ReturnType<typeof setTimeout>;

	return (callback: () => void) => {
		clearTimeout(isScrolling);

		isScrolling = setTimeout(callback, refresh);
	};
}

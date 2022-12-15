export function scrollStop(refresh = 100) {
	let isScrolling: ReturnType<typeof setTimeout>;

	return (callback: () => void) => {
		clearTimeout(isScrolling);

		isScrolling = setTimeout(callback, refresh);
	};
}

export function scrollSpeed(refresh = 200) {
	let lastScrollPosition: number | undefined = undefined;
	let isScrollingFast: ReturnType<typeof setTimeout> | undefined;

	return (
			size: number,
			callback: {
				fast: () => void;
				slow: () => void;
			}
		) =>
		(scrollPosition: number) => {
			if (!lastScrollPosition) {
				lastScrollPosition = scrollPosition;
			} else {
				if (Math.abs(scrollPosition - lastScrollPosition) > size) {
					callback.fast();

					if (isScrollingFast !== undefined) {
						clearTimeout(isScrollingFast);

						isScrollingFast = undefined;
					}

					isScrollingFast = setTimeout(() => {
						callback.slow();

						isScrollingFast = undefined;
					}, refresh);
				} else {
					if (isScrollingFast === undefined) {
						callback.slow();
					}
				}

				lastScrollPosition = scrollPosition;
			}
		};
}

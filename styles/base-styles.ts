import { css } from 'lit';

const StylesBase = css`
	/* Box sizing rules */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen-Sans, Ubuntu, Cantarell,
			'Helvetica Neue', Roboto, sans-serif;
	}

	/* Remove default padding */
	ul,
	ol {
		padding: 0;
	}

	/* Remove default margin */
	body,
	h1,
	h2,
	h3,
	h4,
	p,
	ul,
	ol,
	li,
	figure,
	figcaption,
	blockquote,
	dl,
	dd {
		margin: 0;
	}

	/* headers */
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: 500;
		font-size: 1rem;
		line-height: 1.5;
		margin-top: 0;
		margin-bottom: 0.25rem;
		color: inherit;
	}

	h1 {
		font-size: 1.5rem;
		line-height: 1.25;
		margin-bottom: 0.875rem;
	}

	h2 {
		font-size: 1.5rem;
		line-height: 1.25;
		margin-bottom: 0.125rem;
	}

	h3 {
		margin-bottom: 0.5rem;
	}

	/* Inherit fonts for inputs and buttons */
	input,
	button,
	textarea,
	select {
		font: inherit;
	}

	/* Remove all animations and transitions for people that prefer not to see them */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}

	/* tables */
	table {
		border-collapse: collapse;
	}
	th {
		text-align: inherit;
	}

	ul:last-of-type {
		margin-bottom: 0;
	}

	strong {
		font-weight: 500;
	}

	hr {
		border: 0;
		border-top: 1px dotted rgb(var(--silver));
		margin: 0.5rem 0;
	}

	a {
		color: rgb(var(--light-purple));
		text-decoration: none;
		transition: color 0.15s ease-out, fill 0.15s ease-out, background-color 0.15s ease-out;
		-webkit-tap-highlight-color: rgba(var(--light-purple), 0.05);
	}

	a:focus {
		outline: 0;
		box-shadow: rgb(var(--purple)) 0 0 6px;
	}

	a:hover {
		color: rgb(var(--purple));
	}

	a:active {
		background: rgba(var(--purple), 0.075);
	}

	@keyframes pulse {
		0% {
			background-color: rgba(var(--main-gray), 0.15);
		}
		50% {
			background-color: rgba(var(--main-gray), 0.25);
		}
		100% {
			background-color: rgba(var(--main-gray), 0.15);
		}
	}

	.fadein {
		animation: fadein 0.2s;
	}

	@keyframes fadein {
		from {
			opacity: 0.15;
		}
		to {
			opacity: 1;
		}
	}

	/* temp here */

	/* colors */
	:host {
		--light-purple: 241, 230, 244;
		--purple: 155, 88, 182;
		--success: 18, 196, 155;
		--danger: 221, 52, 68;
		--warning: 246, 200, 5;
		--splash-blue: 46, 165, 189;

		--darkest: 27, 27, 27;
		--off-black: 38, 38, 38;
		--dark-gray: 49, 49, 49;
		--steel: 102, 102, 102;
		--main-gray: 128, 128, 128;
		--boring-gray: 170, 180, 180;
		--input-gray: 204, 204, 204;
		--silver: 225, 225, 226;
		--light-gray: 223, 223, 223;
		--lightest-gray: 240, 240, 240;
		--off-white: 250, 250, 250;

		/* sizings */
		--gap: 0.75rem;
		--gap-half: 0.375rem;
		/* 1/2 of gutter width */
		--border-radius: 0.25rem;
		--event-icon-size: 2.5rem;
		--border-width: 1px;

		/* font-size */
		--largest: 1.5rem;
		--large: 1.2rem;
		--medium: 1rem;
		--smaller: 0.875rem;
		--smallest: 0.75rem;

		--shadow-sm: 0 0.125rem 0.25rem 0 rgba(var(--main-gray), 0.25);
		--shadow-md: 0 0 0.75rem 0 rgba(var(--main-gray), 0.5);
		--shadow-lg: 0 0.125rem 1.5rem 0.125rem rgba(var(--main-gray), 0.5);

		--box-shadow: rgba(var(--main-gray), 0.15) 0px 0px 1px 0px,
			rgba(var(--main-gray), 0.15) 0px 0px 3px 0px, rgba(var(--main-gray), 0.15) 0px 0px 4px 0px,
			rgba(var(--main-gray), 0.15) 0px 0px 7px 0px, rgba(var(--main-gray), 0.15) 0px 0px 11px 0px;

		--box-shadow-bottom: rgba(var(--main-gray), 0.15) 0px 1px 1px -1px,
			rgba(var(--main-gray), 0.15) 0px 3px 3px -3px, rgba(var(--main-gray), 0.15) 0px 4px 4px -4px,
			rgba(var(--main-gray), 0.15) 0px 7px 7px -7px,
			rgba(var(--main-gray), 0.15) 0px 11px 11px -11px;

		--filter-effect-modal: saturate(150%) blur(8px);

		--base-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen-Sans, Ubuntu, Cantarell,
			'Helvetica Neue', Roboto, sans-serif;
	}
`;

export default StylesBase;

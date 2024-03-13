import { css } from 'lit';

// language=CSS
const StylesButton = css`
	@media screen and (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 400;
		white-space: nowrap;
		user-select: none;
		box-sizing: border-box;
		border: 0;
		background-color: transparent;
		cursor: pointer;
		padding: var(--gap);
		font-size: 1rem;
		line-height: 1.5;
		transition: background-color 0.15s ease-out, color 0.15s ease-out border-color 0.15s ease-out,
			fill 0.15s ease-out;
		text-decoration: none;
		margin: 0;
	}

	.btn:focus {
		outline: 0;
		box-shadow: 0 0 0.75rem 0 rgba(var(--purple), 0.7);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;
export default StylesButton;

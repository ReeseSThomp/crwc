import { css } from 'lit';

// language=CSS
const StylesSpinner = css`
	.spinner,
	.spinner:after {
		border-radius: 50%;
		width: 35%;
		height: 35%;
		box-sizing: content-box;
	}

	.spinner {
		border-top: 0.5rem solid rgba(var(--main-gray), 0.3);
		border-right: 0.5rem solid rgba(var(--main-gray), 0.3);
		border-bottom: 0.5rem solid rgba(var(--main-gray), 0.3);
		border-left: 0.5rem solid rgba(var(--main-gray), 1);
		animation: spinner 1s infinite linear;
		margin-right: 0.5rem;
	}

	.spinner-light {
		border-top: 0.5rem solid rgba(var(--light-gray), 0.3);
		border-right: 0.5rem solid rgba(var(--light-gray), 0.3);
		border-bottom: 0.5rem solid rgba(var(--light-gray), 0.3);
		border-left: 0.5rem solid rgba(var(--light-gray), 1);
	}

	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.spinner-contain-btn {
		width: 1.5rem;
		height: 1.5rem;
		margin-right: var(--gap);
		position: absolute;
		right: 0;
		top: 25%;
		-webkit-animation-name: fadeIn;
		animation-name: fadeIn;
		animation-duration: 1s;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.modal-spinner-container {
		width: 10rem;
		height: 10rem;
		display: flex;
		justify-content: center;
		margin: 0 auto;
	}

	.input-spinner-container {
		width: 1.5rem;
		height: 1.5rem;
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
	}

	.page-spinner-container {
		margin: 20% auto 0 auto;
		width: 10rem;
		height: 10rem;
	}
`;

export default StylesSpinner;

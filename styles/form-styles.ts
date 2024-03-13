import { css } from 'lit';

// language=CSS
const StylesForm = css`
	.base-input {
		display: block;
		position: relative;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgb(var(--input-gray));
		background-color: rgb(var(--off-white));
		color: rgb(var(--main-gray));
		margin: 0px auto;
		padding: 1.5rem 0.5rem 0.5rem 0.5rem;
		height: 2.5rem;
		font-size: 1rem;
		outline: none;
		transition: all 0.2s ease-in-out;
	}

	.base-input:-webkit-autofill {
		-webkit-text-fill-color: rgb(var(--main-gray));
	}

	.base-input[disabled] {
		color: rgb(var(--silver));
		border-color: rgb(var(--silver)) !important;
	}

	.base-input[disabled]:hover {
		border-color: rgb(var(--silver)) !important;
	}

	.float-label + label,
	.base-input:focus + label {
		top: 0;
		line-height: 1.25rem;
		font-size: var(--smallest);
		color: rgb(var(--steel));
	}

	.base-input[disabled] + label {
		color: rgb(var(--silver));
	}

	.base-input:hover,
	.base-input:focus {
		border-color: rgb(var(--purple));
	}

	.base-input-label {
		display: block;
		position: absolute;
		top: 0.3rem;
		left: 0.5rem;
		text-align: left;
		width: 95%;
		line-height: 2rem;
		font-size: 1rem;
		background: transparent;
		color: rgb(var(--main-gray));
		margin: 0 auto;
		pointer-events: none;
		cursor: text;
		transition: all 0.15s ease-in-out;
	}

	.combobox-label {
		font-style: italic;
		color: rgb(var(--main-gray));
	}

	.input-error-label {
		color: rgb(var(--danger));
		font-size: 0.7rem;
		margin: 0;
		max-height: 0;
		transition: max-height 0.5s linear;
		overflow-y: hidden;
	}

	.input-error-label-show {
		max-height: 2rem;
	}

	.input-is-error {
		border-color: rgb(var(--danger));
	}

	.error-spacer {
		height: 1rem;
		transition: height 0.25s linear;
	}

	.success-message {
		margin-top: auto;
		margin-bottom: 1rem;
		font-style: italic;
		text-align: center;
		color: rgb(var(--success));
	}

	.error-message {
		margin-top: auto;
		margin-bottom: 1rem;
		font-style: italic;
		text-align: center;
		color: rgb(var(--danger));
	}

	.check-container {
		margin: 0 auto;
		height: 3rem;
		width: 3rem;
	}

	.form-text {
		color: rgb(var(--main-gray));
		font-size: var(--medium);
	}
`;

export default StylesForm;

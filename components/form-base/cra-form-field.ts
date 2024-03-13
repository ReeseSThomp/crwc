import { FormBaseData } from './cra-form-controller';

type PossibleFormValues = string | boolean | number | string[] | number[] | boolean[] | undefined;

export type ValidationResult = {
	isError: boolean;
	errorMessage: string;
};

type FormFieldOptions<V extends PossibleFormValues, N extends string> = {
	validateField?: (
		value: V,
		entireForm: FormBaseData<N>,
	) => Promise<ValidationResult> | ValidationResult;
	isError?: boolean;
	isLoading?: boolean;
	errorMessage?: string;
};

export function validateNotEmpty<V extends PossibleFormValues>(
	errorMessage: string,
): (value: V) => Promise<ValidationResult> | ValidationResult {
	return (value) => {
		if ((Array.isArray(value) || typeof value === 'string') && value.length < 1) {
			return { isError: true, errorMessage };
		}
		if (value === undefined) {
			return { isError: true, errorMessage };
		}
		return { isError: false, errorMessage: '' };
	};
}
export class FormField<V extends PossibleFormValues, N extends string> {
	public value: V;

	public isError = false;

	public isLoading = false;

	public errorMessage = '';

	#initialValue: V;

	#lastCheckedDirty?: V;

	#lastCheckedValidate?: V;

	#isDirty = false;

	options?: FormFieldOptions<V, N>;

	#validateField?: (
		value: V,
		entireForm: FormBaseData<N>,
	) => Promise<ValidationResult> | ValidationResult;

	public constructor(initialValue: V, options?: FormFieldOptions<V, N>) {
		const opts = { ...{ isError: false, isLoading: false, errorMessage: '' }, ...(options || {}) };

		this.options = opts;

		this.#initialValue = initialValue;
		this.value = initialValue;
		this.#validateField = opts.validateField;
		this.isError = opts.isError;
		this.isLoading = opts.isLoading;
		this.errorMessage = opts.errorMessage;
	}

	/** Has changed from original value this field was populated with */
	public get isDirty(): boolean {
		if (this.value === this.#lastCheckedDirty) {
			return this.#isDirty;
		}

		if (Array.isArray(this.value) && Array.isArray(this.#initialValue)) {
			const currentValue = [...this.value].sort();
			const initialValue = [...this.#initialValue].sort();
			this.#isDirty =
				currentValue.length !== initialValue.length ||
				!currentValue.every((v, i) => v === initialValue[i]);
		} else {
			this.#isDirty = this.value !== this.#initialValue;
		}
		this.#lastCheckedDirty = this.value;

		return this.#isDirty;
	}

	async validateField(value: V, entireForm: FormBaseData<N>, forceValidate = false): Promise<void> {
		if (this.value === this.#lastCheckedValidate && !forceValidate) {
			return;
		}
		this.#lastCheckedValidate = this.value;
		if (this.#validateField) {
			this.isLoading = true;
			const res = await this.#validateField(value, entireForm);
			this.isError = res.isError;
			this.errorMessage = res.errorMessage;
			this.isLoading = false;
		}
	}
}

export default FormField;

import { ReactiveController, ReactiveElement } from 'lit';
import FormField from './cra-form-field';

type PossibleFormValues = string | boolean | number | string[] | number[] | boolean[];

export const CRA_FORM_DIFFERED = 'cra:form:differed';

export declare type FormBaseData<N extends string> = Record<
	N,
	| FormField<string, N>
	| FormField<string | undefined, N>
	| FormField<boolean, N>
	| FormField<number, N>
	| FormField<number | undefined, N>
	| FormField<string[], N>
	| FormField<number[], N>
	| FormField<boolean[], N>
>;

export interface TextEvent<N extends string = string> {
	name: N;
	value: string;
}

export interface KeyEvent {
	name: string;
	key: string;
}

export interface ArrayChangeEvent<N extends string = string> {
	name: N;
	value: string[] | number[] | boolean[];
}

function arrayIsProbablyType(arr: unknown[], type: 'string' | 'number' | 'boolean'): boolean {
	if (!arr.length) {
		return true;
	}
	if (typeof arr[0] === type) {
		return true;
	}
	return false;
}

/**
 * @fires cra:form:differed
 */
export class CRAFormController<
	N extends string = string,
	F extends FormBaseData<N> = FormBaseData<N>,
> implements ReactiveController
{
	#host: ReactiveElement;

	initialValues?: { [P in keyof F]?: F[P]['value'] };

	data: F;

	generator: (_values?: { [P in keyof F]?: F[P]['value'] }) => F;

	differedCallback?: (hasDiffered: boolean) => void;

	constructor(
		host: ReactiveElement,
		generator: (_values?: { [P in keyof F]?: F[P]['value'] }) => F,
		differedCallback?: (hasDiffered: boolean) => void,
		initialValues?: { [P in keyof F]?: F[P]['value'] },
	) {
		(this.#host = host).addController(this);
		this.initialValues = initialValues;
		this.generator = generator;
		this.differedCallback = differedCallback;
		this.data = this.generator(initialValues);
	}

	initialValuesDiffer(values?: { [P in keyof F]?: F[P]['value'] }) {
		return (
			values !== this.initialValues && JSON.stringify(values) !== JSON.stringify(this.initialValues)
		);
	}

	regenerate(values?: { [P in keyof F]?: F[P]['value'] }) {
		this.initialValues = values;
		this.data = this.generator(values);
	}

	getValues() {
		return Object.entries(this.data).reduce((acc, [key, field]) => {
			acc[key as N] = (field as FormField<F[N]['value'], N>).value;
			return acc;
		}, {} as { [P in keyof F]?: F[P]['value'] });
	}

	#differed = false;

	differed() {
		this.#differed = Object.values(this.data).some((field): boolean => {
			const theField = field as FormField<PossibleFormValues, N>;
			return theField.isDirty;
		});

		if (this.differedCallback) {
			this.differedCallback(this.#differed);
			// this.#host.dispatchEvent(new CustomEvent(CRA_FORM_DIFFERED, { detail: this.#differed }));
		}
		return this.#differed;
	}

	hostDisconnected() {
		if (this.differedCallback) {
			this.differedCallback(false);
		}
		// this.#host.dispatchEvent(new CustomEvent(CRA_FORM_DIFFERED, { detail: false }));
	}

	updateValue(field: N, value: PossibleFormValues): void {
		if (!this.data[field] || typeof this.data[field].value !== typeof value) {
			return;
		}
		if (Array.isArray(value)) {
			const formDataFieldValue = this.data[field].value;
			if (!Array.isArray(formDataFieldValue)) {
				return;
			}
			if (
				arrayIsProbablyType(formDataFieldValue, 'string') &&
				arrayIsProbablyType(value, 'string')
			) {
				(this.data[field].value as Array<string>) = value as Array<string>;
			} else if (
				arrayIsProbablyType(formDataFieldValue, 'boolean') &&
				arrayIsProbablyType(value, 'boolean')
			) {
				(this.data[field].value as Array<boolean>) = value as Array<boolean>;
			} else if (
				arrayIsProbablyType(formDataFieldValue, 'number') &&
				arrayIsProbablyType(value, 'number')
			) {
				(this.data[field].value as Array<number>) = value as Array<number>;
			}
		}
		if (typeof value === 'string') {
			this.data[field].value = value;
		}
		if (typeof value === 'boolean') {
			(this.data[field].value as boolean) = value;
		}
		if (typeof value === 'number') {
			(this.data[field].value as number) = value;
		}

		this.differed();
		this.#host.requestUpdate();
	}

	async validateField(field: N, forceValidate = false) {
		const formFieldType = typeof this.data[field].value as string | number | boolean;
		const formField = this.data[field] as FormField<typeof formFieldType, N>;

		if (!formField) {
			return false; // Field names that don't exist are not valid
		}
		await formField.validateField(formField.value, this.data, forceValidate);

		this.differed();
		this.#host.requestUpdate();

		return !formField.isError;
	}

	async validateAllAndCheck() {
		const promises = Object.keys(this.data).map((key) => {
			return this.validateField(key as N);
		});
		const validation = await Promise.all(promises);

		return validation.every((result) => result);
	}

	handleTextInput = (e: CustomEvent<TextEvent<N>>) => {
		const { name, value } = e.detail || e.currentTarget;
		this.updateValue(name, value);
	};

	handleTextBlur = (e: CustomEvent<TextEvent<N>>) => {
		const { name } = e.detail || e.currentTarget;
		void this.validateField(name);
	};

	handleArrayChange = (e: CustomEvent<ArrayChangeEvent<N>>) => {
		const { name, value } = e.detail || e.currentTarget;
		this.updateValue(name, value);
		void this.validateField(name);
	};
}

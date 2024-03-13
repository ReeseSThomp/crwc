import { toHaveNoViolations } from 'jest-axe';
import { LitElement, TemplateResult, render } from 'lit';

expect.extend(toHaveNoViolations);

export async function fixture<El extends LitElement>(template: TemplateResult): Promise<El> {
	render(template, document.body);
	const el = document.body.firstElementChild as El;
	await el.updateComplete;
	return el;
}

export default fixture;

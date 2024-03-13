import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './components';

@customElement('cra-playground')
export default class Playground extends LitElement {
	static override get styles(): CSSResultArray {
		return [
			css`
				body {
					padding: 2rem;
				}
				.combobox-two {
					display: flex;
					flex-direction: column;
					border: 1px solid rgb(var(--input-gray));
					background-color: rgb(var(--off-white));
					padding: 0.5rem;
				}
				.combobox-two::part(input) {
					border: none;
				}
				.combobox-two::part(input)::placeholder {
					font-style: italic;
				}

				.combobox-three {
					display: flex;
					flex-direction: column;
					background-color: rgb(var(--off-white));
					padding: 0.5rem;
				}
				.combobox-three::part(input) {
					border: none;
					transition: none;
				}
				.combobox-three::part(label) {
					color: rgb(var(--splash-blue));
				}
				.combobox-three:hover,
				.combobox-three:hover::part(input),
				.combobox-three:focus,
				.combobox-three:focus::part(input) {
					background-color: rgb(var(--input-gray));
				}
				.combobox-three::part(dropdown) > .focused,
				.combobox-three::part(dropdown) > .result:hover {
					background: rgb(var(--light-purple)) !important;
				}
			`,
		];
	}

	override render(): TemplateResult {
		return html`<p>cra-choice-slider</p>
			<div style="width: 270px; height: 80px">
				<cra-choice-slider
					name="alertPriorityName"
					options='[{"sliderValue":"critical","hoverText":"Critical reports include road closures, serious accidents, and other incidents that may result in a significant impact to traffic."},{"sliderValue":"urgent","hoverText":"Urgent reports are those that may have a moderate traffic impact, such as obstructions and lane closures."},{"sliderValue":"routine","hoverText":"Routine reports include construction work and minor incidents that may have little to no impact on traffic (not recomended)."},{"sliderValue":"all","hoverText":"The All reports category is intended for agency users only. If you select this option you may receive too many alerts (not recommended)."}]'
				></cra-choice-slider>
			</div>
			<hr />
			<p>cra-checkbox-group</p>
			<cra-checkbox-group
				name="cool checkboxes"
				valuetolabel='{"a":"x","b":"y","c":"z"}'
				selectedvalue='["a"]'
			></cra-checkbox-group>
			<hr />
			<p>cra-checkbox</p>
			<div style="width: 50px; height: 50px">
				<cra-checkbox value="cool" checked="checked"></cra-checkbox>
			</div>
			<p>cra-code-input</p>
			<div style="width: 400px; height: 50px">
				<cra-code-input name="verificationCode" label="Verification Code"></cra-code-input>
			</div>
			<hr />
			<p>cra-native-select</p>
			<native-select name="subject" value="yoyo"></native-select>
			<hr />
			<p>cra-success-check</p>
			<div style="width: 50px; height: 50px"><cra-success-check></cra-success-check></div>
			<hr />
			<p>cra-tel-input</p>
			<div style="width: 400px; height: 100px">
				<cra-tel-input
					name="phoneNumber"
					label="Phone number"
					value="(281) 330-8004"
				></cra-tel-input>
			</div>
			<hr />
			<p>cra-text-area</p>
			<div style="width: 400px; height: 100px">
				<cra-text-area name="body" placeholder="type in here yo"></cra-text-area>
			</div>
			<hr />
			<p>cra-text-input</p>
			<div style="width: 400px; height: 50px">
				<cra-text-input label="cool stuff bro"></cra-text-input>
			</div>
			<hr />
			<p>cra-toggle-switch</p>
			<cra-toggle-switch
				name="statewideEmergencyAlertsEnabled"
				checked="checked"
			></cra-toggle-switch>
			<hr />
			<p>combo-box</p>
			<div style="height: 500px; width: 400px; display: flex; flex-direction: column; gap: 1rem;">
				<combo-box
					label="combo box without labels"
					placeholder="type stuff here pls"
					.options="${[
						{ value: 'value one' },
						{ value: 'value two' },
						{ value: 'value three' },
						{ value: 'value four' },
					]}"
				></combo-box>
				<combo-box
					class="combobox-two"
					label="im styled different"
					placeholder="type stuff here too i guess"
					.options="${[
						{ value: 'value one', label: 'label one' },
						{ value: 'value two', label: 'label two' },
						{ value: 'value three', label: 'label three' },
						{ value: 'value four', label: 'label four' },
					]}"
				></combo-box>
				<combo-box
					class="combobox-three"
					label="im styled more different!"
					placeholder="you know the drill"
					.options="${[
						{ value: 'value one', label: 'label one' },
						{ value: 'value two', label: 'label two' },
						{ value: 'value three', label: 'label three' },
						{ value: 'value four', label: 'label four' },
					]}"
				></combo-box>
			</div>
			<hr />
			<h2>MultiSelect</h2>
			<h2>Base Case</h2>
			<multi-select
				.value=${['cats']}
				.categorizedChoices=${[
					{
						choices: [
							{ id: 'cats', label: 'Cats' },
							{ id: 'dogs', label: 'Dogs' },
						],
					},
				]}
			></multi-select>
			<h2>Categories</h2>
			<multi-select
				.categorizedChoices=${[
					{
						categoryLabel: 'Popular',
						choices: [
							{
								id: 'a',
								label: 'label-a',
							},
							{
								id: 'b',
								label: 'label-b',
							},
						],
					},
					{
						categoryLabel: 'Cool',
						choices: [
							{
								id: 'c',
								label: 'label-c',
							},
							{
								id: 'd',
								label: 'label-d',
							},
						],
					},
				]}
			>
			</multi-select>
			<h2>No Options</h2>
			<multi-select noChoicesFallback="No events exist with restrictions"> </multi-select>
			<h2>Disabled</h2>
			<multi-select
				disabled
				.value=${['cats']}
				.categorizedChoices=${[
					{
						choices: [
							{ id: 'cats', label: 'Cats' },
							{ id: 'dogs', label: 'Dogs' },
						],
					},
				]}
			></multi-select>`;
	}
}

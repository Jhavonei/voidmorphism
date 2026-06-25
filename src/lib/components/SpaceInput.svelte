<script lang="ts">
	/**
	 * SpaceInput — a text field carved from void matter. The control itself is a
	 * shallow void surface (soft refraction, event-horizon rim). Focus raises a
	 * resonant bloom rather than a hard outline — borderless by design.
	 */

	interface Props {
		/** Bound value. */
		value?: string;
		/** Placeholder text. */
		placeholder?: string;
		/** Optional label rendered above the field. */
		label?: string;
		/** Input type. Default: 'text'. */
		type?: string;
		/** Disable the field. */
		disabled?: boolean;
		[key: string]: any;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		label = '',
		type = 'text',
		disabled = false,
		...rest
	}: Props = $props();
</script>

<label class="sm-input-wrap" class:disabled>
	{#if label}
		<span class="sm-input-label">{label}</span>
	{/if}
	<span class="sm-input-field sm-surface sm-depth-1" data-sm-refract>
		<input
			class="sm-input"
			{type}
			{placeholder}
			{disabled}
			bind:value
			{...rest}
		/>
	</span>
</label>

<style>
	.sm-input-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		width: 100%;
	}

	.sm-input-label {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--sm-ink-dim);
		padding-left: 0.25rem;
	}

	.sm-input-field {
		display: block;
		border-radius: var(--sm-radius-sm);
		padding: 0;
		transition:
			box-shadow var(--sm-dur-fast) var(--sm-ease),
			transform var(--sm-dur-fast) var(--sm-ease);
	}

	.sm-input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.85rem 1.1rem;
		background: transparent;
		border: none;
		outline: none;
		color: var(--sm-ink);
		font: inherit;
		font-size: 0.98rem;
		border-radius: inherit;
		position: relative;
		z-index: 3;
	}

	.sm-input::placeholder {
		color: var(--sm-ink-faint);
	}

	/* Focus → resonant bloom, no hard border. */
	.sm-input-field:focus-within {
		box-shadow:
			0 1px 0 0 var(--sm-rim) inset,
			0 -24px 48px -28px var(--sm-horizon) inset,
			0 0 0 1px hsla(var(--sm-glint-h), 90%, 70%, 0.25),
			0 0 36px -6px var(--sm-bloom);
	}

	.disabled {
		opacity: 0.45;
		pointer-events: none;
	}
</style>

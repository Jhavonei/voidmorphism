<script lang="ts">
	/**
	 * VoidInput — a text field carved from void matter. The control itself is a
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

<label class="vm-input-wrap" class:disabled>
	{#if label}
		<span class="vm-input-label">{label}</span>
	{/if}
	<span class="vm-input-field vm-surface vm-depth-1" data-vm-refract>
		<input
			class="vm-input"
			{type}
			{placeholder}
			{disabled}
			bind:value
			{...rest}
		/>
	</span>
</label>

<style>
	.vm-input-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		width: 100%;
	}

	.vm-input-label {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--vm-ink-dim);
		padding-left: 0.25rem;
	}

	.vm-input-field {
		display: block;
		border-radius: var(--vm-radius-sm);
		padding: 0;
		transition:
			box-shadow var(--vm-dur-fast) var(--vm-ease),
			transform var(--vm-dur-fast) var(--vm-ease);
	}

	.vm-input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.85rem 1.1rem;
		background: transparent;
		border: none;
		outline: none;
		color: var(--vm-ink);
		font: inherit;
		font-size: 0.98rem;
		border-radius: inherit;
		position: relative;
		z-index: 3;
	}

	.vm-input::placeholder {
		color: var(--vm-ink-faint);
	}

	/* Focus → resonant bloom, no hard border. */
	.vm-input-field:focus-within {
		box-shadow:
			0 1px 0 0 var(--vm-rim) inset,
			0 -24px 48px -28px var(--vm-horizon) inset,
			0 0 0 1px hsla(var(--vm-glint-h), 90%, 70%, 0.25),
			0 0 36px -6px var(--vm-bloom);
	}

	.disabled {
		opacity: 0.45;
		pointer-events: none;
	}
</style>

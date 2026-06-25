<script lang="ts">
	import { dissipate } from '../transitions/dissipate.js';

	/**
	 * SpaceSubscribe — a subscribe / newsletter control with idle → loading →
	 * subscribed states. Each state label dissipates into star dust as it
	 * changes. Use it as a standalone button, or set `email` for an inline
	 * newsletter field.
	 */

	type State = 'idle' | 'loading' | 'subscribed';

	interface Props {
		/** Current status (bindable). Default: 'idle'. */
		status?: State;
		/** Render an email field before the button. Default: false. */
		email?: boolean;
		/** Email input placeholder. Default: 'you@galaxy.dev'. */
		placeholder?: string;
		/** Idle button label. Default: 'Subscribe'. */
		idleLabel?: string;
		/** Loading label. Default: 'Transmitting…'. */
		loadingLabel?: string;
		/** Subscribed label. Default: 'Subscribed'. */
		subscribedLabel?: string;
		/** Handler; may be async. Receives the email when in email mode. */
		onsubscribe?: (email?: string) => void | Promise<void>;
		/** Extra class. */
		class?: string;
	}

	let {
		status = $bindable('idle'),
		email = false,
		placeholder = 'you@galaxy.dev',
		idleLabel = 'Subscribe',
		loadingLabel = 'Transmitting…',
		subscribedLabel = 'Subscribed',
		onsubscribe,
		class: className = ''
	}: Props = $props();

	let value = $state('');

	const label = $derived(
		status === 'loading' ? loadingLabel : status === 'subscribed' ? subscribedLabel : idleLabel
	);

	async function submit(e?: Event) {
		e?.preventDefault();
		if (status !== 'idle') return;
		if (email && !value) return;
		status = 'loading';
		try {
			await onsubscribe?.(email ? value : undefined);
		} finally {
			status = 'subscribed';
		}
	}
</script>

<form class="sm-subscribe {className}" onsubmit={submit}>
	{#if email}
		<input
			class="sm-subscribe-input"
			type="email"
			{placeholder}
			bind:value
			disabled={status !== 'idle'}
			aria-label="Email address"
		/>
	{/if}
	<button
		class="sm-subscribe-btn"
		class:sm-done={status === 'subscribed'}
		type="submit"
		disabled={status !== 'idle'}
		aria-live="polite"
	>
		{#key status}
			<span class="sm-subscribe-label" in:dissipate={{ duration: 500 }} out:dissipate={{ duration: 400 }}>
				{#if status === 'subscribed'}
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
				{/if}
				{label}
			</span>
		{/key}
	</button>
</form>

<style>
	.sm-subscribe {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem;
		border-radius: var(--sm-radius-pill);
		background: hsla(220, 12%, 14%, 0.5);
		box-shadow: 0 1px 0 0 hsla(0, 0%, 100%, 0.06) inset;
	}

	.sm-subscribe-input {
		border: none;
		background: transparent;
		color: var(--sm-ink, #f3f5fa);
		font: inherit;
		padding: 0.5rem 0.9rem;
		min-width: 14rem;
		outline: none;
	}
	.sm-subscribe-input::placeholder {
		color: var(--sm-ink-faint, #595d68);
	}

	.sm-subscribe-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 9.5rem;
		min-height: 2.4rem;
		border: none;
		border-radius: var(--sm-radius-pill);
		background: linear-gradient(180deg, hsla(210, 18%, 92%, 0.95), hsla(212, 16%, 78%, 0.92));
		color: hsl(220 40% 12%);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		overflow: hidden;
		-webkit-tap-highlight-color: transparent;
		transition: background 0.4s ease;
	}
	.sm-subscribe-btn:disabled {
		cursor: default;
	}
	.sm-subscribe-btn.sm-done {
		background: linear-gradient(180deg, hsl(212 90% 74%), hsl(212 80% 64%));
		color: hsl(220 50% 8%);
	}

	.sm-subscribe-label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		white-space: nowrap;
	}
</style>

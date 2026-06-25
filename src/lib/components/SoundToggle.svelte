<script lang="ts">
	import { onMount } from 'svelte';
	import { isSoundEnabled, setSoundEnabled, onSoundChange, playSound } from '../sound/sound.js';

	/**
	 * SoundToggle — a small control to enable/disable Spacemorphism's optional
	 * UI sound + haptics. Reflects and persists the global sound state.
	 */

	interface Props {
		/** Extra class. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let on = $state(false);

	onMount(() => {
		on = isSoundEnabled();
		return onSoundChange((v) => (on = v));
	});

	function toggle() {
		setSoundEnabled(!on);
		if (!on) playSound('success'); // confirm the moment it turns on
	}
</script>

<button
	class="sm-soundtoggle {className}"
	onclick={toggle}
	aria-pressed={on}
	aria-label={on ? 'Disable sound' : 'Enable sound'}
	title={on ? 'Sound on' : 'Sound off'}
>
	{#if on}
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M11 5 6 9H2v6h4l5 4z" />
			<path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M11 5 6 9H2v6h4l5 4z" />
			<path d="m23 9-6 6M17 9l6 6" />
		</svg>
	{/if}
</button>

<style>
	.sm-soundtoggle {
		display: inline-grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border: none;
		border-radius: 50%;
		background: hsla(220, 12%, 16%, 0.7);
		color: var(--sm-ink-dim, #9598a4);
		cursor: pointer;
		transition:
			color 0.2s ease,
			box-shadow 0.2s ease;
	}
	.sm-soundtoggle[aria-pressed='true'] {
		color: hsl(212 90% 78%);
		box-shadow: 0 0 24px -8px hsla(212, 90%, 72%, 0.7);
	}
	.sm-soundtoggle:focus-visible {
		outline: 2px solid hsl(212 90% 72%);
		outline-offset: 2px;
	}
</style>

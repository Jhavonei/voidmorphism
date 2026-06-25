<script lang="ts">
	import type { TransitionConfig } from 'svelte/transition';

	interface Props {
		label: string;
		fn: (node: Element, opts?: Record<string, unknown>) => TransitionConfig;
		options?: Record<string, unknown>;
	}

	let { label, fn, options = {} }: Props = $props();
	let visible = $state(true);

	function replay() {
		visible = false;
		setTimeout(() => (visible = true), 420);
	}
</script>

<div class="demo sm-surface" data-sm-refract="false">
	<div class="stage">
		{#if visible}
			<div class="object" in:fn={options} out:fn={options}>{label}</div>
		{/if}
	</div>
	<button class="replay" onclick={replay}>Replay {label}</button>
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
	}
	.stage {
		display: grid;
		place-items: center;
		height: 130px;
	}
	.object {
		display: grid;
		place-items: center;
		width: 130px;
		height: 80px;
		border-radius: 14px;
		background: linear-gradient(180deg, hsla(212, 30%, 70%, 0.95), hsla(212, 40%, 50%, 0.9));
		color: #06121f;
		font-weight: 700;
		text-transform: capitalize;
	}
	.replay {
		border: none;
		background: hsla(220, 14%, 16%, 0.8);
		color: var(--sm-ink-dim);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		cursor: pointer;
		text-transform: capitalize;
	}
	.replay:hover {
		color: hsl(212 90% 80%);
	}
</style>

<script lang="ts">
	import { onMount, tick } from 'svelte';

	/**
	 * SpaceTabs — a tab bar whose active indicator slides and morphs between
	 * tabs (measured FLIP), gliding like a craft changing orbits. Keyboard
	 * accessible (arrow keys, Home/End) with a visible focus ring.
	 */

	interface Tab {
		id: string;
		label: string;
	}

	interface Props {
		/** Tabs to render. */
		tabs: Tab[];
		/** Active tab id (bindable). Defaults to the first tab. */
		active?: string;
		/** Called when the active tab changes. */
		onchange?: (id: string) => void;
		/** Extra class. */
		class?: string;
	}

	let {
		tabs,
		active = $bindable(tabs[0]?.id),
		onchange,
		class: className = ''
	}: Props = $props();

	let listEl = $state<HTMLDivElement>();
	const btns: Record<string, HTMLButtonElement> = {};
	let indicator = $state({ left: 0, width: 0, ready: false });

	function measure() {
		const b = btns[active];
		if (!b || !listEl) return;
		const lr = listEl.getBoundingClientRect();
		const br = b.getBoundingClientRect();
		indicator = { left: br.left - lr.left, width: br.width, ready: true };
	}

	$effect(() => {
		// re-measure whenever the active tab changes
		void active;
		tick().then(measure);
	});

	onMount(() => {
		measure();
		const ro = new ResizeObserver(measure);
		if (listEl) ro.observe(listEl);
		return () => ro.disconnect();
	});

	function select(id: string) {
		active = id;
		onchange?.(id);
	}

	function onKey(e: KeyboardEvent) {
		const i = tabs.findIndex((t) => t.id === active);
		let next = i;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
		else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
		else if (e.key === 'Home') next = 0;
		else if (e.key === 'End') next = tabs.length - 1;
		else return;
		e.preventDefault();
		select(tabs[next].id);
		btns[tabs[next].id]?.focus();
	}
</script>

<div
	bind:this={listEl}
	class="sm-tabs {className}"
	role="tablist"
	aria-orientation="horizontal"
>
	{#if indicator.ready}
		<span
			class="sm-tabs-indicator"
			aria-hidden="true"
			style="transform: translateX({indicator.left}px); width: {indicator.width}px;"
		></span>
	{/if}
	{#each tabs as tab (tab.id)}
		<button
			bind:this={btns[tab.id]}
			class="sm-tabs-tab"
			class:sm-active={active === tab.id}
			role="tab"
			aria-selected={active === tab.id}
			tabindex={active === tab.id ? 0 : -1}
			onclick={() => select(tab.id)}
			onkeydown={onKey}
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.sm-tabs {
		position: relative;
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.3rem;
		border-radius: var(--sm-radius-pill);
		background: hsla(220, 12%, 14%, 0.5);
		box-shadow: 0 1px 0 0 hsla(0, 0%, 100%, 0.06) inset;
	}

	.sm-tabs-indicator {
		position: absolute;
		top: 0.3rem;
		left: 0;
		bottom: 0.3rem;
		border-radius: var(--sm-radius-pill);
		background: linear-gradient(180deg, hsla(220, 14%, 26%, 0.95), hsla(220, 16%, 18%, 0.95));
		box-shadow:
			0 1px 0 0 hsla(0, 0%, 100%, 0.12) inset,
			0 0 24px -8px hsla(212, 90%, 72%, 0.5);
		transition:
			transform 0.42s var(--sm-ease-warp, cubic-bezier(0.16, 1, 0.3, 1)),
			width 0.42s var(--sm-ease-warp, cubic-bezier(0.16, 1, 0.3, 1));
		pointer-events: none;
		z-index: 0;
	}

	.sm-tabs-tab {
		position: relative;
		z-index: 1;
		border: none;
		background: transparent;
		color: var(--sm-ink-dim, #9598a4);
		font: inherit;
		font-weight: 600;
		padding: 0.5rem 1.1rem;
		border-radius: var(--sm-radius-pill);
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.3s ease;
		-webkit-tap-highlight-color: transparent;
	}
	.sm-tabs-tab.sm-active {
		color: var(--sm-ink, #f3f5fa);
	}
	.sm-tabs-tab:focus-visible {
		outline: 2px solid hsl(212 90% 72%);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-tabs-indicator {
			transition: none;
		}
	}
</style>

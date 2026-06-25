<script lang="ts">
	import SpaceSurface from './SpaceSurface.svelte';

	/**
	 * SpaceFeatures — a bento-style feature grid built from SpaceSurface cards.
	 * Each card can span extra columns/rows for an editorial, mission-briefing
	 * layout. Cards are gravity-reactive and resonant by default.
	 */

	interface Feature {
		title: string;
		body: string;
		/** Optional icon glyph/emoji or short string. */
		icon?: string;
		/** Column span (1–N). Default: 1. */
		colSpan?: number;
		/** Row span (1–N). Default: 1. */
		rowSpan?: number;
	}

	interface Props {
		/** The features to render. */
		features: Feature[];
		/** Number of columns. Default: 3. */
		columns?: number;
		/** Gap between cards. Default: '1rem'. */
		gap?: string;
		/** Make cards gravity-interactive. Default: true. */
		interactive?: boolean;
		/** Extra class. */
		class?: string;
	}

	let {
		features,
		columns = 3,
		gap = '1rem',
		interactive = true,
		class: className = ''
	}: Props = $props();
</script>

<div
	class="sm-features {className}"
	style="--sm-feat-cols: {columns}; gap: {gap};"
>
	{#each features as f (f.title)}
		<SpaceSurface
			{interactive}
			resonant
			depth={2}
			padding="1.5rem"
			class="sm-feature"
			style="grid-column: span {f.colSpan ?? 1}; grid-row: span {f.rowSpan ?? 1};"
		>
			{#if f.icon}
				<div class="sm-feature-icon" aria-hidden="true">{f.icon}</div>
			{/if}
			<h3 class="sm-feature-title">{f.title}</h3>
			<p class="sm-feature-body">{f.body}</p>
		</SpaceSurface>
	{/each}
</div>

<style>
	.sm-features {
		display: grid;
		grid-template-columns: repeat(var(--sm-feat-cols), minmax(0, 1fr));
		width: 100%;
	}

	:global(.sm-feature) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sm-feature-icon {
		font-size: 1.5rem;
		line-height: 1;
		width: 2.6rem;
		height: 2.6rem;
		display: grid;
		place-items: center;
		border-radius: 12px;
		background: hsla(212, 40%, 60%, 0.14);
		box-shadow: 0 0 24px -10px hsla(212, 90%, 72%, 0.6);
		margin-bottom: 0.25rem;
	}

	.sm-feature-title {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--sm-ink, #f3f5fa);
		letter-spacing: -0.01em;
	}

	.sm-feature-body {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--sm-ink-dim, #9598a4);
	}

	@media (max-width: 720px) {
		.sm-features {
			grid-template-columns: 1fr;
		}
		:global(.sm-feature) {
			grid-column: span 1 !important;
		}
	}
</style>

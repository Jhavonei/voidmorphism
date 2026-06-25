<script lang="ts">
	let { code, lang = 'svelte' }: { code: string; lang?: string } = $props();
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div class="codeblock">
	<div class="bar">
		<span class="lang">{lang}</span>
		<button class="copy" onclick={copy} aria-label="Copy code">
			{copied ? 'Copied ✓' : 'Copy'}
		</button>
	</div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.codeblock {
		border-radius: var(--sm-radius);
		overflow: hidden;
		background: hsla(220, 40%, 4%, 0.6);
		box-shadow: 0 1px 0 0 hsla(0, 0%, 100%, 0.06) inset;
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.85rem;
		background: hsla(220, 30%, 6%, 0.7);
	}
	.lang {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--sm-ink-faint, #595d68);
	}
	.copy {
		border: none;
		background: hsla(220, 14%, 16%, 0.8);
		color: var(--sm-ink-dim, #9598a4);
		font: inherit;
		font-size: 0.78rem;
		padding: 0.3rem 0.7rem;
		border-radius: 8px;
		cursor: pointer;
	}
	.copy:hover {
		color: hsl(212 90% 80%);
	}
	pre {
		margin: 0;
		padding: 1rem 1.1rem;
		overflow-x: auto;
		font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
		font-size: 0.82rem;
		line-height: 1.6;
		color: hsl(210 22% 86%);
	}
</style>

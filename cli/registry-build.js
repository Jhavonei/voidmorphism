#!/usr/bin/env node
/**
 * registry-build — scans src/lib and emits registry.json: one entry per public
 * component, each carrying its full intra-package source closure (the component
 * plus every relative file it imports). The CLI uses this to copy a component
 * and its dependencies into any project, shadcn-style. Node built-ins only.
 *
 *   node cli/registry-build.js
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LIB = join(ROOT, 'src', 'lib');

const CATEGORY = {
	BlackHole: 'Signature',
	CometCursor: 'Signature',
	StarDust: 'Backgrounds',
	Constellation: 'Backgrounds',
	DotField: 'Backgrounds',
	StarGrid: 'Backgrounds',
	GravityRipple: 'Backgrounds',
	SpaceBeam: 'Motion',
	BorderBeam: 'Motion',
	ShineBorder: 'Motion',
	OrbitingBodies: 'Motion',
	Marquee: 'Motion',
	ShimmerButton: 'Interactive',
	SpaceTabs: 'Interactive',
	HoverButton: 'Interactive',
	SpaceSubscribe: 'Interactive',
	SpaceFeatures: 'Interactive',
	SpaceSurface: 'Material',
	SpacePanel: 'Material',
	SpaceCard: 'Material',
	SpaceButton: 'Material',
	SpaceInput: 'Material',
	SpaceModal: 'Material',
	SpaceNav: 'Material',
	SpaceField: 'Material',
	SpaceFilters: 'Material',
	SoundToggle: 'Interactive',
	GlitchText: 'Motion',
	MorphContainer: 'Motion'
};

/** Resolve a relative import specifier from a file to an on-disk lib path. */
function resolveImport(fromFile, spec) {
	if (!spec.startsWith('.')) return null; // external (svelte, etc.)
	let p = resolve(dirname(fromFile), spec);
	if (p.endsWith('.js')) {
		const ts = p.slice(0, -3) + '.ts';
		if (existsSync(ts)) return ts;
		const svelte = p.slice(0, -3) + '.svelte';
		if (existsSync(svelte)) return svelte;
	}
	if (existsSync(p)) return p;
	if (existsSync(p + '.ts')) return p + '.ts';
	if (existsSync(p + '.svelte')) return p + '.svelte';
	return null;
}

const IMPORT_RE = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g;

/** Collect the transitive closure of relative files imported by `entry`. */
function closure(entry) {
	const seen = new Set();
	const stack = [entry];
	while (stack.length) {
		const file = stack.pop();
		if (seen.has(file) || !existsSync(file)) continue;
		seen.add(file);
		const src = readFileSync(file, 'utf8');
		let m;
		IMPORT_RE.lastIndex = 0;
		while ((m = IMPORT_RE.exec(src))) {
			const dep = resolveImport(file, m[1]);
			if (dep && !seen.has(dep)) stack.push(dep);
		}
	}
	return [...seen];
}

function libTarget(absPath) {
	// e.g. .../src/lib/components/BlackHole.svelte -> components/BlackHole.svelte
	return relative(LIB, absPath).split('\\').join('/');
}

const componentsDir = join(LIB, 'components');
const files = readdirSync(componentsDir).filter((f) => f.endsWith('.svelte'));

const items = [];
for (const f of files) {
	const name = f.replace('.svelte', '');
	const abs = join(componentsDir, f);
	const closureFiles = closure(abs);
	items.push({
		name,
		category: CATEGORY[name] ?? 'Material',
		dependencies: [], // external npm deps (none — zero-dependency)
		files: closureFiles.map((p) => ({
			target: `spacemorphism/${libTarget(p)}`,
			source: readFileSync(p, 'utf8')
		}))
	});
}

// A "styles" item for the base stylesheet.
const cssPath = join(LIB, 'styles', 'spacemorphism.css');
items.push({
	name: 'styles',
	category: 'Material',
	dependencies: [],
	files: [
		{ target: 'spacemorphism/styles/spacemorphism.css', source: readFileSync(cssPath, 'utf8') }
	]
});

const registry = {
	$schema: 'https://svelte-spacemorphism.dev/registry.json',
	name: 'svelte-spacemorphism',
	homepage: 'https://github.com/yourusername/svelte-spacemorphism',
	items: items.sort((a, b) => a.name.localeCompare(b.name))
};

writeFileSync(join(ROOT, 'registry.json'), JSON.stringify(registry, null, '\t') + '\n');
console.log(`registry.json written — ${items.length} items.`);

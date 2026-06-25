#!/usr/bin/env node
/**
 * spacemorphism — a shadcn-style CLI to copy Spacemorphism components (and their
 * intra-package dependencies) into any project. Zero npm dependencies; Node
 * built-ins only. Reads the generated registry.json bundled with the package.
 *
 *   npx svelte-spacemorphism list
 *   npx svelte-spacemorphism add black-hole star-dust
 *   npx svelte-spacemorphism init
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadRegistry() {
	const candidates = [
		resolve(__dirname, '..', 'registry.json'),
		resolve(__dirname, 'registry.json')
	];
	for (const c of candidates) {
		if (existsSync(c)) return JSON.parse(readFileSync(c, 'utf8'));
	}
	fail('registry.json not found. Run `node cli/registry-build.js` first.');
}

const C = {
	dim: (s) => `\x1b[2m${s}\x1b[0m`,
	bold: (s) => `\x1b[1m${s}\x1b[0m`,
	cyan: (s) => `\x1b[36m${s}\x1b[0m`,
	green: (s) => `\x1b[32m${s}\x1b[0m`,
	red: (s) => `\x1b[31m${s}\x1b[0m`
};

function fail(msg) {
	console.error(C.red('✗ ') + msg);
	process.exit(1);
}

/** Match a registry item by its kebab-case slug or PascalCase name. */
function toSlug(name) {
	return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
function findItem(items, query) {
	const q = query.toLowerCase();
	return items.find((it) => it.name.toLowerCase() === q || toSlug(it.name) === q);
}

function cmdList(reg) {
	console.log(C.bold('\nSpacemorphism components\n'));
	const byCat = {};
	for (const it of reg.items) (byCat[it.category] ??= []).push(it);
	for (const cat of Object.keys(byCat).sort()) {
		console.log('  ' + C.cyan(cat));
		for (const it of byCat[cat]) {
			console.log('    ' + toSlug(it.name).padEnd(20) + C.dim(`${it.files.length} file(s)`));
		}
		console.log('');
	}
	console.log(C.dim('  Add one with: ') + 'npx svelte-spacemorphism add <name>\n');
}

function writeFiles(item, targetRoot) {
	const written = [];
	for (const f of item.files) {
		const out = join(targetRoot, f.target);
		mkdirSync(dirname(out), { recursive: true });
		if (existsSync(out)) {
			console.log('  ' + C.dim('skip (exists) ') + f.target);
			continue;
		}
		writeFileSync(out, f.source);
		written.push(f.target);
		console.log('  ' + C.green('+ ') + f.target);
	}
	return written;
}

function cmdAdd(reg, names) {
	if (names.length === 0) fail('Specify at least one component, e.g. `add black-hole`.');
	const targetRoot = join(process.cwd(), 'src', 'lib');
	console.log(C.dim(`\nTarget: ${join('src', 'lib')}\n`));
	let total = 0;
	for (const name of names) {
		const item = findItem(reg.items, name);
		if (!item) {
			console.log(C.red(`  ✗ unknown component: ${name}`));
			continue;
		}
		console.log(C.bold(item.name));
		total += writeFiles(item, targetRoot).length;
	}
	console.log(
		'\n' +
			C.green('Done. ') +
			`${total} file(s) written. Import the base styles once:\n  ` +
			C.cyan("import './lib/spacemorphism/styles/spacemorphism.css';") +
			'\n'
	);
}

function cmdInit(reg) {
	console.log(C.bold('\nInitializing Spacemorphism (styles + core)\n'));
	const targetRoot = join(process.cwd(), 'src', 'lib');
	for (const name of ['styles', 'SpaceField', 'SpaceFilters', 'CometCursor']) {
		const item = findItem(reg.items, name);
		if (item) writeFiles(item, targetRoot);
	}
	console.log(
		'\n' +
			C.green('Initialized. ') +
			'Mount once in your root layout:\n  ' +
			C.cyan('<SpaceFilters /> <SpaceField /> <CometCursor />') +
			'\n'
	);
}

function main() {
	const [cmd, ...args] = process.argv.slice(2);
	const reg = loadRegistry();
	switch (cmd) {
		case 'list':
		case 'ls':
			return cmdList(reg);
		case 'add':
			return cmdAdd(reg, args);
		case 'init':
			return cmdInit(reg);
		default:
			console.log(`
${C.bold('svelte-spacemorphism')} — copy space components into your project

${C.cyan('Usage')}
  npx svelte-spacemorphism <command>

${C.cyan('Commands')}
  list                 list all available components
  add <name...>        copy components (+ their deps) into src/lib/spacemorphism
  init                 install the base styles, field, filters and cursor

${C.dim('Example')}
  npx svelte-spacemorphism add black-hole star-dust
`);
	}
}

main();

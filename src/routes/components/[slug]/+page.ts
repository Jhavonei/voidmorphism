import { error } from '@sveltejs/kit';
import { catalog, entryBySlug } from '../../_site/catalog.js';
import type { EntryGenerator, PageLoad } from './$types.js';

export const load: PageLoad = ({ params }) => {
	const entry = entryBySlug(params.slug);
	if (!entry) throw error(404, 'Component not found');
	return { entry };
};

// Prerender one page per catalog entry.
export const entries: EntryGenerator = () => catalog.map((e) => ({ slug: e.slug }));

export const prerender = true;

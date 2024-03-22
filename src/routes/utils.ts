import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';

export function navigateToHomePage() {
	goto('./');
}

export function navigateToSettingsPage() {
	goto('./settings');
}

export async function fetchWithTimeout(endpoint: string, options = {}) {
	const { timeout = 6000 } = options;

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort('Request timeout......'), timeout);
	const response = await fetch(endpoint, {
		...options,
		signal: controller.signal
	});
	clearTimeout(id);

	return response;
}

export function onInterval(callback, milliseconds) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}

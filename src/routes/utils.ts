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
	const responseJsonData = await fetch(endpoint, {
		...options,
		signal: controller.signal
	})
		.then((resp) => {
			if (!resp.ok) {
				throw new Error(resp.statusText);
			}
			return resp.json();
		})
		.then((data) => {
			if (data['error'] !== '') {
				throw new Error(data['error']);
			}
			return data;
		});
	clearTimeout(id);

	return responseJsonData;
}

export function onInterval(callback, milliseconds) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}

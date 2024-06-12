import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';
import { authPasswordSHA2 } from './stores.js';

export function navigateToHomePage() {
	goto('./');
}

export function navigateToSettingsPage() {
	goto('./settings');
}

export function navigateToAuthPage() {
	goto('./auth');
}

export async function fetchWithTimeout(url: string, options = {}) {
	let authPasswordSHA2Value = '';
	authPasswordSHA2.subscribe((value) => {
		authPasswordSHA2Value = value;
	});

	const { timeout = 6000 } = options;

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort('Request timeout......'), timeout);
	const responseJsonData = await fetch(url, {
		headers: {
			'Auth-Password-SHA2': authPasswordSHA2Value
		},
		...options,
		signal: controller.signal
	})
		.then((resp) => {
			if (!resp.ok) {
				if (resp.status == 401) {
					navigateToAuthPage();
					throw new Error('Unauthorized');
				}
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

export function getAuthCache() {
	const authCache = localStorage.getItem('cache:auth');
	if (authCache) {
		authPasswordSHA2.set(authCache);
	}
}

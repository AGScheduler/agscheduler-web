import { writable } from 'svelte/store';

export const address = writable('http://127.0.0.1:36370');
export const authPasswordSHA2 = writable('');

export const info = writable({
	has_broker: false,
	broker: {},
	has_recorder: false,
	is_cluster_mode: false,
	is_running: false,
	version: ''
});

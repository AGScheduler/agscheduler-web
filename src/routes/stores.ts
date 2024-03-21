import { writable } from 'svelte/store';

export const host = writable('http://127.0.0.1:36370');

export const info = writable({
	cluster_main_node: {},
	is_cluster_mode: false,
	is_running: false,
	version: ''
});

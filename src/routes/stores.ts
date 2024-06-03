import { writable } from 'svelte/store';

export const address = writable('http://127.0.0.1:36370');

export const info = writable({
	has_broker: false,
	broker: {},
	has_recorder: false,
	is_cluster_mode: false,
	cluster_main_node: {},
	is_running: false,
	version: ''
});

import { writable } from 'svelte/store';

export const address = writable('http://127.0.0.1:36370');
export const authPasswordSHA2 = writable('');

export const info = writable({
	scheduler: {
		is_running: false,
		store: ''
	},
	broker: {
		has_broker: false,
		queues: ''
	},
	recorder: {
		has_recorder: false,
		backend: ''
	},
	cluster: {
		is_cluster_mode: false,
		main_node: {}
	},
	version: ''
});

<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import RotateCw from 'lucide-svelte/icons/rotate-cw';

	import ClusterTable from './ClusterTable.svelte';
	import ClusterGraph from './ClusterGraph.svelte';
	import Pagination from './Pagination.svelte';
	import { info, host } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	let isLoading = false;
	let showTable = true;

	let perPage = 10;
	let page = 1;

	type Node = {
		endpoint: string;
		endpoint_grpc: string;
		endpoint_http: string;
		endpoint_main: string;
		health: boolean;
		last_heartbeat_time: string;
		mode: string;
		queue: string;
		register_time: string;
	};

	let nodeMap = {};
	let nodes: Node[] = [];

	export function fetchNodes() {
		if ($info.version === '') {
			return;
		}

		isLoading = true;

		fetchWithTimeout($host + '/cluster/nodes')
			.then((resp) => resp.json())
			.then((data) => {
				nodeMap = data.data !== null ? data.data : {};
				page = 1;
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	$: {
		nodes = [];
		for (let k in nodeMap) {
			nodes.push(nodeMap[k]);
		}
	}

	onMount(() => {
		fetchNodes();
	});
</script>

<div class="flex items-center justify-end space-x-2">
	<Switch id="showTable" bind:checked={showTable} on:click={fetchNodes} />
	<Label for="showTable">{showTable ? 'Table' : 'Graph'}</Label>
	<Button
		variant="ghost"
		size="icon"
		class="h-6 w-6 p-0"
		on:click={fetchNodes}
		disabled={isLoading}
	>
		{#if isLoading}
			<RotateCw class="h-4 w-4 animate-spin" />
		{:else}
			<RotateCw class="h-4 w-4" />
		{/if}
	</Button>
</div>

{#if isLoading}
	<div class="flex justify-center">
		<LoaderCircle class="h-8 w-8 animate-spin" />
	</div>
{:else if showTable}
	<ClusterTable bind:nodes bind:page {perPage} />
	{#if nodes.length}
		<Pagination bind:count={nodes.length} bind:page />
	{/if}
{:else}
	<div class="flex items-center justify-center">
		<ClusterGraph bind:nodes />
	</div>
{/if}

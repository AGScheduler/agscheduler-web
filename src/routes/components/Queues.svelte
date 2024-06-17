<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import RotateCw from 'lucide-svelte/icons/rotate-cw';

	import Pagination from './Pagination.svelte';
	import { address, info } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	let isLoading = false;

	let perPage = 10;
	let page = 1;

	type Queue = {
		name: string;
		type: string;
		count: number;
		workers: number;
	};

	let queues: Queue[] = [];

	export function fetchQueues() {
		if ($info.version === '') {
			return;
		}

		isLoading = true;

		fetchWithTimeout($address + '/broker/queues')
			.then((data) => {
				queues = data.data !== null ? data.data : [];
				page = 1;
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	onMount(() => {
		fetchQueues();
	});
</script>

<div class="flex items-center justify-end space-x-2">
	<Button
		variant="ghost"
		size="icon"
		class="h-6 w-6 p-0"
		on:click={fetchQueues}
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
{:else}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>Count</Table.Head>
				<Table.Head>Workers</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each queues.slice((page - 1) * perPage, page * perPage) as queue, i (i)}
				<Table.Row>
					<Table.Cell>{queue.name}</Table.Cell>
					<Table.Cell>
						<Badge variant="default">
							{queue.type}
						</Badge>
					</Table.Cell>
					<Table.Cell>
						<Badge variant="secondary">
							{queue.count}
						</Badge>
					</Table.Cell>
					<Table.Cell>
						<Badge variant="secondary">
							{queue.workers}
						</Badge>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if queues.length}
		<Pagination bind:count={queues.length} bind:page />
	{/if}
{/if}

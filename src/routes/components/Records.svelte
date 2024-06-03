<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import RotateCw from 'lucide-svelte/icons/rotate-cw';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import dayjs from 'dayjs';

	import RecordsResult from './RecordsResult.svelte';
	import Pagination from './Pagination.svelte';
	import { address, info } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	let isLoading = false;
	let showDeleteADialog = false;

	let jobId = '';

	let page = 1;
	let perPage = 10;
	let defaultPerPage = {
		label: '10',
		value: 10
	};
	let selectedPerPage = defaultPerPage;

	type Record = {
		id: bigint;
		job_id: string;
		job_name: string;
		status: 'running' | 'completed' | 'error' | 'timeout';
		result: string;
		start_at: string;
		end_at: string;
	};

	let records: Record[] = [];
	let count = 0;

	export function fetchRecords() {
		if ($info.version === '') {
			return;
		}

		isLoading = true;

		let urlPath = '/recorder/records';
		if (jobId) {
			urlPath = urlPath + '/' + jobId.trim();
		}
		let query = 'page=' + page + '&' + 'page_size=' + perPage;
		let url = urlPath + '?' + query;
		fetchWithTimeout($address + url)
			.then((data) => {
				records = data.data !== null ? data.data['res'] : [];
				count = data.data !== null ? data.data['total'] : 0;
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	function deleteRecords() {
		isLoading = true;

		let urlPath = '/recorder/records';
		if (jobId) {
			urlPath = urlPath + '/' + jobId.trim();
		}
		fetchWithTimeout($address + urlPath, { method: 'DELETE' })
			.then(() => {
				showDeleteADialog = false;
				jobId = '';
				fetchRecords();
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	$: perPage = selectedPerPage.value;
	$: if (jobId || page || perPage) {
		fetchRecords();
	}

	onMount(() => {
		fetchRecords();
	});
</script>

<div class="flex items-center justify-end space-x-2">
	<Input id="jobId" bind:value={jobId} class="max-w-xs" placeholder="Filter JobId" />
	<Button
		variant="ghost"
		size="icon"
		class="h-6 w-6 p-0"
		on:click={() => (showDeleteADialog = true)}
		disabled={isLoading}
	>
		<Trash2 class="h-4 w-4" />
	</Button>
	<Button
		variant="ghost"
		size="icon"
		class="h-6 w-6 p-0"
		on:click={fetchRecords}
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
				<Table.Head>ID</Table.Head>
				<Table.Head>JobName</Table.Head>
				<Table.Head>JobId</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>StartAt</Table.Head>
				<Table.Head>EndAt</Table.Head>
				<Table.Head>Result</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each records as record, i (i)}
				<Table.Row>
					<Table.Cell>{record.id}</Table.Cell>
					<Table.Cell>{record.job_name}</Table.Cell>
					<Table.Cell>{record.job_id}</Table.Cell>
					<Table.Cell>
						{#if record.status === 'running'}
							<Badge variant="secondary">
								{record.status}
							</Badge>
						{:else if record.status === 'completed'}
							<Badge variant="default">
								{record.status}
							</Badge>
						{:else if record.status === 'error'}
							<Badge variant="destructive">
								{record.status}
							</Badge>
						{:else if record.status === 'timeout'}
							<Badge variant="outline">
								{record.status}
							</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell>
						{dayjs(record.start_at).format('YYYY-MM-DD HH:mm:ss')}
					</Table.Cell>
					{#if record.status === 'running'}
						<Table.Cell></Table.Cell>
					{:else}
						<Table.Cell>
							{dayjs(record.end_at).format('YYYY-MM-DD HH:mm:ss')}
						</Table.Cell>
					{/if}
					<Table.Cell>
						<RecordsResult {record} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if count}
		<div class="flex items-center space-x-2">
			<Pagination bind:count bind:page bind:perPage />
			<div class="mt-1.5">
				<Select.Root bind:selected={selectedPerPage}>
					<Select.Trigger class="w-[80px]">
						<Select.Value placeholder="Page" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="10">10</Select.Item>
						<Select.Item value="20">20</Select.Item>
						<Select.Item value="50">50</Select.Item>
						<Select.Item value="100">100</Select.Item>
						<Select.Item value="1000">1000</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="mt-2 min-w-20">
				Total: {count}
			</div>
		</div>
	{/if}
{/if}

<AlertDialog.Root bind:open={showDeleteADialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{#if jobId.trim() === ''}
					Delete all records?
				{:else}
					Delete all records for JobId: {jobId.trim()} ?
				{/if}
			</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" on:click={deleteRecords} disabled={isLoading}>
				{#if isLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

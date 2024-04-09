<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Table from '$lib/components/ui/table';
	import Plus from 'lucide-svelte/icons/plus';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import RotateCw from 'lucide-svelte/icons/rotate-cw';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import dayjs from 'dayjs';

	import JobsActions from './JobsActions.svelte';
	import JobsEdit from './JobsEdit.svelte';
	import JobsDetails from './JobsDetails.svelte';
	import Pagination from './Pagination.svelte';
	import { address, info } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	let isLoading = false;
	let showEditDialog = false;
	let showDeleteADialog = false;

	let perPage = 10;
	let page = 1;

	type Job = {
		id: string;
		name: string;
		type: string;
		last_run_time: string;
		next_run_time: string;
		status: 'running' | 'paused';
	};

	let jobs: Job[] = [];

	export function fetchJobs() {
		if ($info.version === '') {
			return;
		}

		isLoading = true;

		fetchWithTimeout($address + '/scheduler/jobs')
			.then((data) => {
				jobs = data.data !== null ? data.data : [];
				page = 1;
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	function deleteAllJobs() {
		isLoading = true;

		fetchWithTimeout($address + '/scheduler/jobs', { method: 'DELETE' })
			.then(() => {
				showDeleteADialog = false;
				fetchJobs();
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	onMount(() => {
		fetchJobs();
	});
</script>

<div class="flex items-center justify-end space-x-2">
	<Button
		variant="ghost"
		size="icon"
		class="h-6 w-6 p-0"
		on:click={() => (showEditDialog = true)}
		disabled={isLoading}
	>
		<Plus class="h-4 w-4" />
	</Button>
	<Button
		variant="ghost"
		size="icon"
		class="h-6 w-6 p-0"
		on:click={() => (showDeleteADialog = true)}
		disabled={isLoading}
	>
		<Trash2 class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="h-6 w-6 p-0" on:click={fetchJobs} disabled={isLoading}>
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
				<Table.Head>Name</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>LastRunTime</Table.Head>
				<Table.Head>NextRunTime</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each jobs.slice((page - 1) * perPage, page * perPage) as job, i (i)}
				<Table.Row>
					<Table.Cell>{job.id}</Table.Cell>
					<Table.Cell>{job.name}</Table.Cell>
					<Table.Cell>
						<Badge variant="secondary">
							{job.type}
						</Badge>
					</Table.Cell>
					{#if job.last_run_time === '0001-01-01T00:00:00Z'}
						<Table.Cell></Table.Cell>
					{:else}
						<Table.Cell>
							{dayjs(job.last_run_time).format('YYYY-MM-DD HH:mm:ss')}
						</Table.Cell>
					{/if}
					{#if job.next_run_time === '9999-09-09T09:09:09Z'}
						<Table.Cell></Table.Cell>
					{:else}
						<Table.Cell>
							{dayjs(job.next_run_time).format('YYYY-MM-DD HH:mm:ss')}
						</Table.Cell>
					{/if}
					<Table.Cell>
						<Badge variant={job.status === 'running' ? 'default' : 'destructive'}>
							{job.status}
						</Badge>
					</Table.Cell>
					<Table.Cell>
						<JobsDetails {job} />
						<JobsActions {job} on:fetchJobs={fetchJobs} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if jobs.length}
		<Pagination bind:count={jobs.length} bind:page />
	{/if}
{/if}

<JobsEdit bind:showEditDialog title="Add" on:fetchJobs={fetchJobs} />

<AlertDialog.Root bind:open={showDeleteADialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete all jobs?</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" on:click={deleteAllJobs} disabled={isLoading}>
				{#if isLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import FilePenLine from 'lucide-svelte/icons/file-pen-line';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Orbit from 'lucide-svelte/icons/orbit';
	import Pause from 'lucide-svelte/icons/pause';
	import Play from 'lucide-svelte/icons/play';
	import Send from 'lucide-svelte/icons/send';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Job from './Jobs.svelte';
	import JobsEdit from './JobsEdit.svelte';
	import { address } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	export let job: Job;

	let isLoading = false;
	let showEditDialog = false;
	let showDeleteADialog = false;
	const dispatch = createEventDispatcher();

	function pauseOrResumeJob() {
		isLoading = true;

		let path = '/scheduler/job/' + job.id;
		if (job.status === 'running') {
			path = path + '/pause';
		} else {
			path = path + '/resume';
		}

		fetchWithTimeout($address + path, { method: 'POST' })
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
				dispatch('fetchJobs');
			});
	}

	function runOrScheduleJob(action: string) {
		isLoading = true;

		let newJob: Job = {
			id: job.id,
			name: job.name,
			type: job.type,
			start_at: job.start_at,
			interval: job.interval,
			cron_expr: job.cron_expr,
			timezone: job.timezone,
			func_name: job.func_name,
			args: job.args,
			timeout: job.timeout,
			queues: job.queues
		};

		let path = '/scheduler/job/' + action;
		fetchWithTimeout($address + path, {
			method: 'POST',
			body: JSON.stringify(newJob)
		})
			.then(() => {
				action = action.charAt(0).toUpperCase() + action.slice(1);
				toast.success(action + ' job success');
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	function deleteJob() {
		isLoading = true;

		fetchWithTimeout($address + '/scheduler/job/' + job.id, { method: 'DELETE' })
			.then(() => {
				showDeleteADialog = false;
				dispatch('fetchJobs');
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}
</script>

<Button
	variant="ghost"
	size="icon"
	class="relative h-8 w-8 p-0"
	on:click={pauseOrResumeJob}
	disabled={isLoading}
>
	<span class="sr-only">Status</span>
	{#if isLoading}
		<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
	{:else if job.status === 'running'}
		<Pause class="h-4 w-4" />
	{:else}
		<Play class="h-4 w-4" />
	{/if}
</Button>
<Button
	variant="ghost"
	size="icon"
	class="relative h-8 w-8 p-0"
	on:click={() => (showEditDialog = true)}
>
	<span class="sr-only">Update</span>
	<FilePenLine class="h-4 w-4" />
</Button>
<Button
	variant="ghost"
	size="icon"
	class="relative h-8 w-8 p-0"
	on:click={() => runOrScheduleJob('run')}
	disabled={isLoading}
>
	<span class="sr-only">Run</span>
	{#if isLoading}
		<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
	{:else}
		<Send class="h-4 w-4" />
	{/if}
</Button>
<Button
	variant="ghost"
	size="icon"
	class="relative h-8 w-8 p-0"
	on:click={() => runOrScheduleJob('schedule')}
	disabled={isLoading}
>
	<span class="sr-only">Schedule</span>
	{#if isLoading}
		<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
	{:else}
		<Orbit class="h-4 w-4" />
	{/if}
</Button>
<Button
	variant="ghost"
	size="icon"
	class="relative h-8 w-8 p-0"
	on:click={() => (showDeleteADialog = true)}
>
	<span class="sr-only">Delete</span>
	<Trash2 class="h-4 w-4" />
</Button>

<JobsEdit bind:showEditDialog title="Update" {job} on:fetchJobs />

<AlertDialog.Root bind:open={showDeleteADialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete this job?</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" on:click={deleteJob} disabled={isLoading}>
				{#if isLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

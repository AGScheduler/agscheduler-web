<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import FilePenLine from 'lucide-svelte/icons/file-pen-line';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Pause from 'lucide-svelte/icons/pause';
	import Play from 'lucide-svelte/icons/play';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Job from './Jobs.svelte';
	import JobsAddOrUpdate from './JobsAddOrUpdate.svelte';
	import { host } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	export let job: Job;

	let isLoading = false;
	let showAddOrUpdateDialog = false;
	let showDeleteADialog = false;
	const dispatch = createEventDispatcher();

	function pauseOrResumeJob() {
		isLoading = true;

		let endpoint = '/scheduler/job/' + job.id;
		if (job.status === 'running') {
			endpoint = endpoint + '/pause';
		} else {
			endpoint = endpoint + '/resume';
		}

		fetchWithTimeout($host + endpoint, { method: 'POST' })
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
				dispatch('fetchJobs');
			});
	}

	function deleteJob() {
		isLoading = true;

		fetchWithTimeout($host + '/scheduler/job/' + job.id, { method: 'DELETE' })
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
	on:click={() => (showAddOrUpdateDialog = true)}
>
	<span class="sr-only">Update</span>
	<FilePenLine class="h-4 w-4" />
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

<JobsAddOrUpdate bind:showAddOrUpdateDialog title="Update" {job} on:fetchJobs />

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

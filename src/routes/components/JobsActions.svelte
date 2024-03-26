<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DotsHorizontal from 'svelte-radix/DotsHorizontal.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { host } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	export let id: string;
	export let status: string;

	let isLoading = false;
	let showDeleteADialog = false;
	const dispatch = createEventDispatcher();

	function pauseOrResumeJob() {
		isLoading = true;

		let endpoint = '/scheduler/job/' + id;
		if (status === 'running') {
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

		fetchWithTimeout($host + '/scheduler/job/' + id, { method: 'DELETE' })
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
				showDeleteADialog = false;
				dispatch('fetchJobs');
			});
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<DotsHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={pauseOrResumeJob}>
			{#if isLoading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			{status === 'running' ? 'Pause' : 'Resume'}
		</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (showDeleteADialog = true)}>
			<p class="text-red-500">Delete</p>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={showDeleteADialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" on:click={deleteJob}>
				{#if isLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

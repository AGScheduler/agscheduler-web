<script lang="ts">
	import { onMount } from 'svelte';

	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import GithubLogo from 'svelte-radix/GithubLogo.svelte';

	import Cluster from './components/Cluster.svelte';
	import Info from './components/Info.svelte';
	import Jobs from './components/Jobs.svelte';
	import Records from './components/Records.svelte';
	import { info } from './stores.js';
	import { getAddressCache, getAuthCache, navigateToSettingsPage } from './utils.js';

	let jobs: any;
	let records: any;
	let cluster: any;

	onMount(() => {
		getAddressCache();
		getAuthCache();

		if ($info.version === '') {
			navigateToSettingsPage();
		}
	});
</script>

<svelte:head>
	<title>AGScheduler Web</title>
</svelte:head>

<Card.Root class="m-1">
	<Card.Header>
		<div class="flex items-center space-x-4">
			<Avatar.Root>
				<Avatar.Image src="https://github.com/agscheduler.png" alt="AGScheduler" />
				<Avatar.Fallback>AGS</Avatar.Fallback>
			</Avatar.Root>
			<div class="pt-2">
				<Card.Title>AGScheduler Web</Card.Title>
				<Card.Description>v{PKG.version}</Card.Description>
			</div>
			<Info />
		</div>
	</Card.Header>
	<Card.Content>
		<Separator class="mb-4" />
		<Tabs.Root>
			<Tabs.List>
				<Tabs.Trigger value="jobs" on:click={jobs.fetchJobs}>Jobs</Tabs.Trigger>
				{#if $info.has_recorder}
					<Tabs.Trigger value="records" on:click={records.fetchRecords}>Records</Tabs.Trigger>
				{/if}
				{#if $info.is_cluster_mode}
					<Tabs.Trigger value="cluster" on:click={cluster.fetchNodes}>Cluster</Tabs.Trigger>
				{/if}
			</Tabs.List>
			<Tabs.Content value="jobs">
				<Jobs bind:this={jobs} />
			</Tabs.Content>
			{#if $info.has_recorder}
				<Tabs.Content value="records">
					<Records bind:this={records} />
				</Tabs.Content>
			{/if}
			{#if $info.is_cluster_mode}
				<Tabs.Content value="cluster">
					<Cluster bind:this={cluster} />
				</Tabs.Content>
			{/if}
		</Tabs.Root>
	</Card.Content>
	<Card.Footer>
		<div class="flex items-center justify-end space-x-2" style="margin-left: auto;">
			<Label class="text-gray-400">Powered by AGScheduler</Label>
			<a href="https://github.com/AGScheduler" target="_blank">
				<GithubLogo class="h-4 w-4 text-gray-400" />
			</a>
		</div>
	</Card.Footer>
</Card.Root>

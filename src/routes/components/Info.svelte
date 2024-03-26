<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import Gear from 'svelte-radix/Gear.svelte';

	import InfoDetails from './InfoDetails.svelte';
	import { info, host } from '../stores.js';
	import { fetchWithTimeout, navigateToSettingsPage, onInterval } from '../utils.js';

	function startOrStopScheduler() {
		let endpoint = '/scheduler';
		if (!$info.is_running) {
			endpoint = endpoint + '/start';
		} else {
			endpoint = endpoint + '/stop';
		}

		fetchWithTimeout($host + endpoint, { method: 'POST' })
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				fetchInfo();
			});
	}

	async function fetchInfo() {
		if ($info.version === '') {
			return;
		}

		await fetchWithTimeout($host + '/info')
			.then((data) => {
				$info = data.data;
			})
			.catch((error) => {
				toast.error('' + error);
			});
	}

	onInterval(fetchInfo, 60000);

	onMount(() => {
		fetchInfo();
	});
</script>

<div class="grid gap-1" style="margin-left: auto;">
	<div class="flex items-center space-x-2">
		<Badge variant="secondary">{$host}</Badge>
	</div>
	<div class="flex items-center justify-end space-x-2">
		<InfoDetails on:fetchInfo={fetchInfo} />
		<Button
			variant="ghost"
			size="icon"
			class="relative h-6 w-6 p-0"
			on:click={navigateToSettingsPage}
		>
			<span class="sr-only">Settings</span>
			<Gear class="h-4 w-4" />
		</Button>
		<Switch id="is-running" bind:checked={$info.is_running} on:click={startOrStopScheduler} />
		<Label for="is-running">{$info.is_running ? 'Start' : 'Stop'}</Label>
	</div>
</div>

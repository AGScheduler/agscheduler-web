<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { toggleMode } from 'mode-watcher';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import MoonStar from 'lucide-svelte/icons/moon-star';
	import Settings from 'lucide-svelte/icons/settings';
	import Sun from 'lucide-svelte/icons/sun';

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
	<div class="flex items-center space-x-1">
		<Badge variant="secondary">{$host}</Badge>
		<InfoDetails on:fetchInfo={fetchInfo} />
	</div>
	<div class="flex items-center justify-end space-x-2">
		<Button on:click={toggleMode} variant="ghost" size="icon" class="relative h-6 w-6 p-0">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<MoonStar
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
		<Separator orientation="vertical" />
		<Button
			variant="ghost"
			size="icon"
			class="relative h-6 w-6 p-0"
			on:click={navigateToSettingsPage}
		>
			<span class="sr-only">Settings</span>
			<Settings class="h-4 w-4" />
		</Button>
		<Switch id="is-running" bind:checked={$info.is_running} on:click={startOrStopScheduler} />
		<Label for="is-running">{$info.is_running ? 'Start' : 'Stop'}</Label>
	</div>
</div>

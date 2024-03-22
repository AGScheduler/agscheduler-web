<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { info, host } from '../stores.js';
	import { fetchWithTimeout, navigateToHomePage } from '../utils.js';

	let isLoading = false;

	function fetchInfo() {
		isLoading = true;

		fetchWithTimeout($host + '/info')
			.then((resp) => resp.json())
			.then((data) => {
				$info = data.data;
				navigateToHomePage();
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[480px]">
		<Card.Header>
			<Card.Title>Settings</Card.Title>
			<Card.Description>Fill in the configuration information.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form>
				<div class="flex items-center space-x-4">
					<Label for="host">Host:</Label>
					<Input id="host" bind:value={$host} placeholder="http://127.0.0.1:36370" />
					<Button on:click={fetchInfo} disabled={!$host || isLoading}>
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Save
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { address, info } from '../stores.js';
	import { fetchWithTimeout, getAddressCache, getAuthCache, navigateToHomePage } from '../utils.js';

	let isLoading = false;

	function fetchInfo() {
		isLoading = true;

		fetchWithTimeout($address + '/info')
			.then((data) => {
				$info = data.data;
				localStorage.setItem('cache:address', $address);
				navigateToHomePage();
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	onMount(() => {
		getAddressCache();
		getAuthCache();
	});
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[480px]">
		<Card.Header>
			<Card.Title>Welcome to AGScheduler Web</Card.Title>
			<Card.Description>Setting configuration information</Card.Description>
		</Card.Header>
		<Card.Content>
			<form>
				<div class="flex items-center space-x-4">
					<Label for="address">Address</Label>
					<Input id="address" bind:value={$address} placeholder="http://127.0.0.1:36370" />
					<Button on:click={fetchInfo} disabled={!$address || isLoading}>
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

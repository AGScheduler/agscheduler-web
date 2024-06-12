<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import sha256 from 'crypto-js/sha256';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Settings from 'lucide-svelte/icons/settings';

	import { address, authPasswordSHA2, info } from '../stores.js';
	import {
		fetchWithTimeout,
		getAuthCache,
		navigateToHomePage,
		navigateToSettingsPage
	} from '../utils.js';

	let isLoading = false;
	let authPassword = '';

	function verifyAuth() {
		isLoading = true;

		authPassword = authPassword.trim();
		if (authPassword === '') {
			return;
		}
		$authPasswordSHA2 = sha256(authPassword).toString();

		fetchWithTimeout($address + '/info')
			.then((data) => {
				$info = data.data;
				localStorage.setItem('cache:auth', $authPasswordSHA2);
				authPassword = '';
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
		getAuthCache();
	});
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[480px]">
		<Card.Header>
			<div class="grid grid-cols-3">
				<div class="col-span-2">
					<Card.Title>Welcome to AGScheduler Web</Card.Title>
				</div>
				<div class="relative">
					<Button
						variant="ghost"
						size="icon"
						class="absolute right-0 top-0 h-4 w-6 p-0"
						on:click={navigateToSettingsPage}
					>
						<span class="sr-only">Settings</span>
						<Settings class="h-4 w-4" />
					</Button>
				</div>
			</div>
			<Card.Description>Please enter the password for AGScheduler</Card.Description>
		</Card.Header>
		<Card.Content>
			<form>
				<div class="flex items-center space-x-4">
					<Input
						id="authPassword"
						bind:value={authPassword}
						placeholder="Password"
						type="password"
					/>
					<Button on:click={verifyAuth} disabled={!authPassword || isLoading}>
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Login
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>

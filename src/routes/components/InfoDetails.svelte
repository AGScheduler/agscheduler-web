<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import * as Popover from '$lib/components/ui/popover';
	import Text from 'lucide-svelte/icons/text';

	import { info } from '../stores.js';

	const dispatch = createEventDispatcher();

	function onFetchInfo() {
		dispatch('fetchInfo');
	}
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			size="icon"
			class="relative h-6 w-6 p-0"
			on:click={onFetchInfo}
		>
			<span class="sr-only">Details</span>
			<Text class="h-4 w-4" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-120">
		<div class="grid gap-4">
			<div class="space-y-2">
				<h4 class="font-medium leading-none">Details</h4>
				<p class="text-muted-foreground text-sm">About this information.</p>
			</div>
			<Separator />
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="is_cluster_mode">IsClusterMode:</Label>
					<Label for="is_cluster_mode">{$info.is_cluster_mode}</Label>
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="cluster_main_node">ClusterMainNode:</Label>
					<Label for="cluster_main_node">
						<div class="whitespace-pre-wrap">
							{JSON.stringify($info.cluster_main_node, null, 4)}
						</div>
					</Label>
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="version">Version:</Label>
					<Label for="version">{$info.version}</Label>
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>

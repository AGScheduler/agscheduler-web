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
	<Popover.Content class="w-90">
		<div class="grid gap-4">
			<div class="space-y-2">
				<h4 class="font-medium leading-none">Details</h4>
				<p class="text-muted-foreground text-sm">About this information.</p>
			</div>
			<Separator />
			<div class="grid grid-cols-2">
				<Label for="scheduler">Scheduler:</Label>
				<div class="grid grid-rows-2 gap-2">
					<div class="grid grid-cols-2 gap-1">
						<Label for="is_running">IsRunning:</Label>
						<Label for="is_running">{$info.scheduler.is_running}</Label>
					</div>
					<div class="grid grid-cols-2 gap-1">
						<Label for="store">Store:</Label>
						<Label for="store">{$info.scheduler.store}</Label>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-7">
				<div></div>
				<div class="col-start-2 col-end-7"><Separator /></div>
				<div></div>
			</div>
			<div class="grid grid-cols-2">
				<Label for="broker">Broker:</Label>
				<div class="grid grid-rows-auto gap-2">
					<div class="grid grid-cols-2 gap-1">
						<Label for="has_broker">HasBroker:</Label>
						<Label for="has_broker">{$info.broker.has_broker}</Label>
					</div>
					{#if $info.broker.has_broker}
						<div class="grid grid-cols-2 gap-1">
							<Label for="queues">Queues:</Label>
							<Label for="queues">{JSON.stringify($info.broker.queues.split(','), null, 4)}</Label>
						</div>
					{/if}
				</div>
			</div>
			<div class="grid grid-cols-7">
				<div></div>
				<div class="col-start-2 col-end-7"><Separator /></div>
				<div></div>
			</div>
			<div class="grid grid-cols-2">
				<Label for="recorder">Recorder:</Label>
				<div class="grid grid-rows-auto gap-2">
					<div class="grid grid-cols-2 gap-1">
						<Label for="has_recorder">HasRecorder:</Label>
						<Label for="has_recorder">{$info.recorder.has_recorder}</Label>
					</div>
					{#if $info.recorder.has_recorder}
						<div class="grid grid-cols-2 gap-1">
							<Label for="backend">Backend:</Label>
							<Label for="backend">{$info.recorder.backend}</Label>
						</div>
					{/if}
				</div>
			</div>
			<div class="grid grid-cols-7">
				<div></div>
				<div class="col-start-2 col-end-7"><Separator /></div>
				<div></div>
			</div>
			<div class="grid grid-cols-2">
				<Label for="cluster">Cluster:</Label>
				<div class="grid grid-rows-auto gap-2">
					<div class="grid grid-cols-2 gap-1">
						<Label for="is_cluster_mode">IsClusterMode:</Label>
						<Label for="is_cluster_mode">{$info.cluster.is_cluster_mode}</Label>
					</div>
					{#if $info.cluster.is_cluster_mode}
						<div class="row-start-2 row-end-7 grid grid-cols-2 gap-1">
							<Label for="main_node">MainNode:</Label>
							<Label for="main_node"
								><div class="whitespace-pre-wrap">
									{JSON.stringify($info.cluster.main_node, null, 4)}
								</div></Label
							>
						</div>
					{/if}
				</div>
			</div>
			<div class="grid grid-cols-7">
				<div></div>
				<div class="col-start-2 col-end-7"><Separator /></div>
				<div></div>
			</div>
			<div class="grid grid-cols-2">
				<Label for="version">Version:</Label>
				<Label for="version">{$info.version}</Label>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>

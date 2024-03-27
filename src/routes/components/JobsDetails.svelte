<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import * as Popover from '$lib/components/ui/popover';
	import Text from 'lucide-svelte/icons/text';

	import Job from './Jobs.svelte';

	export let job: Job;
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Details</span>
			<Text class="h-4 w-4" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-120">
		<div class="grid gap-4">
			<div class="space-y-2">
				<h4 class="font-medium leading-none">Details</h4>
				<p class="text-muted-foreground text-sm">Information about this job.</p>
			</div>
			<Separator />
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					{#if job.type === 'datetime'}
						<Label for="start_at">StartAt:</Label>
						<Label for="start_at">{job.start_at}</Label>
					{:else if job.type === 'interval'}
						<Label for="interval">Interval:</Label>
						<Label for="interval">{job.interval}</Label>
					{:else if job.type === 'cron'}
						<Label for="cron_expr">CronExpr:</Label>
						<Label for="cron_expr">{job.cron_expr}</Label>
					{/if}
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="timezone">Timezone:</Label>
					<Label for="timezone">{job.timezone}</Label>
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="func_name">FuncName:</Label>
					<Label for="func_name">{job.func_name}</Label>
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="args">Args:</Label>
					<Label for="args">
						<div class="whitespace-pre-wrap">
							{job.args !== null ? JSON.stringify(job.args, null, 4) : '{}'}
						</div>
					</Label>
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="timeout">Timeout:</Label>
					<Label for="timeout">{job.timeout}</Label>
				</div>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-2 items-center gap-4">
					<Label for="queues">Queues:</Label>
					<Label for="queues">{job.queues !== null ? JSON.stringify(job.queues) : '[]'}</Label>
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>

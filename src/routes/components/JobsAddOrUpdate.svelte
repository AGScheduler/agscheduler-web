<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import dayjs from 'dayjs';
	import { now, getLocalTimeZone } from '@internationalized/date';

	import Job from './Jobs.svelte';
	import { host } from '../stores.js';
	import { fetchWithTimeout } from '../utils.js';

	export let showAddOrUpdateDialog = false;
	export let title = '';
	export let job: Job = {};

	let isLoading = false;
	const dispatch = createEventDispatcher();

	let funcs = [];
	let defaultFunc = {
		label: '',
		value: ''
	};
	let name = 'myJob';
	let selectedType = {
		label: 'Interval',
		value: 'interval'
	};
	let startAt = dayjs(now(getLocalTimeZone()).toDate()).format('YYYY-MM-DD HH:mm:ss');
	let interval = '60s';
	let cronExpr = '*/1 * * * *';
	let timezone = getLocalTimeZone();
	let shortFuncName = '';
	let args = '{}';
	let timeout = '1h';
	let queues = '["default"]';

	function getShortFuncName(funcName) {
		return funcName.split('.')[funcName.split('.').length - 1];
	}

	function fetchFuncs() {
		fetchWithTimeout($host + '/funcs')
			.then((data) => {
				funcs = data.data;
				if (funcs.length > 0) {
					defaultFunc = {
						label: getShortFuncName(funcs[0].name),
						value: funcs[0].name
					};
				}
			})
			.catch((error) => {
				toast.error('' + error);
			});
	}

	function addJob() {
		isLoading = true;

		let newJob: Job = {};
		try {
			newJob = JSON.parse(JSON.stringify(job));

			newJob.name = name;
			newJob.type = selectedType.value;
			newJob.start_at = newJob.type === 'datetime' ? startAt : '';
			newJob.interval = newJob.type === 'interval' ? interval : '';
			newJob.cron_expr = newJob.type === 'cron' ? cronExpr : '';
			newJob.timezone = timezone;
			newJob.func_name = selectedFunc.value;
			newJob.args = args ? JSON.parse(args) : {};
			newJob.timeout = timeout;
			newJob.queues = queues ? JSON.parse(queues) : [];
		} catch (error) {
			isLoading = false;
			toast.error('' + error);
			return;
		}

		let method = title === 'Add' ? 'POST' : 'PUT';
		fetchWithTimeout($host + '/scheduler/job', { method: method, body: JSON.stringify(newJob) })
			.then(() => {
				showAddOrUpdateDialog = false;
				dispatch('fetchJobs');
			})
			.catch((error) => {
				toast.error('' + error);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	$: if (showAddOrUpdateDialog) {
		fetchFuncs();
	}

	$: if (!showAddOrUpdateDialog) {
		funcs = [];
		defaultFunc = {
			label: '',
			value: ''
		};
		name = job.name ? job.name : 'myJob';
		selectedType = job.type
			? {
					label: job.type.charAt(0).toUpperCase() + job.type.slice(1),
					value: job.type
				}
			: {
					label: 'Interval',
					value: 'interval'
				};
		startAt = job.start_at
			? job.start_at
			: dayjs(now(getLocalTimeZone()).toDate()).format('YYYY-MM-DD HH:mm:ss');
		interval = job.interval ? job.interval : '60s';
		cronExpr = job.cron_expr ? job.cron_expr : '*/1 * * * *';
		timezone = job.timezone ? job.timezone : getLocalTimeZone();
		shortFuncName = job.func_name ? getShortFuncName(job.func_name) : '';
		args = job.args !== null && job.args !== undefined ? JSON.stringify(job.args, null, 4) : '{}';
		timeout = job.timeout ? job.timeout : '1h';
		queues =
			job.queues !== null && job.queues !== undefined ? JSON.stringify(job.queues) : '["default"]';
	}

	$: selectedFunc = shortFuncName
		? {
				label: shortFuncName,
				value: job.func_name
			}
		: defaultFunc;
</script>

<Dialog.Root bind:open={showAddOrUpdateDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title} Job</Dialog.Title>
			<Dialog.Description>{title} your job here. Click submit when you're done.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" bind:value={name} class="col-span-3" placeholder="myJob" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="type" class="text-right">Type</Label>
				<Select.Root bind:selected={selectedType}>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="datetime">Datetime</Select.Item>
						<Select.Item value="interval">Interval</Select.Item>
						<Select.Item value="cron">Cron</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				{#if selectedType.value === 'datetime'}
					<Label for="start_at" class="text-right">StartAt</Label>
					<Input
						id="start_at"
						bind:value={startAt}
						class="col-span-3"
						placeholder="2024-02-28 08:28:00"
					/>
				{:else if selectedType.value === 'interval'}
					<Label for="interval" class="text-right">Interval</Label>
					<Input id="interval" bind:value={interval} class="col-span-3" placeholder="60s" />
				{:else if selectedType.value === 'cron'}
					<Label for="cron_expr" class="text-right">CronExpr</Label>
					<Input
						id="cron_expr"
						bind:value={cronExpr}
						class="col-span-3"
						placeholder="*/1 * * * *"
					/>
				{/if}
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="timezone" class="text-right">Timezone</Label>
				<Input id="timezone" bind:value={timezone} class="col-span-3" placeholder="UTC" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="type" class="text-right">FuncName</Label>
				<Select.Root bind:selected={selectedFunc}>
					<Select.Trigger class="w-[280px]">
						<Select.Value />
					</Select.Trigger>
					<Select.Content>
						{#each funcs as func}
							<Select.Item value={func.name} label={getShortFuncName(func.name)}>
								{getShortFuncName(func.name)}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="args" class="text-right">Args</Label>
				<Textarea id="args" bind:value={args} class="col-span-3" placeholder="" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="timeout" class="text-right">Timeout</Label>
				<Input id="timeout" bind:value={timeout} class="col-span-3" placeholder="1h" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="queues" class="text-right">Queues</Label>
				<Input
					id="queues"
					bind:value={queues}
					class="col-span-3"
					placeholder="[&quot;default&quot;]"
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit" on:click={addJob} disabled={isLoading}>
				{#if isLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Submit
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

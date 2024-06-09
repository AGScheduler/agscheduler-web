<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Text from 'lucide-svelte/icons/text';

	import Record from './Records.svelte';

	export let record: Record;
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Result</span>
			<Text class="h-4 w-4" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-h-[720px] sm:max-w-[1024px]">
		<Dialog.Header>
			<Dialog.Title>Result</Dialog.Title>
		</Dialog.Header>
		<div class="max-h-[580px] overflow-y-auto rounded-md bg-black p-6">
			<pre><code class="text-sm text-gray-300">{record.result}</code></pre>
		</div>
	</Dialog.Content>
</Dialog.Root>

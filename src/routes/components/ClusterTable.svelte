<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import dayjs from 'dayjs';

	import Node from './Cluster.svelte';

	export let nodes: Node[];
	export let page: number;
	export let perPage: number;
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Endpoint</Table.Head>
			<Table.Head>Leader</Table.Head>
			<Table.Head>EndpointGRPC</Table.Head>
			<Table.Head>EndpointHTTP</Table.Head>
			<Table.Head>EndpointMain</Table.Head>
			<Table.Head>Queue</Table.Head>
			<Table.Head>Mode</Table.Head>
			<Table.Head>Version</Table.Head>
			<Table.Head>Health</Table.Head>
			<Table.Head>RegisterTime</Table.Head>
			<Table.Head>LastHeartbeatTime</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each nodes.slice((page - 1) * perPage, page * perPage) as node, i (i)}
			<Table.Row>
				<Table.Cell>
					{node.endpoint}
				</Table.Cell>
				<Table.Cell>
					{#if node.endpoint === node.endpoint_main}
						<Badge>true</Badge>
					{:else}
						false
					{/if}
				</Table.Cell>
				<Table.Cell>{node.endpoint_grpc}</Table.Cell>
				<Table.Cell>{node.endpoint_http}</Table.Cell>
				<Table.Cell>{node.endpoint_main}</Table.Cell>
				<Table.Cell>{node.queue}</Table.Cell>
				<Table.Cell>
					{#if node.mode}
						<Badge variant="secondary">
							{node.mode}
						</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell>
					{#if node.version}
						{node.version}
					{/if}
				</Table.Cell>
				<Table.Cell>
					<Badge variant={node.health ? 'default' : 'destructive'}>
						{node.health}
					</Badge>
				</Table.Cell>
				<Table.Cell>
					{dayjs(node.register_time).format('YYYY-MM-DD HH:mm:ss')}
				</Table.Cell>
				<Table.Cell>
					{dayjs(node.last_heartbeat_time).format('YYYY-MM-DD HH:mm:ss')}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

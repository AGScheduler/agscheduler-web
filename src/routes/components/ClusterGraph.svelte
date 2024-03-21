<script lang="ts">
	import { onMount } from 'svelte';

	import * as echarts from 'echarts';

	import Node from './Cluster.svelte';

	export let nodes: Node[];

	// https://tailwind.nodejs.cn/docs/text-color
	const colorMap = {
		blue: 'rgb(96 165 250)',
		green: 'rgb(52 211 153)',
		red: 'rgb(248 113 113)',
		orange: 'rgb(251 146 60)',
		yellow: 'rgb(250 204 21)',
		gray: 'rgb(156 163 175)'
	};

	const categoryMap = {
		mainNode: { name: 'Main Node', color: colorMap.blue },
		healthyHANode: { name: 'Healthy HA Node', color: colorMap.green },
		unhealthyHANode: { name: 'Unhealthy HA Node', color: colorMap.red },
		healthyWorkerNode: { name: 'Healthy Worker Node', color: colorMap.orange },
		unhealthyWorkerNode: { name: 'Unhealthy Worker Node', color: colorMap.yellow },
		unknown: { name: 'Unknown', color: colorMap.gray }
	};

	let graph = {
		data: [],
		links: [],
		categories: Object.keys(categoryMap).map(function (k) {
			return {
				name: categoryMap[k].name,
				itemStyle: {
					normal: {
						color: categoryMap[k].color
					}
				}
			};
		})
	};

	$: {
		graph.data = [];
		graph.links = [];

		let mainNodeName: string;

		nodes.forEach((n) => {
			let nData = { name: n.endpoint, category: categoryMap.unknown.name };

			if (n.endpoint === n.endpoint_main) {
				mainNodeName = n.endpoint;
				nData.category = categoryMap.mainNode.name;
			} else if (n.mode === 'HA') {
				if (n.health) {
					nData.category = categoryMap.healthyHANode.name;
				} else {
					nData.category = categoryMap.unhealthyHANode.name;
				}
			} else {
				if (n.health) {
					nData.category = categoryMap.healthyWorkerNode.name;
				} else {
					nData.category = categoryMap.unhealthyWorkerNode.name;
				}
			}

			graph.data.push(nData);
		});

		graph.data.forEach((d) => {
			if (d.name !== mainNodeName) {
				graph.links.push({ source: mainNodeName, target: d.name });
			}
		});
	}

	onMount(() => {
		let myChart = echarts.init(document.getElementById('container'));

		let option = {
			legend: [
				{
					data: graph.categories.map(function (c: { name: string }) {
						return c.name;
					})
				}
			],
			series: [
				{
					type: 'graph',
					layout: 'force',
					force: {
						edgeLength: [50, 300],
						repulsion: 500
					},
					symbolSize: 50,
					label: { show: true, position: 'right' },
					emphasis: {
						focus: 'adjacency',
						lineStyle: { width: 3 }
					},
					data: graph.data,
					links: graph.links,
					categories: graph.categories
				}
			]
		};

		myChart.setOption(option);

		window.addEventListener('resize', function () {
			myChart.resize();
		});
	});
</script>

<div id="container" style="width: 100%; height: 600%;"></div>

<script>
	import '../app.pcss';
	import './styles.css';
	import { Toaster } from 'svelte-sonner';

	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />

<Toaster />

<slot />

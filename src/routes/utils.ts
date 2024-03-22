import { goto } from '$app/navigation';

export function navigateToHomePage() {
	goto('./');
}

export function navigateToSettingsPage() {
	goto('./settings');
}

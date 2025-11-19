import { expect, test } from '@nuxt/test-utils/playwright';

test('receive and show nostr events from relay', async ({ page, goto }) => {

    await goto('/', { waitUntil: 'hydration' });

    await expect(page.getByTestId('event-actions').first()).not.toBeVisible();

    const relayActionsDropdown = page.getByTestId('relay-actions').first()
    await relayActionsDropdown.click();

    const connectRelayButton = page.getByTestId('relay-connect');
    await connectRelayButton.click();

    await expect(page.getByTestId('event-actions').first()).toBeVisible();
});

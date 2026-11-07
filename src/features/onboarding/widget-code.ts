import { env } from '@/config/env';
import type { WidgetSnippet } from '@/lib/api/types';

/** Shown in the instructions when NEXT_PUBLIC_WIDGET_SCRIPT_URL is not configured. */
const PLACEHOLDER_SCRIPT_URL = 'https://widget.example.com/main.js';

/** Goes in the page `<head>`: loads the widget bundle. */
export const widgetScriptTag = `<script defer="defer" src="${env.widgetScriptUrl ?? PLACEHOLDER_SCRIPT_URL}"></script>`;

/**
 * Goes before `</body>`: mounts the widget with the workspace configuration.
 * The root element id and init call are the API exposed by the widget bundle.
 */
export const buildWidgetInitCode = (
  snippet: WidgetSnippet | undefined,
) => `<div id="twilio-webchat-widget-root"></div>
<script>
 window.addEventListener("DOMContentLoaded", () => {
  Twilio.initWebchat(${JSON.stringify(snippet ?? {}, null, 2)})
 })
</script>
`;

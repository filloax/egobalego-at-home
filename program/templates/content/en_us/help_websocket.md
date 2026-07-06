This is the section for mod control by WebSocket, a system through which (if the "Live Update" service setting is enabled in the mod) Egobalego at Home and the mod can communicate in real time, unlike the other sections that require waiting for the mod to request updated data.

Several distinct events can be sent:
*   Instant trigger of a **dialogue** for all researchers with a player nearby (legacy mode only);
*   Popup of a **notification**, to be set as explained in the "Communications" section;
*   Popup of a **client notification**, reaching the mod client directly instead of a joined server/world - works even from the main menu (new mode only, requires `clientDataSync` enabled in the mod config);
*   Execution of any **command** in the game (like with manual commands from the "Commands" section, it requires enabling the _"remoteCommandExecution"_ option);
*   **Reload of data** set in the other sections (this one is also available on other pages if the WebSocket is connected);
*   **Reload of client data**, same as above but reaching the mod client directly instead of a joined server/world (new mode only).

If the WebSocket is not connected, no events can be sent, and the buttons will be disabled. If they are active, clicking on them will send the corresponding event to the mod, turning green on success or red on failure.

At the top of the page (if there is connection), the latest response from the mod can be viewed along with the corresponding timestamp, and eventual details are shown on the right.

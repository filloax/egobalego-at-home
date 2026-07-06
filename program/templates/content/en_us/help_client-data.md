This is the client data section, for the Apibalego **client gamemaster API** (`apibalego:toast`, `apibalego:resourcepack`, `apibalego:menu_message`). Unlike the rest of this app, these items are polled directly by the mod client itself, over HTTP, independently from the world/server — they even work from the main menu, no world needs to be loaded.

- **Toast**: shows a client-side toast notification, same fields as the one in Communications (title, optional message, optional icon item).
- **Resource pack**: pushes a resource pack to the player by download URL. Bump the **version** whenever you change the zip's contents so the mod re-downloads it, otherwise the previously downloaded copy is kept. Requires `clientResourcePackSync` to be enabled in the mod config.
- **Main menu message**: replaces the vanilla splash text pool with your own list of messages, one per line.

**Note:** this feature is not available in legacy mode, since it relies on the new Apibalego API, and requires `clientDataSync` to be enabled in the mod config (disabled by default).

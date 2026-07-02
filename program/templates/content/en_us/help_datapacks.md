This is the datapacks section, which lets you push a datapack to the mod so it downloads, installs and enables it automatically (available since Apibalego added `apibalego:datapack` support).

Set the **download URL** the datapack zip will be fetched from, and a **version** string. The version is only used to decide whether the mod needs to re-download the pack: if you change the zip's contents, bump the version so the mod picks up the update, otherwise it will keep the previously downloaded copy.

**Note:** this feature is not available in legacy mode, since it relies on the new Apibalego API.

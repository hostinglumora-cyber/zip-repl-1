---
name: Imported website preview
description: Restoring an attached runnable site after moving a conversation into a project
---

When an attached runnable website is carried into a project, its files may remain under `.conversation/attached_assets`; restore them into the registered artifact before presenting the preview.

**Why:** Conversation attachments can outlive the chat transfer without appearing in the project workspace, and an unregistered copied artifact cannot be opened by the preview pane.

**How to apply:** Check `.conversation/attached_assets` after a project transition, restore the site, ensure the artifact is registered, then restart its managed workflow and present it.
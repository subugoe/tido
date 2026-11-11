# TIDO

A viewer for TextAPI resources. It shows the items of collections and manifests side by side in panels, each panel showing one item through one or more views.

## Language

### Panels and views

**Panel**:
A column of the viewer that shows one item at a time through its views and can navigate to other items. Its views come from the configuration (its own views, else the global ones), a bookmark or the defaults, and can grow while it is open by appended views. It can show no view at all on an item.

**Panel view**:
A view of a panel as the project configures it: text or image, a label, the content types it may offer, and its configured content type.
_Avoid_: view config, views config

**View state**:
A panel view as it is shown on the current item: its offered content types, its active content type and whether it is visible.
_Avoid_: resolved view, panel view (for the shown one)

**View key**:
The stable identity of a view within its panel: its position among the configured panel views, continued for appended views. Survives item navigation and bookmarks.
_Avoid_: view index (when identity is meant), label

**Omitted view**:
A view the panel does not show on the current item, because it has nothing to show there and its kind is one the panel hides when empty. It comes back on the next item it has something to show for, with what was changed on it.
_Avoid_: hidden view (that is one the user switched off), empty view

**Appended view**:
A text view a panel gains while open, from synopsis or cross-reference, without a matching panel view. It stays with the panel across items.
_Avoid_: synced view, extra view

### Content types

**Content type**:
The kind of text a content of an item holds (e.g. transcription, edited), taken from its `type` parameter.

**Configured content type**:
The content type the project sets as default for a text view. Only the project's configuration sets it.
_Avoid_: default type, initial type

**Preferred content type**:
The last deliberate choice of a content type for a text view: the user's toggle, a cross-reference, a synopsis selection or a restored bookmark. Kept on items that do not offer it; never set by a fallback.
_Avoid_: selected type, chosen type

**Active content type**:
The content type a text view shows on the current item: the preferred one if offered, else the configured one if offered, else the first one offered.
_Avoid_: current type, selected type

**Text source**:
The content a text view shows on the current item, identified by its URL, together with the view it belongs to and whether that view is visible.
_Avoid_: content url (when the view matters), witness (outside synopsis)

**Bookmark**:
The state of all panels serialised into the URL: item, selected annotation and, per view key, its visibility and preferred content type. The key is `activeContentType` for compatibility, but its value is the preference. It overrides the views of the panel configuration when loaded.
_Avoid_: content state (for the concept), permalink

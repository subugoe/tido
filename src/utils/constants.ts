export const ANNOTATION_IDS_ATTRIBUTE = 'data-annotation-ids'
// A target with this format references another annotation instead of a text content file,
// which changes how its selector has to be read (see getSelectorValue in utils/annotations).
export const ANNOTATION_TARGET_JSON_FORMAT = 'application/ld+json'
export const ANNOTATION_BASE_STYLE = ['rounded']
export const ANNOTATION_HOVER_CLASSES = ['bg-annotation-hover', 'cursor-pointer']
export const NESTED_TARGET_HOVER_CLASSES = ['outline', 'dark:outline-muted-foreground']
export const SELECTED_ANNOTATION_CLASSES = ['bg-annotation-selected']
export const SELECTED_ANNOTATION_ATTRIBUTE = 'data-annotation-selected'
export const HIGHLIGHTING_STYLE = ['bg-accent', 'relative', 'cursor-pointer']
export const CROSS_REF_TARGET_STYLE = ['text-blue-500', 'underline']
export const CROSS_REF_ATTRIBUTE = 'data-target'
export const CROSS_REF_REL_ATTRIBUTE = 'rel'
export const CROSS_REF_REL_STYLE = ['bg-yellow-200']
// How long the referenced element keeps its style once it is on screen and the scrolling has stopped
export const CROSS_REF_REL_STYLE_DURATION = 3000
export const SYNOPSIS_SELECTED_STYLE = ['bg-synopsis-selected']
export const SYNOPSIS_HOVER_STYLE = ['bg-synopsis-hover', 'cursor-pointer']
export const ACTIVE_TARGET_STYLE = ['bg-annotation-selected']

export const SYNC_TARGET_HOVER_STYLE = ['!bg-sync-annotation-hover']
export const SYNC_ANNOTATION_ID_ATTRIBUTE = 'data-sync-annotation-id'
export const SYNC_HIGHLIGHT_STYLE = ['cursor-pointer']

export const MIN_PANEL_WIDTH = 400
export const DEFAULT_PANEL_WIDTH = 800
export const ANNOTATIONS_PANE_DEFAULT_WIDTH = 400
// The annotations pane is shown next to the views inside the panel and cannot be dragged narrower
export const ANNOTATIONS_PANE_MIN_WIDTH = 280
// The annotations pane opens with at most this share of the panel width
export const ANNOTATIONS_PANE_MAX_SHARE = 0.4
export const PANEL_BORDER_WIDTH = 1
export const PANEL_GAP = 16
export const PANEL_HEADER_HEIGHT = 48
// The toolbar over the top of a view - text, image or annotations - below the panel header
export const VIEW_HEADER_HEIGHT = 40
export const PANEL_FOOTER_HEIGHT = 38

export const RAIL_WIDTH = 72
export const RAIL_EXPANDED_WIDTH = 340

export const SUPPORTED_MIME_TYPES = [
  'text/html',
  'text/plain',
  'text/xml',
  'application/xhtml+xml'
]

export const NODE_KEY_DELIMITER = '>>>>'

export const BLOB_CONTENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'audio/mpeg', 'video/mp4']
export const TEXT_CONTENT_TYPES = ['text/xhtml+xml', 'text/plain', 'text/html', 'text/css']

export const FORBID_TAGS = ['input', 'script', 'noscript', 'iframe', 'frame', 'frameset', 'noframes', 'applet', 'base', 'meta', 'form']
export const ADD_ATTR = ['target', 'rel']

export const AUTO_SCROLLING_ATTR_NAME = 'data-auto-scrolling'

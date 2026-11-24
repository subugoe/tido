import { usePanelStore } from '@/store/PanelStore.tsx'
import { createContentState, encodeState } from '@/utils/bookmarking.ts'
import { GetShareUrlOptions } from '@/types'

// Creates the url that restores the current panels - the one the share dialog shows. The state of the
// panels is set as "tido" param at the base url, which is the current location unless specified.
async function getShareUrl({ baseUrl }: GetShareUrlOptions = {}): Promise<string> {
  const panelStates = usePanelStore.getState().panels

  // a panel without its item or manifest is still loading and can not be described by a content state
  if (panelStates.some(({ item, manifest }) => !item || !manifest)) {
    throw new Error('Share URL can not be created: the panels are not loaded yet')
  }

  const encoded = await encodeState(createContentState(panelStates))
  const url = new URL(baseUrl ?? window.location.href)

  url.searchParams.set('tido', encoded)
  return url.toString()
}

export {
  getShareUrl
}

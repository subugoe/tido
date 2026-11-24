import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TFunction } from 'i18next'
import { TidoConfig } from '@/types'
import { mergeAndValidateConfig } from './config.ts'
import { defaultConfig } from './default-config.ts'

const t = ((key: string) => key) as unknown as TFunction

// the user config is unknown input, so the values do not have to match the config types
function validate(userConfig: Record<string, unknown>) {
  return mergeAndValidateConfig(userConfig as Partial<TidoConfig>, defaultConfig, { lang: 'en', translations: {} }, t)
}

describe('config: showShareButton', () => {
  beforeEach(() => {
    // the config looks for a bookmarked state at the current location
    vi.stubGlobal('window', { location: { href: 'https://host.example/viewer' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the share button by default', async () => {
    const { config, errors } = await validate({})

    expect(config.showShareButton).toBe(true)
    expect(errors).not.toHaveProperty('showShareButton')
  })

  it('hides the share button when set to false', async () => {
    const { config, errors } = await validate({ showShareButton: false })

    expect(config.showShareButton).toBe(false)
    expect(errors).not.toHaveProperty('showShareButton')
  })

  it('falls back to the default and reports an error for a non-boolean', async () => {
    const { config, errors } = await validate({ showShareButton: 'false' })

    expect(config.showShareButton).toBe(true)
    expect(errors).toHaveProperty('showShareButton', 'must be a boolean')
  })
})

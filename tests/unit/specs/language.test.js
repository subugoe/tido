import LANGUAGE from '@/components/language.vue'

jest.mock('@quasar/extras/fontawesome-v5', () => '')

describe('Language component', () => {
  it('has a data prop "EN"', () => {
    const lang = LANGUAGE.data()

    expect(lang.lang).toBe('EN')
  })
})

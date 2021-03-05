import CONTENT from '@/components/content.vue'

jest.mock('@quasar/extras/fontawesome-v5', () => '')

describe('Content component', () => {
  const component = CONTENT

  it('has a property "contenturls"', () => {
    expect(component.props).toHaveProperty('contenturls')
  })

  it('is of type array', () => {
    expect(typeof component.props.transcription.type).toBe('function')
  })
})

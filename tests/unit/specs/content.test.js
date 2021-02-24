import CONTENT from '@/components/content.vue'

jest.mock('@quasar/extras/fontawesome-v5', () => '')

describe('Content component', () => {
  const component = CONTENT

  it('has a property "transcription"', () => {
    expect(component.props).toHaveProperty('transcription')
  })

  console.log(component.props.transcription.type)

  it('is of type string', () => {
    expect(typeof component.props.transcription.type).toBe('function')
  })
})

import LANGUAGE from '@/components/language.vue';

jest.mock('@quasar/extras/fontawesome-v5', () => '');

describe('Language', () => {
  it('has a data prop "DE"', () => {
    const lang = LANGUAGE.data();

    expect(lang.langs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'DE',
        }),
      ])
    );
  });
});

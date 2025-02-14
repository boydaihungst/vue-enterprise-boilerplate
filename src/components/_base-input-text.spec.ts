import BaseInputText from './_base-input-text.vue';

describe('@components/_base-input-text', () => {
  it('works with v-model', async () => {
    const wrapper = mount(BaseInputText, { props: { modelValue: 'aaa' } });
    const inputWrapper = wrapper.find('input');
    const inputEl = inputWrapper.element;

    // Has the correct starting value
    expect(inputEl.value).toEqual('aaa');

    // Emits an update event with the correct value when edited
    inputEl.value = 'bbb';
    await inputWrapper.trigger('input');
    expect(wrapper.emitted()['update:modelValue']).toEqual([['bbb']]);

    // Sets the input to the correct value when props change
    await wrapper.setProps({ modelValue: 'ccc' });
    expect(inputEl.value).toEqual('ccc');
  });

  it('allows a type of "password"', () => {
    const consoleError = vi.spyOn(console, 'warn').mockImplementation(() => {
      //
    });

    mount(BaseInputText, {
      props: { modelValue: 'aaa', type: 'password' },
    });
    expect(consoleError).not.toBeCalled();
    consoleError.mockRestore();
  });

  it('does NOT allow a type of "checkbox"', () => {
    const consoleError = vi.spyOn(console, 'warn').mockImplementation(() => {
      //
    });

    mount(BaseInputText, {
      props: { modelValue: 'aaa', type: 'checkbox' },
    });
    expect(consoleError.mock.calls[0][0]).toContain(
      'custom validator check failed for prop "type"',
    );
    consoleError.mockRestore();
  });
});

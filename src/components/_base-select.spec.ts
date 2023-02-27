import { h } from 'vue';
import BaseSelect from './_base-select.vue';
const mountBaseSelect = (options: Partial<typeof mount> = {}) => {
  return mount(BaseSelect, {
    slots: {
      default: [
        h('option', { value: 'en', label: 'en' }),
        h('option', { value: 'vi', label: 'vi' }),
        h('option', { value: 'jp', label: 'jp' }),
      ],
    },
    ...options,
  });
};

describe('@components/_base-select', () => {
  it('renders its content', () => {
    const slotContent = `<select class="select">
  <option label="en" value="en"></option>
  <option label="vi" value="vi"></option>
  <option label="jp" value="jp"></option>
</select>`;
    const wrapper = mountBaseSelect();

    expect(wrapper.html()).toContain(slotContent);
  });

  it('works with v-model', async () => {
    const wrapper = mountBaseSelect({ props: { modelValue: 'en' } });
    const selectWrapper = wrapper.find('select');
    const selectEl = selectWrapper.element;

    // Has the correct starting value
    expect(selectEl.value).toEqual('en');

    // Emits an update event with the correct value when edited
    await selectWrapper.setValue('vi');
    expect(wrapper.emitted()['update:modelValue']).toEqual([['vi']]);

    // Sets the select to the correct value when props change
    await wrapper.setProps({ modelValue: 'jp' });
    expect(selectEl.value).toEqual('jp');
  });
});

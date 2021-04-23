---
to: "src/components/<%= h.changeCase.kebab(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= h.changeCase.kebab(name) %>.vue"
---
<%
  if (blocks.indexOf('script') !== -1) {
%><script lang="ts">
  import { defineComponent, <% if (blocks.indexOf('template') === -1) {
    %>VNode<% } %> } from 'vue';
  export default defineComponent({
    components: {},
    directives: {},
    mixins: [],
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    },
    inheritAttrs: true,
    props: {
      propName: {
        type: Number,
        default: 0,
        required: false,
        validator: function (value: number) {
          return value >= 0;
        },
      },
    },
    emits: {
      click: null,
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true;
        } else {
          console.warn(`Invalid submit event payload!`)
          return false;
        }
      }
    },
    setup(props, { attrs, slots, emit }) {
      // const { propName } = toRefs(props);
    },
    data() {
      return {
        dataName: '',
      };
    },
    computed: {
      // Required return type
      computedName(): string {
        return this.dataName;
      },
    },
    watch: {
      dataName(newValue, oldValue) {
        //
      },
    },
    beforeCreate() {
      //
    },
    created() {
      //
    },
    beforeMount() {
      //
    },
    mounted() {
      //
    },
    beforeUpdate() {
      //
    },
    updated() {
      //
    },
    activated() {
      //
    },
    deactivated() {
      //
    },
    beforeUnmount() {
      //
    },
    unmounted() {
      //
    },
    methods: {
      methodName() {},
    },<% if (blocks.indexOf('template') === -1) {
    %>render(): VNode {
      // <div><slot></slot></div>
      return h('div', this.$slots.default({
        propName: 'data'
      }))
    },<% } %>
  });
</script>
<%
}

if (blocks.indexOf('template') !== -1) {
%>
<template>
  <div></div>
</template>
<%
}

if (blocks.indexOf('style') !== -1) {
%>
<style lang="scss" module>
  @import '@design';
</style><%
}
%>

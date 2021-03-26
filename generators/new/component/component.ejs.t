---
to: "src/components/<%= h.changeCase.kebab(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= h.changeCase.kebab(name) %>.vue"
---
<%
if (blocks.indexOf('script') !== -1) {
%><script>
  export default {
    directives: {},
    mixins: {},
    inheritAttrs: true,
    model: {
      prop: 'checked',
      event: 'change',
    },
    props: {
      propName: {
        type: Number,
        default: 0,
        required: true,
        validator: function (value) {
          return value >= 0;
        },
      },
    },
    data() {
      return {
        dataName: '',
      };
    },
    computed: {
      computedName() {
        return this.dataName;
      },
    },
    watch: {
      dataName(newValue, oldValue) {},
    },
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    activated() {},
    deactivated() {},
    beforeDestroy() {},
    destroyed() {},
    methods: {
      methodName() {},
    },<% if (blocks.indexOf('template') === -1) {
    %>render(h) {
      return <div/>
    },<% } %>
  };
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

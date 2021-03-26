---
to: "src/router/views/<%= h.changeCase.kebab(name) %>.vue"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName)
  const titleName = h.changeCase.title(name)
%><script>
  import Layout from '@layouts/main.vue';

  export default {
    metaInfo: {
      title: '<%= titleName %>',
      meta: [{ name: 'description', content: 'The <%= titleName %> page.' }],
    },
    components: { Layout },
    directives: {},
    mixins: {},
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
    },
  };
</script>

<template>
  <Layout>
    <%= titleName %>
  </Layout>
</template>
<%

if (useStyles) { %>
<style lang="scss" module>
  @import '@design';
</style>
<% } %>

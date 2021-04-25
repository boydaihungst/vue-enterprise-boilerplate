---
to: "src/router/views/<%= h.changeCase.kebab(name) %>.vue"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName)
  const titleName = h.changeCase.title(name)
%><script lang="ts">
  import { defineComponent } from 'vue';
  import { useMeta } from 'vue-meta';
  import Layout from '@layouts/layout.vue';

  export default defineComponent({
    components: {
      Layout,
    },
    directives: {},
    mixins: [],
    inject: {
      foo: {
        from: 'bar',
        default: 'foo',
      },
    },
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
    setup() {
      // const { propName } = toRefs(props);
      useMeta({
        title: '<%= titleName %>',
        description: '',
      });
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
      dataName() {
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
      methodName() {
        //
      },
    },
  });
</script>

<template>
  <Layout is="default" data-test="view-layout"><%= titleName %></Layout>
</template>
<%

if (useStyles) { %>
<style lang="scss" module>
  @import '@design';
</style><% } %>

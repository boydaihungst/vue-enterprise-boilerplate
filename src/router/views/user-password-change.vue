<script>
  import Layout from '@layouts/main.vue';

  export default {
    metaInfo: {
      title: 'User Password Change',
      meta: [
        { name: 'description', content: 'The User Password Change page.' },
      ],
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
  <Layout>User Password Change</Layout>
</template>

<style lang="scss" module>
  @import '@design';
</style>

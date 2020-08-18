<template>
  <section class="panels-sec">
    <div class="row panels-target">
      <div class="col-12 col-sm-6 col-md-3" v-for="(p,i) in panels" :key="`pc${i}`" v-show="p.show">
        <Toolbar :heading="p.toolbar" />

        <!-- Shows the nested tab components  -->
        <q-card v-if="p.tabs.children" flat>
          <q-tabs
            class="contian-tabs"
            v-model="p.tabs.model"
            v-for="(tab,i) in p.tabs.children"
            :key="`pt${i}`"
            active-bg-color="grey-4"
            align="right"
            >
            <q-tab :name="tab.name" :label="tab.label" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="p.tabs.model" class="content-panel" animated>
            <q-tab-panel :name="tab.name" v-for="(tab,i) in p.tabs.children" :key="`ppt${i}`">
              <component :is="tab.component" v-bind="componentProps.tabs[tab.name]"></component>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <!-- Shows the Direct components  -->
        <div v-else class="q-pa-md q-gutter-sm overflow-hidden">
          <component :is="p.component" v-bind="componentProps.direct[p.name]"></component>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Toolbar from '@/components/toolbar.vue';

export default {
  components: {
    Toolbar,
  },
  props: {
    componentProps: {
      type: Object,
    },
    panels: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="sass" scoped>
  @import '../../css/responsive-heights.sass'

  .panels-target
    > *
      border-right: 1px solid #ddd
      flex: auto

  .contian-tabs
    display: inline-block
</style>

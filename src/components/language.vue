<template>

  <div class="language">
    <q-btn
      flat
      color="grey"
      label="">
      <q-icon
        class=""
        size="md"
        :name="fasLanguage" />
      <q-menu
        fit
        anchor="center middle"
        self="center middle">

        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>EN</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>DE</q-item-section>
          </q-item>
        </q-list>

      </q-menu>
    </q-btn>
      <!--
      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu
          anchor="center middle"
          self="center middle"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="center middle"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="center middle"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
-->
<!--
    <q-btn-dropdown
      dense
      flat
      color="red"
      label="Language Switch" dropdown-icon="fasChevronRight">
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Deutsch</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>English</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>

    </q-btn-dropdown>
    -->
  </div>
</template>

<script>
import { fasLanguage } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Language',
  methods: {
    onItemClick() {
      // console.log('Clicked on an Item')
    },
  },
  created() {
    this.fasLanguage = fasLanguage;
  },
};
</script>

<template>
  <q-layout>
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="288"
      :breakpoint="500"
      bordered
      class="drawerclass"
    >
      <q-scroll-area class="fit">
        <div class="drawer-content">
          <div class="logo-holder">
            <img src="../../assets/images/logo.png" />
          </div>
          <div class="input-holder">
            <input
              type="text"
              v-model="input"
              placeholder="Search"
              class="input"
            />
          </div>

          <router-link
            to="/Dashboard"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/my.png" />
              <p class="drawer-text">My</p>
            </div>
          </router-link>

          <router-link
            to="/Dashboard"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/dashboard.png" />
              <p class="drawer-text">Dashboard</p>
            </div>
          </router-link>

          <router-link
            to="/Calendar"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/calendar.png" />
              <p class="drawer-text">Calendar</p>
            </div>
          </router-link>
          <div class="icon-text">
            <p class="drawer-subheading">work</p>
          </div>

          <div class="q-pa-md" style="max-width: 350px">
            <q-list padding>
              <q-expansion-item
                dense
                dense-toggle
                icon="perm_identity"
                label="Account settings"
                class="expanded-items"
                label-lines="10"
              >
                <div>
                  <router-link
                    to="/Contact-Settings"
                    style="text-decoration: none; color: inherit"
                  >
                    <div class="expanded-content">
                      <img />
                      <p class="drawer-text">Contact</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/Company"
                    style="text-decoration: none; color: inherit"
                  >
                    <div class="expanded-content">
                      <img />
                      <p class="drawer-text">Company</p>
                    </div>
                  </router-link>
                  <router-link
                    to="/ServiceRecord"
                    style="text-decoration: none; color: inherit"
                  >
                    <div class="expanded-content">
                      <img />
                      <p class="drawer-text">Service Record</p>
                    </div>
                  </router-link>
                  <router-link
                    to="/PhoneRecord"
                    style="text-decoration: none; color: inherit"
                  >
                    <div class="expanded-content">
                      <img />
                      <p class="drawer-text">Phone Record</p>
                    </div>
                  </router-link>
                </div>
              </q-expansion-item>
            </q-list>
          </div>
          <router-link
            to="/WorkOrder"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/workorder.png" />
              <p class="drawer-text">Work Order</p>
            </div>
          </router-link>

          <router-link
            to="/KnowledgeForm"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/knowledgebase.png" />
              <p class="drawer-text">Knowledge Base</p>
            </div>
          </router-link>
          <router-link
            to="/ReportForm"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/Repportform.png" />
              <p class="drawer-text">Report Form</p>
            </div>
          </router-link>

          <router-link
            to="/ApplicationProgram"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../assets/images/Applicationform.png" />
              <p class="drawer-text">Application Program</p>
            </div>
          </router-link>
          <router-link to="/Stow" style="text-decoration: none; color: inherit">
            <div class="bottom-section">
              <div class="icon-text">
                <img src="../../assets/images/workorder.png" />
                <p class="drawer-text">Stow</p>
              </div>
            </div>
          </router-link>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- <q-page-container>
      <q-page padding>
        <MenuBar />

      </q-page>
    </q-page-container> -->
  </q-layout>
</template>

<script>
// import ContactsTable from 'src/components/ContactsTable/ContactsTable.vue'
import { defineComponent, ref } from "vue";
import "./drawer.scss";
// import MenuBar from '../MenuBar/MenuBar.vue'
export default defineComponent({
  setup() {
    return {
      drawer: ref(true),
      menuList,
    };
  },

  name: "DrawerBar",

  components: {},
});
const menuList = [
  {
    icon: "receipt",
    label: "receipt",
    separator: false,
  },

  {
    icon: "receipt",
    label: "receipt",
    separator: false,
  },
  {
    icon: "receipt",
    label: "receipt",
    separator: false,
  },
  {
    icon: "receipt",
    label: "receipt",
    separator: false,
  },
  {
    icon: "receipt",
    label: "receipt",
    separator: false,
  },
];
</script>

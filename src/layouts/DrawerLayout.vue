<template>
  <q-layout view="hHh LpR fFf">
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
            <img src="../../src/assets/images/logo.png" />
          </div>
          <div class="input-holder">
            <input
              type="text"
              v-model="input"
              placeholder="Search"
              class="input"
            />
          </div>
        </div>

        <div v-for="(menu, index) in menus" :key="index">
          <q-list bordered v-if="menu.hasSubMenu" class="q-pa-md">
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              :label="menu.pages_id.name"
              style="color: #fff"
            >
              <div v-for="(child, cIndex) in menu.children" :key="cIndex">
                <router-link
                  v-if="child.isMenu"
                  :to="child.url"
                  style="text-decoration: none; color: inherit"
                >
                  <div class="expanded-content">
                    <img />
                    <p class="drawer-text">{{ child.label }}</p>
                  </div>
                </router-link>
              </div>
            </q-expansion-item>
          </q-list>
          <q-list v-else>
            <q-item>
              <router-link
                :to="menu.url"
                style="text-decoration: none; color: inherit"
              >
                <div class="icon-text">
                  <img :src="menu.icon" />
                  <p class="drawer-text">{{ menu.pages_id.name }}</p>
                </div>
              </q-expansion-item>
            </q-list>
          </div>
          <router-link
            to="/WorkOrder"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../src/assets/images/workorder.png" />
              <p class="drawer-text">Work Order</p>
            </div>
          </router-link>

          <router-link
            to="/KnowledgeForm"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../src/assets/images/knowledgebase.png" />
              <p class="drawer-text">Knowledge Base</p>
            </div>
          </router-link>
          <router-link
            to="/ReportForm"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../src/assets/images/Repportform.png" />
              <p class="drawer-text">Report Form</p>
            </div>
          </router-link>

          <router-link
            to="/ApplicationProgram"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img src="../../src/assets/images/Applicationform.png" />
              <p class="drawer-text">Application Program</p>
            </div>
          </router-link>
          <router-link to="/Stow" style="text-decoration: none; color: inherit">
            <div class="bottom-section">
              <div class="icon-text">
                <img src="../../src/assets/images/workorder.png" />
                <p class="drawer-text">Stow</p>
              </div>
            </div>
          </router-link>
        </div>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="main-container">
      <q-page-sticky expand position="top">
        <MenuBar />
      </q-page-sticky>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import "../components/SideDrawer/drawer.scss";
import "./DrawerLayout.scss";
import MenuBar from "src/components/MenuBar/MenuBar.vue";
</script>

<template>
  <div class="flex items-center">
    <q-btn color="grey-7" round flat icon="more_vert">
      <q-menu fit anchor="bottom middle" self="top right" auto-close>
        <q-list>
          <q-item clickable>
            <q-item-section>Edit</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>Add Customers</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>Delete Group</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

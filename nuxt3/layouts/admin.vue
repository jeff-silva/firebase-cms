<template>
  <div class="d-flex">
    <div
      style="min-width: 200px; max-width: 200px; height: 100vh; overflow: auto"
    >
      <v-list>
        <v-list-item
          to="/admin"
          text="Admin"
        />
        <v-list-item
          to="/admin/auth"
          text="Auth"
        />
        <v-list-item
          to="/admin/test"
          text="Test"
        />
      </v-list>
    </div>
    <div
      class="flex-grow-1 pa-3"
      style="height: 100vh; overflow: auto"
    >
      <slot></slot>
    </div>
  </div>
</template>

<template>
  <nuxt-layout name="admin">
    <div class="d-flex flex-column ga-4">
      <div class="d-flex align-center ga-2">
        <div>Create:</div>
        <v-text-field
          label="E-mail"
          v-model="firebase.authCreate.data.email"
          :hide-details="true"
        />
        <v-text-field
          label="Password"
          v-model="firebase.authCreate.data.password"
          :hide-details="true"
        />
        <v-btn
          :loading="firebase.authCreate.busy"
          @click="firebase.authCreate.submit()"
        >
          Create
        </v-btn>
      </div>

      <div class="d-flex align-center ga-2">
        <div>Login:</div>
        <v-text-field
          label="E-mail"
          v-model="firebase.authLogin.data.email"
          :hide-details="true"
        />
        <v-text-field
          label="Password"
          v-model="firebase.authLogin.data.password"
          :hide-details="true"
        />
        <v-btn
          :loading="firebase.authLogin.busy"
          @click="firebase.authLogin.submit()"
        >
          Login
        </v-btn>
      </div>

      <div
        class="d-flex align-center ga-2"
        v-if="firebase.auth.user"
      >
        <div>Logged:</div>
        <v-avatar size="40">
          <v-img :src="firebase.auth.user.photoURL" />
        </v-avatar>
        <div class="flex-grow-1">{{ firebase.auth.user.displayName }}</div>
        <v-btn
          :loading="firebase.authList.busy"
          @click="firebase.authList.submit()"
        >
          Logout
        </v-btn>
      </div>

      <div class="d-flex align-center ga-2">
        <div>List:</div>
        <div class="flex-grow-1 border">
          <v-table>
            <thead>
              <tr>
                <th>Email</th>
              </tr>
            </thead>
          </v-table>
        </div>
        <v-btn
          :loading="firebase.authList.busy"
          @click="firebase.authList.submit()"
        >
          List
        </v-btn>
      </div>

      <pre>firebase.authLogin: {{ firebase.authLogin }}</pre>
    </div>
  </nuxt-layout>
</template>

<script setup>
import useFirebase from "@/composables/useFirebase";
const firebase = useFirebase();
</script>

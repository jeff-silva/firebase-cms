<template>
  <nuxt-layout name="admin">
    <div class="d-flex flex-column ga-4">
      <div class="d-flex align-center ga-2">
        <div style="min-width: 100px">Create:</div>
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
        <div style="min-width: 150px; max-width: 150px">
          <v-btn
            block
            :loading="firebase.authCreate.busy"
            @click="
              async () => {
                await firebase.authCreate.submit();
                firebase.userList.submit();
              }
            "
          >
            Create
          </v-btn>
          <small
            class="text-error"
            v-if="firebase.authCreate.error"
            v-html="firebase.authCreate.error"
          />
        </div>
      </div>

      <div class="d-flex align-center ga-2">
        <div style="min-width: 100px">Login:</div>
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
        <div style="min-width: 150px; max-width: 150px">
          <v-btn
            block
            :loading="firebase.authLogin.busy"
            @click="firebase.authLogin.submit()"
          >
            Login
          </v-btn>
          <small
            class="text-error"
            v-if="firebase.authLogin.error"
            v-html="firebase.authLogin.error"
          />
        </div>
      </div>

      <div
        class="d-flex align-center ga-2"
        v-if="firebase.auth.user"
      >
        <div style="min-width: 100px">Logged:</div>
        <v-avatar size="40">
          <v-img :src="firebase.auth.user.photoURL" />
        </v-avatar>
        <div class="flex-grow-1">{{ firebase.auth.user.displayName }}</div>
        <div style="min-width: 150px; max-width: 150px">
          <v-btn
            block
            :loading="firebase.auth.busy"
            @click="firebase.auth.logout()"
          >
            Logout
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center ga-2">
        <div style="min-width: 100px">List:</div>
        <div class="flex-grow-1 border">
          <v-table>
            <thead>
              <tr>
                <th>Email</th>
              </tr>
            </thead>
          </v-table>
        </div>
        <div style="min-width: 150px; max-width: 150px">
          <v-btn
            block
            :loading="firebase.userList.busy"
            @click="firebase.userList.submit()"
          >
            List
          </v-btn>
        </div>
      </div>

      <pre>firebase.authLogin: {{ firebase.authLogin }}</pre>
    </div>
  </nuxt-layout>
</template>

<script setup>
import useFirebase from "@/composables/useFirebase";
const firebase = useFirebase();
</script>

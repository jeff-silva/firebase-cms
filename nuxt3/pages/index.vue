<template>
  <div>
    <v-btn>Aaa</v-btn>

    <v-file-input
      label="File input"
      :loading="
        firebase.storageUpload.busy
      "
      @change="
        async (ev) => {
          if (!ev.target.files[0])
            return;
          await firebase.storageUpload.submit(
            ev.target.files[0]
          );
          ev.target.value = '';
        }
      "
    />

    <v-row>
      <template
        v-for="o in firebase
          .storageUpload.lastUploads"
      >
        <v-col cols="4">
          <img
            :src="o.url"
            alt=""
            style="width: 100%"
          />
        </v-col>
      </template>
    </v-row>
    <pre>firebase: {{ firebase }}</pre>
  </div>
</template>

<script setup>
// import useApp from "@/composables/useApp";
// const app = useApp();

import useFirebase from "@/composables/useFirebase";
const firebase = useFirebase();
</script>

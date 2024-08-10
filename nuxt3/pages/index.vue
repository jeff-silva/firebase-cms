<template>
  <div>
    <v-btn
      @click="
        firebase.storageList.submit()
      "
      :loading="
        firebase.storageList.busy
      "
      >Storage List</v-btn
    >

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
          firebase.storageList.submit();
        }
      "
    />

    <v-table class="border ma-4">
      <tbody>
        <template
          v-for="o in firebase
            .storageList.data"
        >
          <tr>
            <td>{{ o.name }}</td>
          </tr>
        </template>
        <tr
          v-if="
            firebase.storageList
              .nextPageToken
          "
        >
          <td>
            <v-btn
              :loading="
                firebase.storageList
                  .busy
              "
              @click="
                firebase.storageList.loadMore()
              "
              >Load more</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>

    <pre>firebase: {{ firebase }}</pre>
  </div>
</template>

<script setup>
// import useApp from "@/composables/useApp";
// const app = useApp();

import useFirebase from "@/composables/useFirebase";
const firebase = useFirebase();
</script>

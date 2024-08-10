<template>
  <div>
    <v-btn
      @click="
        firebase.storageList.submit({
          firstPage: true,
        })
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
      <colgroup>
        <col width="150px" />
        <col width="*" />
      </colgroup>
      <tbody>
        <template
          v-for="o in firebase
            .storageList.data"
        >
          <tr>
            <td class="pa-0">
              <img
                :src="o.url"
                alt=""
                style="
                  width: 100%;
                  height: 50px;
                  margin: 0 0 -6px 0;
                  object-fit: cover;
                "
              />
            </td>
            <td>{{ o.name }}</td>
          </tr>
        </template>
        <tr
          v-if="
            firebase.storageList.params
              .pageToken
          "
        >
          <td colspan="2">
            <v-btn
              :loading="
                firebase.storageList
                  .busy
              "
              @click="
                firebase.storageList.submit()
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

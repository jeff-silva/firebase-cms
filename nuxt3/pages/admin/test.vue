<template>
  <nuxt-layout name="admin">
    <div>Crud Test</div>
    <v-btn
      text="Save"
      :loading="testSave.busy"
      @click="
        async () => {
          await testSave.submit();
          await testList.submit();
        }
      "
    />
    <v-btn
      text="List"
      :loading="testList.busy"
      @click="
        async () => {
          testList.params.startAfter = null;
          await testList.submit();
        }
      "
    />

    <br /><br />
    <v-table class="border">
      <colgroup>
        <col width="50px" />
        <col width="*" />
        <col width="100px" />
      </colgroup>
      <tbody>
        <tr>
          <td
            class="pa-0"
            colspan="2"
          >
            <v-text-field
              v-model="testSave.data.name"
              :hide-details="true"
              :disabled="testSave.busy"
            />
          </td>
          <td class="py-0">
            <v-btn
              text="Save"
              block
              color="primary"
              :loading="testSave.busy"
              @click="
                async () => {
                  await testSave.submit();
                  testSave.dataClear();
                  await testList.submit();
                }
              "
            />
          </td>
        </tr>
        <template v-for="o in testList.data">
          <tr>
            <td>{{ o.id }}</td>
            <td>{{ o.name }}</td>
            <td class="py-0">
              <v-btn
                text="Edit"
                block
                color="primary"
                @click="testSave.data = { ...o }"
              />
            </td>
          </tr>
        </template>

        <template v-if="testList.startAfter">
          <td
            class="text-center py-2"
            colspan="3"
          >
            <v-btn
              text="Load more"
              @click="
                () => {
                  testList.params.startAfter = testList.startAfter;
                  testList.submit();
                }
              "
            />
          </td>
        </template>
      </tbody>
    </v-table>

    <pre>testSave: {{ testSave }}</pre>
    <pre>testList: {{ testList }}</pre>
  </nuxt-layout>
</template>

<script setup>
import useFirebase from "@/composables/useFirebase";
const firebase = useFirebase();

const testSave = firebase.firestoreSave({
  collection: "test",
  data: {
    // name: "Test " + Math.round(Math.random() * 9999),
  },
});

const testList = firebase.firestoreList({
  collection: "test",
});

testList.submit();
</script>

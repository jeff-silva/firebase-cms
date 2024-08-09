import { reactive } from "vue";
import { defineStore } from "pinia";

export default () => {
  const r = defineStore("app", () => {
    return reactive({
      firebase: {
        ok: false,
        test() {
          console.log("aaa");
        },
      },
    });
  })();

  r.firebase.test();

  return r;
};

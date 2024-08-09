import { reactive } from "vue";

export default () => {
  const r = reactive({
    firebase: {
      ok: false,
      test() {
        console.log("aaa");
      },
    },
  });

  r.firebase.test();

  return r;
};

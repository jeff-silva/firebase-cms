import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { reactive } from "vue";

export default () => {
  const r = reactive({
    auth: {},
    storage: {},
    database: {},
  });

  return r;
};

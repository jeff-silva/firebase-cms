import * as fireStorage from "firebase/storage";
import { reactive } from "vue";

export default () => {
  let r = {};

  r.storageUpload = reactive({
    busy: false,
    lastUploads: [],
    async submit(file) {
      r.storageUpload.busy = true;
      const snapshot = await fireStorage.uploadBytes(
        fireStorage.ref(fireStorage.getStorage(), file.name),
        file
      );
      const uploadData = {
        url: await fireStorage.getDownloadURL(snapshot.ref),
        mime: snapshot.metadata.contentType,
        size: snapshot.metadata.size,
      };
      r.storageUpload.lastUploads.push(uploadData);
      r.storageUpload.busy = false;
      return uploadData;
    },
  });

  return r;
};

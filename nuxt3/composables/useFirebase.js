import * as fireStorage from "firebase/storage";
import { reactive } from "vue";

export default () => {
  let r = {};

  // Storage file minimal data
  const storeUploadData = async (snapshotRef) => {
    const metadata = await fireStorage.getMetadata(snapshotRef);
    return {
      url: await fireStorage.getDownloadURL(snapshotRef),
      name: metadata.name,
      mime: metadata.contentType,
      size: metadata.size,
    };
  };

  // Storage upload
  r.storageUpload = reactive({
    busy: false,
    lastUploads: [],
    async submit(file) {
      r.storageUpload.busy = true;

      const storage = fireStorage.getStorage();
      const snapshot = await fireStorage.uploadBytes(
        fireStorage.ref(storage, file.name),
        file
      );

      const uploadData = await storeUploadData(snapshot.ref);
      r.storageUpload.lastUploads.push(uploadData);
      r.storageUpload.busy = false;

      return uploadData;
    },
  });

  // Storage files list
  r.storageList = reactive({
    busy: false,
    data: [],
    async submit() {
      r.storageList.busy = true;
      const storage = fireStorage.getStorage();
      const listRef = fireStorage.ref(storage);
      const resp = await fireStorage.listAll(listRef);

      r.storageList.data = await Promise.all(
        resp.items.map(async (snapshotRef) => {
          return await storeUploadData(snapshotRef);
        })
      );

      r.storageList.busy = false;
    },
  });

  return r;
};

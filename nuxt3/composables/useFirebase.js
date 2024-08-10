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
    nextPageToken: false,
    params: { maxResults: 2 },
    data: [],
    async submit() {
      r.storageList.busy = true;
      const storage = fireStorage.getStorage();
      const listRef = fireStorage.ref(storage);

      const firstPage = await fireStorage.list(listRef, r.storageList.params);

      r.storageList.data = await Promise.all(
        firstPage.items.map(async (snapshotRef) => {
          return await storeUploadData(snapshotRef);
        })
      );

      r.storageList.nextPageToken = firstPage.nextPageToken;
      r.storageList.busy = false;
    },

    async loadMore() {
      if (!r.storageList.nextPageToken) return;
      const storage = fireStorage.getStorage();
      const listRef = fireStorage.ref(storage);
      r.storageList.busy = true;

      const nextPage = await fireStorage.list(listRef, {
        ...r.storageList.params,
        pageToken: r.storageList.nextPageToken,
      });

      await Promise.all(
        nextPage.items.map(async (snapshotRef) => {
          r.storageList.data.push(await storeUploadData(snapshotRef));
        })
      );

      r.storageList.nextPageToken = nextPage.nextPageToken || false;
      r.storageList.busy = false;
    },
  });

  return r;
};

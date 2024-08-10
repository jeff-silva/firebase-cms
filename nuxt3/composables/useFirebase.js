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
    params: { maxResults: 50 },
    pages: 0,
    data: [],
    async submit(options = {}) {
      options = {
        firstPage: false,
        ...options,
      };

      if (
        !options.firstPage &&
        r.storageList.pages > 0 &&
        !r.storageList.params.pageToken
      )
        return;

      r.storageList.busy = true;
      const storage = fireStorage.getStorage();
      const listRef = fireStorage.ref(storage);

      if (options.firstPage) {
        r.storageList.pages = 0;
        r.storageList.params.pageToken = null;
        r.storageList.data = [];
      }

      const list = await fireStorage.list(listRef, r.storageList.params);

      await Promise.all(
        list.items.map(async (snapshotRef) => {
          r.storageList.data.push(await storeUploadData(snapshotRef));
        })
      );

      if (list.nextPageToken) r.storageList.pages++;
      r.storageList.params.pageToken = list.nextPageToken || false;
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

import * as fireStorage from "firebase/storage";
import * as fireAuth from "firebase/auth";
import { reactive } from "vue";

export default () => {
  let r = {};

  // Auth currento logged user
  r.auth = reactive({
    busy: false,
    ready: false,
    user: false,
    init() {
      if (r.auth.ready) return;
      const auth = fireAuth.getAuth();
      fireAuth.onAuthStateChanged(auth, (user) => {
        if (!user) return;
        r.auth.ready = true;
        user.displayName = user.displayName || user.email;
        user.photoURL =
          user.photoURL ||
          `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${btoa(
            user.email
          )}`;
        r.auth.user = user;
        // user.displayName, user.photoURL
      });
    },
    async logout() {},
  });

  r.auth.init();

  // Auth create
  r.authCreate = reactive({
    busy: false,
    data: {
      email: "",
      password: "",
    },
    error: false,
    async submit() {
      r.authCreate.busy = true;
      try {
        const auth = fireAuth.getAuth();
        const user = await fireAuth.createUserWithEmailAndPassword(
          auth,
          r.authCreate.data.email,
          r.authCreate.data.password
        );
        r.authCreate.data.email = "";
        r.authCreate.data.password = "";
        console.log(user);
      } catch (err) {
        r.authCreate.error = err;
      }
      r.authCreate.busy = false;
    },
  });

  // Auth login
  r.authLogin = reactive({
    busy: false,
    data: {
      email: "",
      password: "",
    },
    error: false,
    async submit() {
      r.authLogin.busy = true;

      try {
        const auth = fireAuth.getAuth();
        const user = await fireAuth.signInWithEmailAndPassword(
          auth,
          r.authLogin.data.email,
          r.authLogin.data.password
        );
        r.authLogin.data.email = "";
        r.authLogin.data.password = "";
      } catch (err) {
        r.authLogin.error = err;
      }

      r.authLogin.busy = false;
    },
  });

  // List users
  r.authList = reactive({
    busy: false,
    params: {},
    error: false,
    async submit() {
      r.authList.busy = true;
      // try {
      //   const auth = fireAuth.getAuth();
      //   const user = await fireAuth.createUserWithEmailAndPassword(
      //     auth,
      //     r.authList.data.email,
      //     r.authList.data.password
      //   );
      //   console.log(user);
      // } catch (err) {
      //   r.authList.error = err;
      // }
      r.authList.busy = false;
    },
  });

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

  r.firestoreSave = reactive({});
  r.firestoreList = reactive({});
  r.firestoreDelete = reactive({});

  r.databaseSave = reactive({});
  r.databaseList = reactive({});
  r.databaseDelete = reactive({});

  return r;
};

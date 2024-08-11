import * as fireAuth from "firebase/auth";
import * as fireStorage from "firebase/storage";
import * as fireFirestore from "firebase/firestore";

import { reactive } from "vue";
import { useFirestore } from "vuefire";

import dayjs from "dayjs";

export default () => {
  let r = {};

  // Auth currento logged user
  r.auth = reactive({
    busy: false,
    ready: false,
    user: null,
    error: null,
    init() {
      if (r.auth.ready) return;
      const auth = fireAuth.getAuth();
      fireAuth.onAuthStateChanged(auth, (user) => {
        if (!user) return;
        r.auth.ready = true;
        user.displayName = user.displayName || user.email;
        user.photoURL =
          user.photoURL ||
          `https://api.dicebear.com/9.x/big-smile/svg?seed=${btoa(user.email)}`;
        r.auth.user = user;
      });
    },
    async logout() {
      r.auth.busy = true;
      try {
        const auth = fireAuth.getAuth();
        await fireAuth.signOut(auth);
        r.auth.user = null;
      } catch (err) {
        r.auth.error = err.message;
      }
      r.auth.busy = false;
    },
  });

  r.auth.init();

  // Auth create
  r.authCreate = reactive({
    busy: false,
    data: {
      email: "",
      password: "",
    },
    error: null,
    async submit() {
      r.authCreate.error = null;
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
      } catch (err) {
        r.authCreate.error = err.message;
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
    error: null,
    async submit() {
      r.authLogin.error = null;
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
        r.authLogin.error = err.message;
      }

      r.authLogin.busy = false;
    },
  });

  // List users
  r.userList = reactive({
    busy: false,
    params: { perPage: 50, nextPage: null },
    error: null,
    async submit() {
      r.userList.busy = true;

      const auth = fireAuth.getAuth();
      const list = await auth.listUsers(
        r.userList.perPage,
        r.userList.nextPage
      );
      console.log(list);

      // try {
      //   const auth = fireAuth.getAuth();
      //   const user = await fireAuth.createUserWithEmailAndPassword(
      //     auth,
      //     r.userList.data.email,
      //     r.userList.data.password
      //   );
      //   console.log(user);
      // } catch (err) {
      //   r.userList.error = err.message;
      // }
      r.userList.busy = false;
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

  r.firestoreSave = (options = {}) => {
    options = {
      collection: null,
      data: {},
      ...options,
    };

    const r = reactive({
      busy: false,
      collection: options.collection,
      data: options.data,
      error: null,
      submit() {
        return new Promise(async (resolve, reject) => {
          r.busy = true;

          try {
            const db = useFirestore();
            const collection = fireFirestore.collection(db, options.collection);

            if (r.data.id) {
              const docRef = await fireFirestore.doc(
                db,
                options.collection,
                r.data.id
              );
              r.data.updatedAt = dayjs().format();
              const dataRef = await fireFirestore.updateDoc(docRef, r.data);
              resolve(dataRef);
            } else {
              r.data.createdAt = r.data.updatedAt = dayjs().format();
              const dataRef = await fireFirestore.addDoc(collection, r.data);
              r.data.id = dataRef.id;
              resolve(dataRef);
              r.submit();
            }
          } catch (err) {
            reject((r.error = err.message));
          }

          r.busy = false;
        });
      },
      dataClear() {
        r.data = {};
        console.log("aaaa");
      },
    });

    return r;
  };

  r.firestoreList = (options = {}) => {
    options = {
      collection: null,
      params: { limit: 5, startAfter: null },
      ...options,
    };

    const r = reactive({
      busy: false,
      collection: options.collection,
      startAfter: null,
      params: options.params,
      data: [],
      error: null,
      submit() {
        return new Promise(async (resolve, reject) => {
          r.busy = true;

          setTimeout(async () => {
            try {
              const db = useFirestore();
              const collection = fireFirestore.collection(
                db,
                options.collection
              );

              let queryParams = [
                collection,
                fireFirestore.orderBy("updatedAt", "desc"),
                fireFirestore.limit(r.params.limit),
              ];

              if (r.params.startAfter) {
                queryParams.push(fireFirestore.startAfter(r.params.startAfter));
              }

              const first = fireFirestore.query.apply(null, queryParams);
              const docsRef = await fireFirestore.getDocs(first);

              const startAfter = docsRef.docs[docsRef.docs.length - 1] || null;
              r.startAfter = startAfter ? startAfter.id : null;

              const docsRefData = docsRef.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              if (r.params.startAfter) {
                docsRefData.map((docsRefDataItem) => {
                  r.data.push(docsRefDataItem);
                });
              } else {
                r.data = docsRefData;
              }
            } catch (err) {
              reject((r.error = err.message));
            }

            r.busy = false;
          }, 100);
        });
      },
    });

    return r;
  };

  r.firestoreDelete = reactive({});

  r.databaseSave = reactive({});
  r.databaseList = reactive({});
  r.databaseDelete = reactive({});

  return r;
};

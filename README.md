# firebase-cms

Firebase CMS

## Storage

### Permissions

Go to `Firebase Console > Project > Storage > Rules` and set the Rules like this:

```text
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
      allow delete: if false;
    }
  }
}
```

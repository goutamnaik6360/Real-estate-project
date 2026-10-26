# Estate-Sync

Estate-Sync is a React web app using Firebase Authentication and Cloud Firestore. Agent sign-up stores profile details only; document uploads are turned off so this demo does not need Firebase Storage or a billing account.

## Connect a Firebase project

1. Create a Firebase project and register a **Web app** in the Firebase Console.
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a **Cloud Firestore** database.
4. Copy the Web app configuration into a new `.env.local` file in this folder, using `.env.example` as the template.
5. Publish `firestore.rules` from the Firebase Console, or deploy it with the Firebase CLI. `firebase.json` points to the rules file.
6. To use the admin dashboard, create a user account first, then set that user's `profiles/{uid}` document field `role` to `admin` in Firestore. Public registration cannot create admin accounts.

Keep `.env.local` private and never add service-account credentials to this browser app. The Firebase web app configuration is intended for client apps; Firestore rules protect the data.

## Run locally

Install dependencies with `npm install`, then start the app using `npm run dev`. Without Firebase settings in `.env.local`, public pages load, but sign-in, registration, and data features show a configuration error.
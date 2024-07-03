# App information
I undertook this project of react, typescript and vite to enhance my knowledge on this technologies.

Throughout the tutorial I learnt a lot from interacting with different libraries provided by Appwrite to using ReactQuery and mutators. 

I would recommend this tutorial to anyone looking to elevate their experience with these technologies.

## Features to build on
1. Adding profile with settings modification.
2. Adding ability to follow/unfollow other users.
3. HashTag following to show more "relevant" results.
4. Saved post view for users.
5. View of all followed / following users on profile and menu items.
6. Implement additional animiation.

In time, I will add to this now with the capabilities I have learnt. 

For production, having an LLM make post description in the style of the user / prebuilt styles would be nice! 

Onwards and upwards!

### Tutorial: https://www.youtube.com/watch?v=_W3R2VwRyF4&ab_channel=JavaScriptMastery

## Usage
1. Clone repo.
2. npm install.
3. Setup environment variable file .env.local

```js
Will need the following:
VITE_APPWRITE_PROJECT_ID = ''
VITE_APPWRITE_URL = 'https://cloud.appwrite.io/v1'
VITE_APPWRITE_STORAGE_ID = ''
VITE_APPWRITE_DATABASE_ID = ''
VITE_APPWRITE_SAVES_COLLECTION_ID = ''
VITE_APPWRITE_POSTS_COLLECTION_ID = ''
VITE_APPWRITE_USERS_COLLECTION_ID = ''
```
4. Under src folder, have a file called vite-env.d.ts. Add 

``` /// <reference types = "vite/client" /> ```

This is required to inform of vite local env.

5. ensure you have setup an appwrite cloud account with storage bucket, database and auth!

Enjoy!

Credit to: https://github.com/adrianhajdin/social_media_app

# Tutorial of React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

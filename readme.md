# ids_api

This is a simple node api for ids of wisedu.

Recommend to use the lib with typescript, you can get type annotation and code auto completion and many other cool benefits.

## How to use it.

1. npm i -S ids_api
2. set `BASE_URL`, `APP_ID` and `APP_SECRET` environments or you can create `.env` file which contains these envs.
3. import the lib via `const { getAttributes, saveUser, updateAttributes, updatePassword, updateManagerPassword, addUserToGroup, removeUserOfGroup, sendMessage, setBindingUserDefault, setUidSwitchDefault } = require('ids_api')` (for CommonJS) or `import { getAttributes, saveUser, updateAttributes, updatePassword, updateManagerPassword, addUserToGroup, removeUserOfGroup, sendMessage, setBindingUserDefault, setUidSwitchDefault } from 'ids_api'` (for ESM);
4. use the imported api as you need.

## Todos

1. [x] finish initial code.
2. [x] add unit tests
3. [x] add docs

## License

MIT License

Copyright (c) 2023 liudonghua
## references

1. https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html
2. https://khalilstemmler.com/blogs/typescript/node-starter-project/
3. https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
4. https://mikbry.com/blog/javascript/npm/best-practices-npm-package
5. https://mochajs.org/#-require-module-r-module
6. https://axios-http.com/docs/urlencoded#automatic-serialization
7. https://jestjs.io/docs/getting-started
8. https://testing-library.com/docs/
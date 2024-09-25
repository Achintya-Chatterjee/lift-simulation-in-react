# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

```
lift-simulation-in-react
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ config
│  ├─ description
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ 04
│  │  │  └─ 20281b9bc4047f7bb554a50ba4547924ed0240
│  │  ├─ 09
│  │  │  └─ 2408a9f09eae19150818b4f0db5d1b70744828
│  │  ├─ 0b
│  │  │  └─ 0fdc7c12837ffe00700ab1ab64ff213ae45fab
│  │  ├─ 0d
│  │  │  └─ 3d71446a455c5f997e3cffb25099dab0f74a9b
│  │  ├─ 11
│  │  │  └─ f02fe2a0061d6e6e1f271b21da95423b448b32
│  │  ├─ 1d
│  │  │  └─ c8d1c79a6176a1dc1b791b4feccd6210a3757a
│  │  ├─ 1f
│  │  │  └─ fef600d959ec9e396d5a260bd3f5b927b2cef8
│  │  ├─ 23
│  │  │  └─ 75989f8f2b29a621269d38f2a46a9ddf084181
│  │  ├─ 2e
│  │  │  └─ 7af2b7f1a6f391da1631d93968a9d487ba977d
│  │  ├─ 30
│  │  │  └─ f359e3bb33f274bc435068316c8b0e2a67df50
│  │  ├─ 4d
│  │  │  └─ 27767fc1d5cf1d99cd8d6be861b8b9e4de6f50
│  │  ├─ 4e
│  │  │  └─ 4ea1bca33f648d27e62a6323dc3f69d6b96416
│  │  ├─ 55
│  │  │  └─ 7b37c44d5cb352ff331f90e7fba0189cdfa65e
│  │  ├─ 5a
│  │  │  └─ 33944a9b41b59a9cf06ee4bb5586c77510f06b
│  │  ├─ 5d
│  │  │  └─ 1cf3e20844aec60851faabd9f14a28ad222d43
│  │  ├─ 66
│  │  │  └─ ddb4276af4303085e4a6493d45e3f3ce4c8050
│  │  ├─ 6c
│  │  │  └─ 87de9bb3358469122cc991d5cf578927246184
│  │  ├─ 6f
│  │  │  └─ 4ac9bcca823100838b88e0b570a28d2fbde6b1
│  │  ├─ 74
│  │  │  └─ 872fd4af60fb8d6cdb7d27e6c587ee0b6e1df7
│  │  ├─ 78
│  │  │  └─ 88564c3ba949d74a78c46fc6515f70c06c1a0c
│  │  ├─ 94
│  │  │  └─ c0b2fc152a086447a04f62793957235d2475be
│  │  ├─ a5
│  │  │  └─ 47bf36d8d11a4f89c59c144f24795749086dd1
│  │  ├─ a6
│  │  │  └─ 3777cf855a03e586e2b5bd8f98f12ed4d4ff07
│  │  ├─ b9
│  │  │  └─ d355df2a5956b526c004531b7b0ffe412461e0
│  │  ├─ bd
│  │  │  └─ 6213e1dfe6b0a79ce7d8b37d0d2dc70f0250bb
│  │  ├─ d7
│  │  │  └─ e9f7ff539e10fce7751b85f8300a5d969e7e03
│  │  ├─ e4
│  │  │  └─ b78eae12304a075fa19675c4047061d6ab920d
│  │  ├─ e6
│  │  │  └─ 465bf89def57d07e9fd7ecd73a19762855b8c5
│  │  ├─ e7
│  │  │  └─ b8dfb1b2a60bd50538bec9f876511b9cac21e3
│  │  ├─ f0
│  │  │  └─ a235055d24607ba5e0bedc494ffc35b5956fbb
│  │  ├─ f1
│  │  │  └─ dbe4ba1693e37405876cf55e0e6ca3cde217ea
│  │  ├─ info
│  │  └─ pack
│  └─ refs
│     ├─ heads
│     │  ├─ feature
│     │  │  └─ user-input-page
│     │  ├─ main
│     │  └─ test
│     │     └─ user-input-page
│     ├─ remotes
│     │  └─ origin
│     │     ├─ feature
│     │     │  └─ user-input-page
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ README.md
├─ eslint.config.js
├─ index.html
├─ jest.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ lifts.jpg
├─ setupTests.js
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ __tests__
│  │  └─ App.test.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
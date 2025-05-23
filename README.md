# [Resolve] ⛵

[![npm](https://img.shields.io/npm/v/@playform/resolve?style=flat-square)](https://www.npmjs.com/package/@playform/resolve)

If you use Typescript's
[`path mapping`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
feature to avoid `../../../../../` in your imports, you may have found that
compiling with `tsc` doesn't convert your aliases to proper relative paths. This
causes problems as the compiled JavaScript code can't actually run with those
path aliases - you'll get a "module not found" error. If your project exports
type definitions, your `.d.ts` files will also be broken if they are shipped
with path aliases.

Use this package after `tsc` builds your code to replace any path aliases with
relative paths - this means that you can develop using path aliases whilst still
being able to ship working JavaScript code.

**Sample `tsconfig.json`:**

```ts
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  },
}
```

The following types of paths are currently supported:

**CommonJS imports**

```ts
const { ... } = require("~/some/path");
```

**ESM imports**

```ts
import * as stuff from "~/some/path";
import stuff from "~/some/path";
import { stuff } from "~/some/path.js";
import { stuff as myStuff } from "~/some/path.mjs";
import data from "~/some/data/path.json";
```

_NOTE: When importing JSON files, ensure that you use the `.json` extension. See
issue [`#253`](https://GitHub.Com/PlayForm/Resolve/issues/253)._

**ESM dynamic imports**

```ts
const stuff = await import("~/some/path");
```

**ESM exports**

```ts
export * from "~/some/path";
export * as stuff from "~/some/path";
export { stuff } from "~/some/path.js";
export { stuff as myStuff } from "~/some/path.mjs";
```

**Node.JS
[`require.resolve`](https://nodejs.org/api/modules.html#requireresolverequest-options)**

```ts
const path = require.resolve("~/some/path");
```

## CLI Usage

1. Install as a dev dependency using npm or yarn, along with
   [`Typescript`](https://www.npmjs.com/package/typescript) 3.x or later.

    ```sh
    yarn add -D @playform/resolve typescript
    ```

    ```sh
    npm install --save-dev @playform/resolve typescript
    ```

2. Add it as a part of your build script in `package.json` after `tsc`.

    ```json
    {
    	"scripts": {
    		"build": "tsc && Resolve"
    	}
    }
    ```

## Programmatic Usage

1. Install as a dev dependency using npm or yarn, along with
   [`Typescript`](https://www.npmjs.com/package/typescript) 3.x or later.

    ```sh
    yarn add -D @playform/resolve typescript
    ```

    ```sh
    npm install --save-dev @playform/resolve typescript
    ```

2. Import the `resolveTsPaths` function and call it with the appropriate
   options.

    ```ts
    import { resolveTsPaths } from "@playform/resolve";
    ```

## Options

_`@playform/resolve` uses some reasonable defaults. For most cases, you probably
won't need to specify any options._

#### `--project <path>, -p <path>`

Specify the path to the tsconfig file that the program should use. Defaults to
"tsconfig.json" if not provided.

#### `--src <path>, -s <path>`

Specify the source directory. Defaults to `compilerOptions.rootDir` from your
tsconfig if not provided. If `rootDir` is not defined in your tsconfig, it will
default to "src".

#### `--out <path>, -o <path>`

Specify the output directory of the compiled code where `@playform/resolve`
should perform its changes. Defaults to `compilerOptions.outDir` from your
tsconfig if not provided.

#### `--ext <extension...>`

Provide a space-delimited list of file extensions in the output directory that
the program should process. Defaults to the following extensions:

- `js`
- `mjs`
- `cjs`
- `d.ts`
- `d.mts`
- `d.cts`

#### `--verbose`

Use this flag to print verbose logs to the console.

_This option is only available when using the CLI._

#### `--noEmit`

Use this flag to not emit any changes to your files. Recommended to be used with
`--verbose` for debugging which files the program will change if you don't use
`--noEmit`.

_This option is only available when using the CLI._

[Resolve]: https://NPMJS.Org/@playform/resolve

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a history of changes to this component.

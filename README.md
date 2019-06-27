# ManualHTML

A web manual generator for command-line programs.
Accepts JSON adhering to the [argspec](https://github.com/emperor-lang/argspec) schema.

## Usage

```
manualhtml doc.json
```

Outputs manual to man/doc.html

## Compiling

Reqires Node v10+

```
npm install
npm run build
```

Builds OS specific version to dist/
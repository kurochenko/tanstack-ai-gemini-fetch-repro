# `@tanstack/ai-gemini` ignores `httpOptions.fetch`

Run `npm start`.

- With `@tanstack/ai-gemini` 1.2.0 the script prints `"customFetchCalls":0` and a `global fetch called` error.
- Change the version in `package.json` to `1.1.0`, run `npm install`, then run `npm start` again. The script prints `{"text":"hi","customFetchCalls":1}`.

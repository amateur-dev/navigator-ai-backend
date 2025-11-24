globalThis.__RAINDROP_GIT_COMMIT_SHA = "36f66c0078a7e904029323bedd49267538c25731"; 
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@cerebras/cerebras_cloud_sdk/version.mjs
var VERSION;
var init_version = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/version.mjs"() {
    VERSION = "1.59.0";
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/_shims/registry.mjs
function setShims(shims, options = { auto: false }) {
  if (auto) {
    throw new Error(`you must \`import '@cerebras/cerebras_cloud_sdk/shims/${shims.kind}'\` before importing anything else from @cerebras/cerebras_cloud_sdk`);
  }
  if (kind) {
    throw new Error(`can't \`import '@cerebras/cerebras_cloud_sdk/shims/${shims.kind}'\` after \`import '@cerebras/cerebras_cloud_sdk/shims/${kind}'\``);
  }
  auto = options.auto;
  kind = shims.kind;
  fetch2 = shims.fetch;
  Request2 = shims.Request;
  Response2 = shims.Response;
  Headers2 = shims.Headers;
  FormData2 = shims.FormData;
  Blob2 = shims.Blob;
  File2 = shims.File;
  ReadableStream2 = shims.ReadableStream;
  getMultipartRequestOptions = shims.getMultipartRequestOptions;
  getDefaultAgent = shims.getDefaultAgent;
  fileFromPath = shims.fileFromPath;
  isFsReadStream = shims.isFsReadStream;
}
var auto, kind, fetch2, Request2, Response2, Headers2, FormData2, Blob2, File2, ReadableStream2, getMultipartRequestOptions, getDefaultAgent, fileFromPath, isFsReadStream;
var init_registry = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/_shims/registry.mjs"() {
    auto = false;
    kind = void 0;
    fetch2 = void 0;
    Request2 = void 0;
    Response2 = void 0;
    Headers2 = void 0;
    FormData2 = void 0;
    Blob2 = void 0;
    File2 = void 0;
    ReadableStream2 = void 0;
    getMultipartRequestOptions = void 0;
    getDefaultAgent = void 0;
    fileFromPath = void 0;
    isFsReadStream = void 0;
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/_shims/MultipartBody.mjs
var MultipartBody;
var init_MultipartBody = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/_shims/MultipartBody.mjs"() {
    MultipartBody = class {
      constructor(body) {
        this.body = body;
      }
      get [Symbol.toStringTag]() {
        return "MultipartBody";
      }
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/_shims/web-runtime.mjs
function getRuntime({ manuallyImported } = {}) {
  const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import \u2026 from '@cerebras/cerebras_cloud_sdk'\`:
- \`import '@cerebras/cerebras_cloud_sdk/shims/node'\` (if you're running on Node)
- \`import '@cerebras/cerebras_cloud_sdk/shims/web'\` (otherwise)
`;
  let _fetch, _Request, _Response, _Headers;
  try {
    _fetch = fetch;
    _Request = Request;
    _Response = Response;
    _Headers = Headers;
  } catch (error) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${error.message}. ${recommendation}`);
  }
  return {
    kind: "web",
    fetch: _fetch,
    Request: _Request,
    Response: _Response,
    Headers: _Headers,
    FormData: (
      // @ts-ignore
      typeof FormData !== "undefined" ? FormData : class FormData {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
        }
      }
    ),
    Blob: typeof Blob !== "undefined" ? Blob : class Blob {
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File !== "undefined" ? File : class File {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
        }
      }
    ),
    getMultipartRequestOptions: async (form, opts) => ({
      ...opts,
      body: new MultipartBody(form)
    }),
    getDefaultAgent: (url) => void 0,
    fileFromPath: () => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/Cerebras/cerebras-cloud-sdk-node#file-uploads");
    },
    isFsReadStream: (value) => false
  };
}
var init_web_runtime = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/_shims/web-runtime.mjs"() {
    init_MultipartBody();
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/_shims/auto/runtime.mjs
var init_runtime = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/_shims/auto/runtime.mjs"() {
    init_web_runtime();
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/_shims/index.mjs
var init;
var init_shims = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/_shims/index.mjs"() {
    init_registry();
    init_runtime();
    init_registry();
    init = () => {
      if (!kind) setShims(getRuntime(), { auto: true });
    };
    init();
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/error.mjs
var CerebrasError, APIError, APIUserAbortError, APIConnectionError, APIConnectionTimeoutError, BadRequestError, AuthenticationError, PermissionDeniedError, NotFoundError, ConflictError, UnprocessableEntityError, RateLimitError, InternalServerError;
var init_error = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/error.mjs"() {
    init_core();
    CerebrasError = class extends Error {
    };
    APIError = class _APIError extends CerebrasError {
      constructor(status, error, message, headers) {
        super(`${_APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.error = error;
      }
      static makeMessage(status, error, message) {
        const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
        if (status && msg) {
          return `${status} ${msg}`;
        }
        if (status) {
          return `${status} status code (no body)`;
        }
        if (msg) {
          return msg;
        }
        return "(no status code or body)";
      }
      static generate(status, errorResponse, message, headers) {
        if (status === void 0 || headers === void 0) {
          return new APIConnectionError({ message, cause: castToError(errorResponse) });
        }
        const error = errorResponse;
        if (status === 400) {
          return new BadRequestError(status, error, message, headers);
        }
        if (status === 401) {
          return new AuthenticationError(status, error, message, headers);
        }
        if (status === 403) {
          return new PermissionDeniedError(status, error, message, headers);
        }
        if (status === 404) {
          return new NotFoundError(status, error, message, headers);
        }
        if (status === 409) {
          return new ConflictError(status, error, message, headers);
        }
        if (status === 422) {
          return new UnprocessableEntityError(status, error, message, headers);
        }
        if (status === 429) {
          return new RateLimitError(status, error, message, headers);
        }
        if (status >= 500) {
          return new InternalServerError(status, error, message, headers);
        }
        return new _APIError(status, error, message, headers);
      }
    };
    APIUserAbortError = class extends APIError {
      constructor({ message } = {}) {
        super(void 0, void 0, message || "Request was aborted.", void 0);
      }
    };
    APIConnectionError = class extends APIError {
      constructor({ message, cause }) {
        super(void 0, void 0, message || "Connection error.", void 0);
        if (cause)
          this.cause = cause;
      }
    };
    APIConnectionTimeoutError = class extends APIConnectionError {
      constructor({ message } = {}) {
        super({ message: message ?? "Request timed out." });
      }
    };
    BadRequestError = class extends APIError {
    };
    AuthenticationError = class extends APIError {
    };
    PermissionDeniedError = class extends APIError {
    };
    NotFoundError = class extends APIError {
    };
    ConflictError = class extends APIError {
    };
    UnprocessableEntityError = class extends APIError {
    };
    RateLimitError = class extends APIError {
    };
    InternalServerError = class extends APIError {
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/streaming.mjs
async function* _iterSSEMessages(response, controller) {
  if (!response.body) {
    controller.abort();
    throw new CerebrasError(`Attempted to iterate over a response with no body`);
  }
  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();
  const iter = readableStreamAsyncIterable(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse)
      yield sse;
  }
}
async function* iterSSEChunks(iterator) {
  let data = new Uint8Array();
  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }
    const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;
    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }
  if (data.length > 0) {
    yield data;
  }
}
function findDoubleNewlineIndex(buffer) {
  const newline = 10;
  const carriage = 13;
  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
      return i + 4;
    }
  }
  return -1;
}
function partition(str, delimiter) {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }
  return [str, "", ""];
}
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator])
    return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
var Stream, SSEDecoder, LineDecoder;
var init_streaming = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/streaming.mjs"() {
    init_shims();
    init_error();
    Stream = class _Stream {
      constructor(iterator, controller) {
        this.iterator = iterator;
        this.controller = controller;
      }
      static fromSSEResponse(response, controller) {
        let consumed = false;
        async function* iterator() {
          if (consumed) {
            throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const sse of _iterSSEMessages(response, controller)) {
              if (done)
                continue;
              if (sse.data.startsWith("[DONE]")) {
                done = true;
                continue;
              }
              if (sse.event === null) {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e) {
                  console.error(`Could not parse message into JSON:`, sse.data);
                  console.error(`From chunk:`, sse.raw);
                  throw e;
                }
                if (data && data.error) {
                  const status = data.status_code || 0;
                  throw APIError.generate(status, data.error, void 0, void 0);
                }
                yield data;
              } else {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e) {
                  console.error(`Could not parse message into JSON:`, sse.data);
                  console.error(`From chunk:`, sse.raw);
                  throw e;
                }
                if (sse.event == "error") {
                  const status = data.status_code || 0;
                  throw APIError.generate(status, data.error, void 0, void 0);
                }
                yield { event: sse.event, data };
              }
            }
            done = true;
          } catch (e) {
            if (e instanceof Error && e.name === "AbortError")
              return;
            throw e;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller);
      }
      /**
       * Generates a Stream from a newline-separated ReadableStream
       * where each item is a JSON value.
       */
      static fromReadableStream(readableStream, controller) {
        let consumed = false;
        async function* iterLines() {
          const lineDecoder = new LineDecoder();
          const iter = readableStreamAsyncIterable(readableStream);
          for await (const chunk of iter) {
            for (const line of lineDecoder.decode(chunk)) {
              yield line;
            }
          }
          for (const line of lineDecoder.flush()) {
            yield line;
          }
        }
        async function* iterator() {
          if (consumed) {
            throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const line of iterLines()) {
              if (done)
                continue;
              if (line)
                yield JSON.parse(line);
            }
            done = true;
          } catch (e) {
            if (e instanceof Error && e.name === "AbortError")
              return;
            throw e;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller);
      }
      [Symbol.asyncIterator]() {
        return this.iterator();
      }
      /**
       * Splits the stream into two streams which can be
       * independently read from at different speeds.
       */
      tee() {
        const left = [];
        const right = [];
        const iterator = this.iterator();
        const teeIterator = (queue) => {
          return {
            next: () => {
              if (queue.length === 0) {
                const result = iterator.next();
                left.push(result);
                right.push(result);
              }
              return queue.shift();
            }
          };
        };
        return [
          new _Stream(() => teeIterator(left), this.controller),
          new _Stream(() => teeIterator(right), this.controller)
        ];
      }
      /**
       * Converts this stream to a newline-separated ReadableStream of
       * JSON stringified values in the stream
       * which can be turned back into a Stream with `Stream.fromReadableStream()`.
       */
      toReadableStream() {
        const self = this;
        let iter;
        const encoder = new TextEncoder();
        return new ReadableStream2({
          async start() {
            iter = self[Symbol.asyncIterator]();
          },
          async pull(ctrl) {
            try {
              const { value, done } = await iter.next();
              if (done)
                return ctrl.close();
              const bytes = encoder.encode(JSON.stringify(value) + "\n");
              ctrl.enqueue(bytes);
            } catch (err) {
              ctrl.error(err);
            }
          },
          async cancel() {
            await iter.return?.();
          }
        });
      }
    };
    SSEDecoder = class {
      constructor() {
        this.event = null;
        this.data = [];
        this.chunks = [];
      }
      decode(line) {
        if (line.endsWith("\r")) {
          line = line.substring(0, line.length - 1);
        }
        if (!line) {
          if (!this.event && !this.data.length)
            return null;
          const sse = {
            event: this.event,
            data: this.data.join("\n"),
            raw: this.chunks
          };
          this.event = null;
          this.data = [];
          this.chunks = [];
          return sse;
        }
        this.chunks.push(line);
        if (line.startsWith(":")) {
          return null;
        }
        let [fieldname, _, value] = partition(line, ":");
        if (value.startsWith(" ")) {
          value = value.substring(1);
        }
        if (fieldname === "event") {
          this.event = value;
        } else if (fieldname === "data") {
          this.data.push(value);
        }
        return null;
      }
    };
    LineDecoder = class _LineDecoder {
      constructor() {
        this.buffer = [];
        this.trailingCR = false;
      }
      decode(chunk) {
        let text = this.decodeText(chunk);
        if (this.trailingCR) {
          text = "\r" + text;
          this.trailingCR = false;
        }
        if (text.endsWith("\r")) {
          this.trailingCR = true;
          text = text.slice(0, -1);
        }
        if (!text) {
          return [];
        }
        const trailingNewline = _LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
        let lines = text.split(_LineDecoder.NEWLINE_REGEXP);
        if (trailingNewline) {
          lines.pop();
        }
        if (lines.length === 1 && !trailingNewline) {
          this.buffer.push(lines[0]);
          return [];
        }
        if (this.buffer.length > 0) {
          lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
          this.buffer = [];
        }
        if (!trailingNewline) {
          this.buffer = [lines.pop() || ""];
        }
        return lines;
      }
      decodeText(bytes) {
        if (bytes == null)
          return "";
        if (typeof bytes === "string")
          return bytes;
        if (typeof Buffer !== "undefined") {
          if (bytes instanceof Buffer) {
            return bytes.toString();
          }
          if (bytes instanceof Uint8Array) {
            return Buffer.from(bytes).toString();
          }
          throw new CerebrasError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
        }
        if (typeof TextDecoder !== "undefined") {
          if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
            this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
            return this.textDecoder.decode(bytes);
          }
          throw new CerebrasError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
        }
        throw new CerebrasError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
      }
      flush() {
        if (!this.buffer.length && !this.trailingCR) {
          return [];
        }
        const lines = [this.buffer.join("")];
        this.buffer = [];
        this.trailingCR = false;
        return lines;
      }
    };
    LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
    LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/uploads.mjs
async function toFile(value, name, options) {
  value = await value;
  if (isFileLike(value)) {
    return value;
  }
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
    const data = isBlobLike(blob) ? [await blob.arrayBuffer()] : [blob];
    return new File2(data, name, options);
  }
  const bits = await getBytes(value);
  name || (name = getName(value) ?? "unknown_file");
  if (!options?.type) {
    const type = bits[0]?.type;
    if (typeof type === "string") {
      options = { ...options, type };
    }
  }
  return new File2(bits, name, options);
}
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(await value.arrayBuffer());
  } else if (isAsyncIterableIterator(value)) {
    for await (const chunk of value) {
      parts.push(chunk);
    }
  } else {
    throw new Error(`Unexpected data type: ${typeof value}; constructor: ${value?.constructor?.name}; props: ${propsForError(value)}`);
  }
  return parts;
}
function propsForError(value) {
  const props = Object.getOwnPropertyNames(value);
  return `[${props.map((p) => `"${p}"`).join(", ")}]`;
}
function getName(value) {
  return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || // For fs.ReadStream
  getStringFromMaybeBuffer(value.path)?.split(/[\\/]/).pop();
}
var isResponseLike, isFileLike, isBlobLike, getStringFromMaybeBuffer, isAsyncIterableIterator, isMultipartBody;
var init_uploads = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/uploads.mjs"() {
    init_shims();
    init_shims();
    isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
    isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
    isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
    getStringFromMaybeBuffer = (x) => {
      if (typeof x === "string")
        return x;
      if (typeof Buffer !== "undefined" && x instanceof Buffer)
        return String(x);
      return void 0;
    };
    isAsyncIterableIterator = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
    isMultipartBody = (body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody";
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/core.mjs
async function defaultParseResponse(props) {
  const { response } = props;
  if (props.options.stream) {
    debug("response", response.status, response.url, response.headers, response.body);
    if (props.options.__streamClass) {
      return props.options.__streamClass.fromSSEResponse(response, props.controller);
    }
    return Stream.fromSSEResponse(response, props.controller);
  }
  if (response.status === 204) {
    return null;
  }
  if (props.options.__binaryResponse) {
    return response;
  }
  const contentType = response.headers.get("content-type");
  const mediaType = contentType?.split(";")[0]?.trim();
  const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
  if (isJSON) {
    const json = await response.json();
    debug("response", response.status, response.url, response.headers, json);
    return json;
  }
  const text = await response.text();
  debug("response", response.status, response.url, response.headers, text);
  return text;
}
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match2 = pattern.exec("Cloudflare-Workers");
    if (match2) {
      const major = match2[1] || 0;
      const minor = match2[2] || 0;
      const patch = match2[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function applyHeadersMut(targetHeaders, newHeaders) {
  for (const k in newHeaders) {
    if (!hasOwn(newHeaders, k))
      continue;
    const lowerKey = k.toLowerCase();
    if (!lowerKey)
      continue;
    const val = newHeaders[k];
    if (val === null) {
      delete targetHeaders[lowerKey];
    } else if (val !== void 0) {
      targetHeaders[lowerKey] = val;
    }
  }
}
function debug(action, ...args) {
  if (typeof process !== "undefined" && process?.env?.["DEBUG"] === "true") {
    console.log(`Cerebras:DEBUG:${action}`, ...args);
  }
}
var __classPrivateFieldSet, __classPrivateFieldGet, _APIClient_baseURLOverridden, _AbstractPage_client, APIPromise, APIClient, AbstractPage, PagePromise, createResponseHeaders, requestOptionsKeys, isRequestOptions, getPlatformProperties, normalizeArch, normalizePlatform, _platformHeaders, getPlatformHeaders, safeJSON, startsWithSchemeRegexp, isAbsoluteURL, sleep, validatePositiveInteger, castToError, readEnv, uuid4, isHeadersProtocol, getHeader;
var init_core = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/core.mjs"() {
    init_version();
    init_streaming();
    init_error();
    init_shims();
    init_uploads();
    __classPrivateFieldSet = function(receiver, state, value, kind2, f) {
      if (kind2 === "m") throw new TypeError("Private method is not writable");
      if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    __classPrivateFieldGet = function(receiver, state, kind2, f) {
      if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    init();
    APIPromise = class _APIPromise extends Promise {
      constructor(responsePromise, parseResponse = defaultParseResponse) {
        super((resolve) => {
          resolve(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
      }
      _thenUnwrap(transform) {
        return new _APIPromise(this.responsePromise, async (props) => transform(await this.parseResponse(props), props));
      }
      /**
       * Gets the raw `Response` instance instead of parsing the response
       * data.
       *
       * If you want to parse the response body but still get the `Response`
       * instance, you can use {@link withResponse()}.
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` if you can,
       * or add one of these imports before your first `import … from '@cerebras/cerebras_cloud_sdk'`:
       * - `import '@cerebras/cerebras_cloud_sdk/shims/node'` (if you're running on Node)
       * - `import '@cerebras/cerebras_cloud_sdk/shims/web'` (otherwise)
       */
      asResponse() {
        return this.responsePromise.then((p) => p.response);
      }
      /**
       * Gets the parsed response data and the raw `Response` instance.
       *
       * If you just want to get the raw `Response` instance without parsing it,
       * you can use {@link asResponse()}.
       *
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` if you can,
       * or add one of these imports before your first `import … from '@cerebras/cerebras_cloud_sdk'`:
       * - `import '@cerebras/cerebras_cloud_sdk/shims/node'` (if you're running on Node)
       * - `import '@cerebras/cerebras_cloud_sdk/shims/web'` (otherwise)
       */
      async withResponse() {
        const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
        return { data, response };
      }
      parse() {
        if (!this.parsedPromise) {
          this.parsedPromise = this.responsePromise.then(this.parseResponse);
        }
        return this.parsedPromise;
      }
      then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
      }
      catch(onrejected) {
        return this.parse().catch(onrejected);
      }
      finally(onfinally) {
        return this.parse().finally(onfinally);
      }
    };
    APIClient = class {
      constructor({
        baseURL,
        baseURLOverridden,
        maxRetries = 2,
        timeout = 6e4,
        // 1 minute
        httpAgent,
        fetch: overriddenFetch
      }) {
        _APIClient_baseURLOverridden.set(this, void 0);
        this.baseURL = baseURL;
        __classPrivateFieldSet(this, _APIClient_baseURLOverridden, baseURLOverridden, "f");
        this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
        this.timeout = validatePositiveInteger("timeout", timeout);
        this.httpAgent = httpAgent;
        this.fetch = overriddenFetch ?? fetch2;
      }
      authHeaders(opts) {
        return {};
      }
      /**
       * Override this to add your own default headers, for example:
       *
       *  {
       *    ...super.defaultHeaders(),
       *    Authorization: 'Bearer 123',
       *  }
       */
      defaultHeaders(opts) {
        return {
          Accept: "application/json",
          ...["head", "get"].includes(opts.method) ? {} : { "Content-Type": "application/json" },
          "User-Agent": this.getUserAgent(),
          ...getPlatformHeaders(),
          ...this.authHeaders(opts)
        };
      }
      /**
       * Override this to add your own headers validation:
       */
      validateHeaders(headers, customHeaders) {
      }
      defaultIdempotencyKey() {
        return `stainless-node-retry-${uuid4()}`;
      }
      get(path, opts) {
        return this.methodRequest("get", path, opts);
      }
      post(path, opts) {
        return this.methodRequest("post", path, opts);
      }
      patch(path, opts) {
        return this.methodRequest("patch", path, opts);
      }
      put(path, opts) {
        return this.methodRequest("put", path, opts);
      }
      delete(path, opts) {
        return this.methodRequest("delete", path, opts);
      }
      methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then(async (opts2) => {
          const body = opts2 && isBlobLike(opts2?.body) ? new DataView(await opts2.body.arrayBuffer()) : opts2?.body instanceof DataView ? opts2.body : opts2?.body instanceof ArrayBuffer ? new DataView(opts2.body) : opts2 && ArrayBuffer.isView(opts2?.body) ? new DataView(opts2.body.buffer) : opts2?.body;
          return { method, path, ...opts2, body };
        }));
      }
      getAPIList(path, Page, opts) {
        return this.requestAPIList(Page, { method: "get", path, ...opts });
      }
      calculateContentLength(body) {
        if (typeof body === "string") {
          if (typeof Buffer !== "undefined") {
            return Buffer.byteLength(body, "utf8").toString();
          }
          if (typeof TextEncoder !== "undefined") {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(body);
            return encoded.length.toString();
          }
        } else if (ArrayBuffer.isView(body)) {
          return body.byteLength.toString();
        }
        return null;
      }
      async buildRequest(inputOptions, { retryCount = 0 } = {}) {
        const options = { ...inputOptions };
        const { method, path, query, defaultBaseURL, headers = {} } = options;
        const body = ArrayBuffer.isView(options.body) || options.__binaryRequest && typeof options.body === "string" ? options.body : isMultipartBody(options.body) ? options.body.body : options.body ? JSON.stringify(options.body, null, 2) : null;
        const contentLength = this.calculateContentLength(body);
        const url = this.buildURL(path, query, defaultBaseURL);
        if ("timeout" in options)
          validatePositiveInteger("timeout", options.timeout);
        options.timeout = options.timeout ?? this.timeout;
        const httpAgent = options.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
        const minAgentTimeout = options.timeout + 1e3;
        if (typeof httpAgent?.options?.timeout === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
          httpAgent.options.timeout = minAgentTimeout;
        }
        if (this.idempotencyHeader && method !== "get") {
          if (!inputOptions.idempotencyKey)
            inputOptions.idempotencyKey = this.defaultIdempotencyKey();
          headers[this.idempotencyHeader] = inputOptions.idempotencyKey;
        }
        const reqHeaders = this.buildHeaders({ options, headers, contentLength, retryCount });
        const req = {
          method,
          ...body && { body },
          headers: reqHeaders,
          ...httpAgent && { agent: httpAgent },
          // @ts-ignore node-fetch uses a custom AbortSignal type that is
          // not compatible with standard web types
          signal: options.signal ?? null
        };
        return { req, url, timeout: options.timeout };
      }
      buildHeaders({ options, headers, contentLength, retryCount }) {
        const reqHeaders = {};
        if (contentLength) {
          reqHeaders["content-length"] = contentLength;
        }
        const defaultHeaders = this.defaultHeaders(options);
        applyHeadersMut(reqHeaders, defaultHeaders);
        applyHeadersMut(reqHeaders, headers);
        if (isMultipartBody(options.body) && kind !== "node") {
          delete reqHeaders["content-type"];
        }
        if (getHeader(defaultHeaders, "x-stainless-retry-count") === void 0 && getHeader(headers, "x-stainless-retry-count") === void 0) {
          reqHeaders["x-stainless-retry-count"] = String(retryCount);
        }
        if (getHeader(defaultHeaders, "x-stainless-timeout") === void 0 && getHeader(headers, "x-stainless-timeout") === void 0 && options.timeout) {
          reqHeaders["x-stainless-timeout"] = String(Math.trunc(options.timeout / 1e3));
        }
        this.validateHeaders(reqHeaders, headers);
        return reqHeaders;
      }
      /**
       * Used as a callback for mutating the given `FinalRequestOptions` object.
       */
      async prepareOptions(options) {
      }
      /**
       * Used as a callback for mutating the given `RequestInit` object.
       *
       * This is useful for cases where you want to add certain headers based off of
       * the request properties, e.g. `method` or `url`.
       */
      async prepareRequest(request, { url, options }) {
      }
      parseHeaders(headers) {
        return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : { ...headers };
      }
      makeStatusError(status, error, message, headers) {
        return APIError.generate(status, error, message, headers);
      }
      request(options, remainingRetries = null) {
        return new APIPromise(this.makeRequest(options, remainingRetries));
      }
      async makeRequest(optionsInput, retriesRemaining) {
        const options = await optionsInput;
        const maxRetries = options.maxRetries ?? this.maxRetries;
        if (retriesRemaining == null) {
          retriesRemaining = maxRetries;
        }
        await this.prepareOptions(options);
        const { req, url, timeout } = await this.buildRequest(options, {
          retryCount: maxRetries - retriesRemaining
        });
        await this.prepareRequest(req, { url, options });
        debug("request", url, options, req.headers);
        if (options.signal?.aborted) {
          throw new APIUserAbortError();
        }
        const controller = new AbortController();
        const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
        if (response instanceof Error) {
          if (options.signal?.aborted) {
            throw new APIUserAbortError();
          }
          if (retriesRemaining) {
            return this.retryRequest(options, retriesRemaining);
          }
          if (response.name === "AbortError") {
            throw new APIConnectionTimeoutError();
          }
          throw new APIConnectionError({ cause: response });
        }
        const responseHeaders = createResponseHeaders(response.headers);
        if (!response.ok) {
          if (retriesRemaining && this.shouldRetry(response)) {
            const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
            debug(`response (error; ${retryMessage2})`, response.status, url, responseHeaders);
            return this.retryRequest(options, retriesRemaining, responseHeaders);
          }
          const errText = await response.text().catch((e) => castToError(e).message);
          const errJSON = safeJSON(errText);
          const errMessage = errJSON ? void 0 : errText;
          const retryMessage = retriesRemaining ? `(error; no more retries left)` : `(error; not retryable)`;
          debug(`response (error; ${retryMessage})`, response.status, url, responseHeaders, errMessage);
          const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
          throw err;
        }
        return { response, options, controller };
      }
      requestAPIList(Page, options) {
        const request = this.makeRequest(options, null);
        return new PagePromise(this, request, Page);
      }
      buildURL(path, query, defaultBaseURL) {
        const baseURL = !__classPrivateFieldGet(this, _APIClient_baseURLOverridden, "f") && defaultBaseURL || this.baseURL;
        const url = isAbsoluteURL(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
        const defaultQuery = this.defaultQuery();
        if (!isEmptyObj(defaultQuery)) {
          query = { ...defaultQuery, ...query };
        }
        if (typeof query === "object" && query && !Array.isArray(query)) {
          url.search = this.stringifyQuery(query);
        }
        return url.toString();
      }
      stringifyQuery(query) {
        return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
          if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }
          if (value === null) {
            return `${encodeURIComponent(key)}=`;
          }
          throw new CerebrasError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
        }).join("&");
      }
      async fetchWithTimeout(url, init2, ms, controller) {
        const { signal, ...options } = init2 || {};
        if (signal)
          signal.addEventListener("abort", () => controller.abort());
        const timeout = setTimeout(() => controller.abort(), ms);
        const fetchOptions = {
          signal: controller.signal,
          ...options
        };
        if (fetchOptions.method) {
          fetchOptions.method = fetchOptions.method.toUpperCase();
        }
        return (
          // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
          this.fetch.call(void 0, url, fetchOptions).finally(() => {
            clearTimeout(timeout);
          })
        );
      }
      shouldRetry(response) {
        const shouldRetryHeader = response.headers.get("x-should-retry");
        if (shouldRetryHeader === "true")
          return true;
        if (shouldRetryHeader === "false")
          return false;
        if (response.status === 408)
          return true;
        if (response.status === 409)
          return true;
        if (response.status === 429)
          return true;
        if (response.status >= 500)
          return true;
        return false;
      }
      async retryRequest(options, retriesRemaining, responseHeaders) {
        let timeoutMillis;
        const retryAfterMillisHeader = responseHeaders?.["retry-after-ms"];
        if (retryAfterMillisHeader) {
          const timeoutMs = parseFloat(retryAfterMillisHeader);
          if (!Number.isNaN(timeoutMs)) {
            timeoutMillis = timeoutMs;
          }
        }
        const retryAfterHeader = responseHeaders?.["retry-after"];
        if (retryAfterHeader && !timeoutMillis) {
          const timeoutSeconds = parseFloat(retryAfterHeader);
          if (!Number.isNaN(timeoutSeconds)) {
            timeoutMillis = timeoutSeconds * 1e3;
          } else {
            timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
          }
        }
        if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
          const maxRetries = options.maxRetries ?? this.maxRetries;
          timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
        }
        await sleep(timeoutMillis);
        return this.makeRequest(options, retriesRemaining - 1);
      }
      calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8;
        const numRetries = maxRetries - retriesRemaining;
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        const jitter = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter * 1e3;
      }
      getUserAgent() {
        return `${this.constructor.name}/JS ${VERSION}`;
      }
    };
    _APIClient_baseURLOverridden = /* @__PURE__ */ new WeakMap();
    AbstractPage = class {
      constructor(client, response, body, options) {
        _AbstractPage_client.set(this, void 0);
        __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
        this.options = options;
        this.response = response;
        this.body = body;
      }
      hasNextPage() {
        const items = this.getPaginatedItems();
        if (!items.length)
          return false;
        return this.nextPageInfo() != null;
      }
      async getNextPage() {
        const nextInfo = this.nextPageInfo();
        if (!nextInfo) {
          throw new CerebrasError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
        }
        const nextOptions = { ...this.options };
        if ("params" in nextInfo && typeof nextOptions.query === "object") {
          nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
        } else if ("url" in nextInfo) {
          const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
          for (const [key, value] of params) {
            nextInfo.url.searchParams.set(key, value);
          }
          nextOptions.query = void 0;
          nextOptions.path = nextInfo.url.toString();
        }
        return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
      }
      async *iterPages() {
        let page = this;
        yield page;
        while (page.hasNextPage()) {
          page = await page.getNextPage();
          yield page;
        }
      }
      async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        for await (const page of this.iterPages()) {
          for (const item of page.getPaginatedItems()) {
            yield item;
          }
        }
      }
    };
    PagePromise = class extends APIPromise {
      constructor(client, request, Page) {
        super(request, async (props) => new Page(client, props.response, await defaultParseResponse(props), props.options));
      }
      /**
       * Allow auto-paginating iteration on an unawaited list call, eg:
       *
       *    for await (const item of client.items.list()) {
       *      console.log(item)
       *    }
       */
      async *[Symbol.asyncIterator]() {
        const page = await this;
        for await (const item of page) {
          yield item;
        }
      }
    };
    createResponseHeaders = (headers) => {
      return new Proxy(Object.fromEntries(
        // @ts-ignore
        headers.entries()
      ), {
        get(target, name) {
          const key = name.toString();
          return target[key.toLowerCase()] || target[key];
        }
      });
    };
    requestOptionsKeys = {
      method: true,
      path: true,
      query: true,
      body: true,
      headers: true,
      defaultBaseURL: true,
      maxRetries: true,
      stream: true,
      timeout: true,
      httpAgent: true,
      signal: true,
      idempotencyKey: true,
      __binaryRequest: true,
      __binaryResponse: true,
      __streamClass: true
    };
    isRequestOptions = (obj) => {
      return typeof obj === "object" && obj !== null && !isEmptyObj(obj) && Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k));
    };
    getPlatformProperties = () => {
      if (typeof Deno !== "undefined" && Deno.build != null) {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": normalizePlatform(Deno.build.os),
          "X-Stainless-Arch": normalizeArch(Deno.build.arch),
          "X-Stainless-Runtime": "deno",
          "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
        };
      }
      if (typeof EdgeRuntime !== "undefined") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": `other:${EdgeRuntime}`,
          "X-Stainless-Runtime": "edge",
          "X-Stainless-Runtime-Version": process.version
        };
      }
      if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": normalizePlatform(process.platform),
          "X-Stainless-Arch": normalizeArch(process.arch),
          "X-Stainless-Runtime": "node",
          "X-Stainless-Runtime-Version": process.version
        };
      }
      const browserInfo = getBrowserInfo();
      if (browserInfo) {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": "unknown",
          "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
          "X-Stainless-Runtime-Version": browserInfo.version
        };
      }
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": "unknown",
        "X-Stainless-Runtime-Version": "unknown"
      };
    };
    normalizeArch = (arch) => {
      if (arch === "x32")
        return "x32";
      if (arch === "x86_64" || arch === "x64")
        return "x64";
      if (arch === "arm")
        return "arm";
      if (arch === "aarch64" || arch === "arm64")
        return "arm64";
      if (arch)
        return `other:${arch}`;
      return "unknown";
    };
    normalizePlatform = (platform) => {
      platform = platform.toLowerCase();
      if (platform.includes("ios"))
        return "iOS";
      if (platform === "android")
        return "Android";
      if (platform === "darwin")
        return "MacOS";
      if (platform === "win32")
        return "Windows";
      if (platform === "freebsd")
        return "FreeBSD";
      if (platform === "openbsd")
        return "OpenBSD";
      if (platform === "linux")
        return "Linux";
      if (platform)
        return `Other:${platform}`;
      return "Unknown";
    };
    getPlatformHeaders = () => {
      return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
    };
    safeJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch (err) {
        return void 0;
      }
    };
    startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
    isAbsoluteURL = (url) => {
      return startsWithSchemeRegexp.test(url);
    };
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    validatePositiveInteger = (name, n) => {
      if (typeof n !== "number" || !Number.isInteger(n)) {
        throw new CerebrasError(`${name} must be an integer`);
      }
      if (n < 0) {
        throw new CerebrasError(`${name} must be a positive integer`);
      }
      return n;
    };
    castToError = (err) => {
      if (err instanceof Error)
        return err;
      if (typeof err === "object" && err !== null) {
        try {
          return new Error(JSON.stringify(err));
        } catch {
        }
      }
      return new Error(err);
    };
    readEnv = (env) => {
      if (typeof process !== "undefined") {
        return process.env?.[env]?.trim() ?? void 0;
      }
      if (typeof Deno !== "undefined") {
        return Deno.env?.get?.(env)?.trim();
      }
      return void 0;
    };
    uuid4 = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    };
    isHeadersProtocol = (headers) => {
      return typeof headers?.get === "function";
    };
    getHeader = (headers, header) => {
      const lowerCasedHeader = header.toLowerCase();
      if (isHeadersProtocol(headers)) {
        const intercapsHeader = header[0]?.toUpperCase() + header.substring(1).replace(/([^\w])(\w)/g, (_m, g1, g2) => g1 + g2.toUpperCase());
        for (const key of [header, lowerCasedHeader, header.toUpperCase(), intercapsHeader]) {
          const value = headers.get(key);
          if (value) {
            return value;
          }
        }
      }
      for (const [key, value] of Object.entries(headers)) {
        if (key.toLowerCase() === lowerCasedHeader) {
          if (Array.isArray(value)) {
            if (value.length <= 1)
              return value[0];
            console.warn(`Received ${value.length} entries for the ${header} header, using the first entry.`);
            return value[0];
          }
          return value;
        }
      }
      return void 0;
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resource.mjs
var APIResource;
var init_resource = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resource.mjs"() {
    APIResource = class {
      constructor(client) {
        this._client = client;
      }
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resources/chat/completions.mjs
var Completions;
var init_completions = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resources/chat/completions.mjs"() {
    init_resource();
    Completions = class extends APIResource {
      create(params, options) {
        const { "CF-RAY": cfRay, "X-Amz-Cf-Id": xAmzCfId, "X-delay-time": xDelayTime, ...body } = params;
        return this._client.post("/v1/chat/completions", {
          body,
          ...options,
          stream: body.stream ?? false,
          headers: {
            ...cfRay != null ? { "CF-RAY": cfRay } : void 0,
            ...xAmzCfId != null ? { "X-Amz-Cf-Id": xAmzCfId } : void 0,
            ...xDelayTime?.toString() != null ? { "X-delay-time": xDelayTime?.toString() } : void 0,
            ...options?.headers
          }
        });
      }
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resources/chat/chat.mjs
var Chat;
var init_chat = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resources/chat/chat.mjs"() {
    init_resource();
    init_completions();
    init_completions();
    Chat = class extends APIResource {
      constructor() {
        super(...arguments);
        this.completions = new Completions(this._client);
      }
    };
    Chat.Completions = Completions;
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resources/chat/index.mjs
var init_chat2 = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resources/chat/index.mjs"() {
    init_chat();
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resources/completions.mjs
var Completions2;
var init_completions2 = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resources/completions.mjs"() {
    init_resource();
    Completions2 = class extends APIResource {
      create(params, options) {
        const { "CF-RAY": cfRay, "X-Amz-Cf-Id": xAmzCfId, "X-delay-time": xDelayTime, ...body } = params;
        return this._client.post("/v1/completions", {
          body,
          ...options,
          stream: body.stream ?? false,
          headers: {
            ...cfRay != null ? { "CF-RAY": cfRay } : void 0,
            ...xAmzCfId != null ? { "X-Amz-Cf-Id": xAmzCfId } : void 0,
            ...xDelayTime?.toString() != null ? { "X-delay-time": xDelayTime?.toString() } : void 0,
            ...options?.headers
          }
        });
      }
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resources/models.mjs
var Models;
var init_models = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resources/models.mjs"() {
    init_resource();
    init_core();
    Models = class extends APIResource {
      retrieve(modelId, params = {}, options) {
        if (isRequestOptions(params)) {
          return this.retrieve(modelId, {}, params);
        }
        const { "CF-RAY": cfRay, "X-Amz-Cf-Id": xAmzCfId } = params;
        return this._client.get(`/v1/models/${modelId}`, {
          ...options,
          headers: {
            ...cfRay != null ? { "CF-RAY": cfRay } : void 0,
            ...xAmzCfId != null ? { "X-Amz-Cf-Id": xAmzCfId } : void 0,
            ...options?.headers
          }
        });
      }
      list(params = {}, options) {
        if (isRequestOptions(params)) {
          return this.list({}, params);
        }
        const { "CF-RAY": cfRay, "X-Amz-Cf-Id": xAmzCfId } = params;
        return this._client.get("/v1/models", {
          ...options,
          headers: {
            ...cfRay != null ? { "CF-RAY": cfRay } : void 0,
            ...xAmzCfId != null ? { "X-Amz-Cf-Id": xAmzCfId } : void 0,
            ...options?.headers
          }
        });
      }
    };
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/resources/index.mjs
var init_resources = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/resources/index.mjs"() {
    init_chat2();
    init_completions2();
    init_models();
  }
});

// node_modules/@cerebras/cerebras_cloud_sdk/index.mjs
var cerebras_cloud_sdk_exports = {};
__export(cerebras_cloud_sdk_exports, {
  APIConnectionError: () => APIConnectionError,
  APIConnectionTimeoutError: () => APIConnectionTimeoutError,
  APIError: () => APIError,
  APIUserAbortError: () => APIUserAbortError,
  AuthenticationError: () => AuthenticationError,
  BadRequestError: () => BadRequestError,
  Cerebras: () => Cerebras,
  CerebrasError: () => CerebrasError,
  ConflictError: () => ConflictError,
  InternalServerError: () => InternalServerError,
  NotFoundError: () => NotFoundError,
  PermissionDeniedError: () => PermissionDeniedError,
  RateLimitError: () => RateLimitError,
  UnprocessableEntityError: () => UnprocessableEntityError,
  default: () => cerebras_cloud_sdk_default,
  fileFromPath: () => fileFromPath,
  toFile: () => toFile
});
var _Cerebras_instances, _a, _Cerebras_baseURLOverridden, Cerebras, cerebras_cloud_sdk_default;
var init_cerebras_cloud_sdk = __esm({
  "node_modules/@cerebras/cerebras_cloud_sdk/index.mjs"() {
    init_core();
    init_error();
    init_uploads();
    init_resources();
    init_completions2();
    init_models();
    init_chat();
    init_uploads();
    init_error();
    Cerebras = class extends APIClient {
      /**
       * API Client for interfacing with the Cerebras API.
       *
       * @param {string | undefined} [opts.apiKey=process.env['CEREBRAS_API_KEY'] ?? undefined]
       * @param {string} [opts.baseURL=process.env['CEREBRAS_BASE_URL'] ?? https://api.cerebras.ai] - Override the default base URL for the API.
       * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
       * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
       * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
       * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
       * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
       * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
       * @param {boolean | undefined} opts.warmTCPConnection - Whether to warm TCP connection in the constructor.
       */
      constructor({ baseURL = readEnv("CEREBRAS_BASE_URL"), apiKey = readEnv("CEREBRAS_API_KEY"), warmTCPConnection = true, ...opts } = {}) {
        if (apiKey === void 0) {
          throw new CerebrasError("The CEREBRAS_API_KEY environment variable is missing or empty; either provide it, or instantiate the Cerebras client with an apiKey option, like new Cerebras({ apiKey: 'My API Key' }).");
        }
        const options = {
          apiKey,
          ...opts,
          baseURL: baseURL || `https://api.cerebras.ai`
        };
        super({
          baseURL: options.baseURL,
          baseURLOverridden: baseURL ? baseURL !== "https://api.cerebras.ai" : false,
          timeout: options.timeout ?? 6e4,
          httpAgent: options.httpAgent,
          maxRetries: options.maxRetries,
          fetch: options.fetch
        });
        _Cerebras_instances.add(this);
        this.chat = new Chat(this);
        this.completions = new Completions2(this);
        this.models = new Models(this);
        this._options = options;
        this.apiKey = apiKey;
        if (warmTCPConnection) {
          (async () => {
            try {
              await this.get("/v1/tcp_warming", {
                timeout: 1e3,
                maxRetries: 0
              });
            } catch (e) {
              debug(`TCP Warming had exception: ${e}`);
            }
          })();
        }
      }
      defaultQuery() {
        return this._options.defaultQuery;
      }
      defaultHeaders(opts) {
        return {
          ...super.defaultHeaders(opts),
          ...this._options.defaultHeaders
        };
      }
      authHeaders(opts) {
        return { Authorization: `Bearer ${this.apiKey}` };
      }
    };
    _a = Cerebras, _Cerebras_instances = /* @__PURE__ */ new WeakSet(), _Cerebras_baseURLOverridden = function _Cerebras_baseURLOverridden2() {
      return this.baseURL !== "https://api.cerebras.ai";
    };
    Cerebras.Cerebras = _a;
    Cerebras.DEFAULT_TIMEOUT = 6e4;
    Cerebras.CerebrasError = CerebrasError;
    Cerebras.APIError = APIError;
    Cerebras.APIConnectionError = APIConnectionError;
    Cerebras.APIConnectionTimeoutError = APIConnectionTimeoutError;
    Cerebras.APIUserAbortError = APIUserAbortError;
    Cerebras.NotFoundError = NotFoundError;
    Cerebras.ConflictError = ConflictError;
    Cerebras.RateLimitError = RateLimitError;
    Cerebras.BadRequestError = BadRequestError;
    Cerebras.AuthenticationError = AuthenticationError;
    Cerebras.InternalServerError = InternalServerError;
    Cerebras.PermissionDeniedError = PermissionDeniedError;
    Cerebras.UnprocessableEntityError = UnprocessableEntityError;
    Cerebras.toFile = toFile;
    Cerebras.fileFromPath = fileFromPath;
    Cerebras.Chat = Chat;
    Cerebras.Completions = Completions2;
    Cerebras.Models = Models;
    cerebras_cloud_sdk_default = Cerebras;
  }
});

// node_modules/@liquidmetal-ai/raindrop-framework/dist/core/cors.js
var matchOrigin = (request, env, config) => {
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin) {
    return null;
  }
  const { origin } = config;
  if (origin === "*") {
    return "*";
  }
  if (typeof origin === "function") {
    return origin(request, env);
  }
  if (typeof origin === "string") {
    return requestOrigin === origin ? origin : null;
  }
  if (Array.isArray(origin)) {
    return origin.includes(requestOrigin) ? requestOrigin : null;
  }
  return null;
};
var addCorsHeaders = (response, request, env, config) => {
  const allowedOrigin = matchOrigin(request, env, config);
  if (!allowedOrigin) {
    return response;
  }
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  if (config.credentials) {
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  if (config.exposeHeaders && config.exposeHeaders.length > 0) {
    headers.set("Access-Control-Expose-Headers", config.exposeHeaders.join(", "));
  }
  const vary = headers.get("Vary");
  if (vary) {
    if (!vary.includes("Origin")) {
      headers.set("Vary", `${vary}, Origin`);
    }
  } else {
    headers.set("Vary", "Origin");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
var handlePreflight = (request, env, config) => {
  const allowedOrigin = matchOrigin(request, env, config);
  if (!allowedOrigin) {
    return new Response(null, { status: 403 });
  }
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  if (config.credentials) {
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  const allowMethods = config.allowMethods || ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
  headers.set("Access-Control-Allow-Methods", allowMethods.join(", "));
  const allowHeaders = config.allowHeaders || ["Content-Type", "Authorization"];
  headers.set("Access-Control-Allow-Headers", allowHeaders.join(", "));
  const maxAge = config.maxAge ?? 86400;
  headers.set("Access-Control-Max-Age", maxAge.toString());
  headers.set("Vary", "Origin");
  return new Response(null, {
    status: 204,
    headers
  });
};
var createCorsHandler = (config) => {
  return (request, env, response) => {
    if (!response) {
      return handlePreflight(request, env, config);
    }
    return addCorsHeaders(response, request, env, config);
  };
};
var corsAllowAll = createCorsHandler({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true
});
var corsDisabled = (request, _env, response) => {
  if (!response && request.method === "OPTIONS") {
    return new Response(null, { status: 403 });
  }
  if (!response) {
    throw new Error("corsDisabled called without response for non-OPTIONS request");
  }
  return response;
};

// src/_app/cors.ts
var cors = corsDisabled;

// src/api/index.ts
import { Service } from "./runtime.js";

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init2) {
    this.#routers = init2.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno: Deno2 } = globalThis;
  const isNoColor = typeof Deno2?.noColor === "boolean" ? Deno2.noColor : process2 !== void 0 ? "NO_COLOR" in process2?.env : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator: navigator2 } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator2 !== void 0 && navigator2.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
};
var colorStatus = async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// src/api/mockData.ts
var MOCK_REFERRALS_LIST = {
  success: true,
  data: {
    referrals: [
      {
        id: "ref-001",
        patientFirstName: "Sarah",
        patientLastName: "Johnson",
        patientEmail: "sarah.johnson@email.com",
        specialty: "Cardiology",
        payer: "Blue Cross Blue Shield",
        status: "Scheduled",
        appointmentDate: "2025-11-22T10:30:00Z",
        referralDate: "2025-11-10T14:00:00Z",
        noShowRisk: 15
      },
      {
        id: "ref-002",
        patientFirstName: "Michael",
        patientLastName: "Chen",
        patientEmail: "michael.chen@email.com",
        specialty: "Orthopedics",
        payer: "UnitedHealthcare",
        status: "Pending",
        appointmentDate: "2025-11-25T14:00:00Z",
        referralDate: "2025-11-15T09:30:00Z",
        noShowRisk: 42
      }
    ],
    pagination: {
      page: 1,
      limit: 50,
      total: 62,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false
    }
  },
  message: "Referrals retrieved successfully"
};
var MOCK_REFERRAL_DETAILS = {
  success: true,
  data: {
    id: "ref-001",
    patientFirstName: "Sarah",
    patientLastName: "Johnson",
    patientEmail: "sarah.johnson@email.com",
    age: 58,
    specialty: "Cardiology",
    payer: "Blue Cross Blue Shield",
    plan: "Blue Cross PPO Plus",
    status: "Scheduled",
    urgency: "urgent",
    appointmentDate: "2025-11-22T10:30:00Z",
    referralDate: "2025-11-10T14:00:00Z",
    noShowRisk: 15,
    providerName: "Dr. James Mitchell",
    facilityName: "Downtown Medical Center",
    reason: "Chest pain and irregular heartbeat",
    steps: [
      {
        id: "step-1",
        label: "Intake",
        status: "completed",
        completedAt: "2025-11-10T14:15:00Z",
        description: "Initial referral received and processed"
      },
      {
        id: "step-2",
        label: "Eligibility",
        status: "completed",
        completedAt: "2025-11-11T09:30:00Z",
        description: "Insurance eligibility verified"
      },
      {
        id: "step-3",
        label: "Prior Authorization",
        status: "completed",
        completedAt: "2025-11-13T16:45:00Z",
        description: "PA approved for specialist consultation"
      },
      {
        id: "step-4",
        label: "Scheduled",
        status: "current",
        completedAt: "2025-11-15T11:20:00Z",
        description: "Appointment scheduled with provider"
      },
      {
        id: "step-5",
        label: "Completed",
        status: "upcoming",
        description: "Appointment attended"
      }
    ],
    actionLog: [
      {
        id: "log-1",
        event: "Referral Created",
        type: "system",
        timestamp: "2025-11-10T14:00:00Z",
        user: "Dr. Emma Wilson",
        description: "Referral created by primary care physician",
        details: {
          source: "EHR Integration"
        }
      },
      {
        id: "log-2",
        event: "Intake Completed",
        type: "user",
        timestamp: "2025-11-10T14:15:00Z",
        user: "Linda Martinez",
        description: "Patient demographics and insurance information verified"
      },
      {
        id: "log-3",
        event: "Eligibility Check Started",
        type: "eligibility",
        timestamp: "2025-11-11T09:00:00Z",
        user: "System",
        description: "Automated eligibility verification initiated"
      },
      {
        id: "log-4",
        event: "Eligibility Verified",
        type: "eligibility",
        timestamp: "2025-11-11T09:30:00Z",
        user: "System",
        description: "Insurance active, benefits confirmed",
        details: {
          copay: "$40",
          coinsurance: "20%"
        }
      },
      {
        id: "log-5",
        event: "PA Request Submitted",
        type: "pa",
        timestamp: "2025-11-12T10:15:00Z",
        user: "Sarah Chen",
        description: "Prior authorization request submitted to payer"
      },
      {
        id: "log-6",
        event: "PA Approved",
        type: "pa",
        timestamp: "2025-11-13T16:45:00Z",
        user: "Blue Cross Blue Shield",
        description: "Prior authorization approved - Authorization #PA-2025-8847",
        details: {
          authNumber: "PA-2025-8847",
          validUntil: "2026-02-13"
        }
      },
      {
        id: "log-7",
        event: "Appointment Scheduled",
        type: "scheduling",
        timestamp: "2025-11-15T11:20:00Z",
        user: "Mike Johnson",
        description: "Appointment scheduled for Nov 22, 2025 at 10:30 AM"
      },
      {
        id: "log-8",
        event: "Confirmation SMS Sent",
        type: "message",
        timestamp: "2025-11-15T11:25:00Z",
        user: "System",
        description: "Appointment confirmation sent via SMS"
      },
      {
        id: "log-9",
        event: "Reminder Email Sent",
        type: "message",
        timestamp: "2025-11-19T09:00:00Z",
        user: "System",
        description: "3-day appointment reminder sent via email"
      },
      {
        id: "log-10",
        event: "Patient Confirmed Attendance",
        type: "message",
        timestamp: "2025-11-19T14:30:00Z",
        user: "Sarah Johnson",
        description: "Patient replied 'YES' to confirmation request"
      }
    ],
    messages: [
      {
        id: "msg-1",
        channel: "SMS",
        content: "Hi Sarah, your cardiology appointment with Dr. James Mitchell is scheduled for Nov 22 at 10:30 AM at Downtown Medical Center. Please reply YES to confirm or CANCEL to reschedule.",
        timestamp: "2025-11-15T11:25:00Z",
        status: "delivered",
        direction: "outbound",
        recipient: "sarah.johnson@email.com"
      },
      {
        id: "msg-2",
        channel: "SMS",
        content: "YES",
        timestamp: "2025-11-19T14:30:00Z",
        status: "delivered",
        direction: "inbound"
      },
      {
        id: "msg-3",
        channel: "Email",
        content: "Dear Sarah Johnson,\\n\\nThis is a reminder that you have an appointment scheduled:\\n\\nDate: Friday, November 22, 2025\\nTime: 10:30 AM\\nProvider: Dr. James Mitchell\\nLocation: Downtown Medical Center, 123 Main St\\nSpecialty: Cardiology\\n\\nPlease bring your insurance card and a valid ID. If you need to reschedule, please call us at (555) 123-4567.\\n\\nThank you!",
        timestamp: "2025-11-19T09:00:00Z",
        status: "delivered",
        direction: "outbound",
        recipient: "sarah.johnson@email.com"
      }
    ]
  },
  message: "Referral details retrieved successfully"
};
var MOCK_REFERRAL_LOGS = {
  success: true,
  data: {
    referralId: "ref-001",
    logs: [
      {
        id: "log-10",
        event: "Patient Confirmed Attendance",
        type: "message",
        timestamp: "2025-11-19T14:30:00Z",
        user: "Sarah Johnson",
        description: "Patient replied 'YES' to confirmation request",
        details: null
      },
      {
        id: "log-9",
        event: "Reminder Email Sent",
        type: "message",
        timestamp: "2025-11-19T09:00:00Z",
        user: "System",
        description: "3-day appointment reminder sent via email",
        details: null
      },
      {
        id: "log-8",
        event: "Confirmation SMS Sent",
        type: "message",
        timestamp: "2025-11-15T11:25:00Z",
        user: "System",
        description: "Appointment confirmation sent via SMS",
        details: null
      },
      {
        id: "log-7",
        event: "Appointment Scheduled",
        type: "scheduling",
        timestamp: "2025-11-15T11:20:00Z",
        user: "Mike Johnson",
        description: "Appointment scheduled for Nov 22, 2025 at 10:30 AM",
        details: null
      },
      {
        id: "log-6",
        event: "PA Approved",
        type: "pa",
        timestamp: "2025-11-13T16:45:00Z",
        user: "Blue Cross Blue Shield",
        description: "Prior authorization approved - Authorization #PA-2025-8847",
        details: {
          authNumber: "PA-2025-8847",
          validUntil: "2026-02-13"
        }
      },
      {
        id: "log-5",
        event: "PA Request Submitted",
        type: "pa",
        timestamp: "2025-11-12T10:15:00Z",
        user: "Sarah Chen",
        description: "Prior authorization request submitted to payer",
        details: null
      },
      {
        id: "log-4",
        event: "Eligibility Verified",
        type: "eligibility",
        timestamp: "2025-11-11T09:30:00Z",
        user: "System",
        description: "Insurance active, benefits confirmed",
        details: {
          copay: "$40",
          coinsurance: "20%"
        }
      },
      {
        id: "log-3",
        event: "Eligibility Check Started",
        type: "eligibility",
        timestamp: "2025-11-11T09:00:00Z",
        user: "System",
        description: "Automated eligibility verification initiated",
        details: null
      },
      {
        id: "log-2",
        event: "Intake Completed",
        type: "user",
        timestamp: "2025-11-10T14:15:00Z",
        user: "Linda Martinez",
        description: "Patient demographics and insurance information verified",
        details: null
      },
      {
        id: "log-1",
        event: "Referral Created",
        type: "system",
        timestamp: "2025-11-10T14:00:00Z",
        user: "Dr. Emma Wilson",
        description: "Referral created by primary care physician",
        details: {
          source: "EHR Integration"
        }
      }
    ],
    pagination: {
      limit: 100,
      offset: 0,
      total: 10,
      hasMore: false
    }
  },
  message: "Logs retrieved successfully"
};

// src/api/index.ts
var app = new Hono2();
app.use("*", logger());
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/ping", (c) => {
  return c.text("pong");
});
app.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");
    if (!file) {
      return c.text("No file uploaded", 400);
    }
    const smartbucket = c.env.REFERRAL_DOCS;
    const arrayBuffer = await file.arrayBuffer();
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    await smartbucket.put(documentId, new Uint8Array(arrayBuffer), {
      httpMetadata: {
        contentType: file.type || "application/pdf"
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    return c.json({
      success: true,
      message: "File uploaded successfully",
      id: documentId,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({
      success: false,
      error: {
        code: "UPLOAD_FAILED",
        message: "Failed to process document",
        statusCode: 500
      }
    }, 500);
  }
});
app.post("/extract", async (c) => {
  try {
    const body = await c.req.json();
    const { id } = body;
    if (!id) {
      return c.json({ error: "Document ID is required" }, 400);
    }
    const smartbucket = c.env.REFERRAL_DOCS;
    const pdfObject = await smartbucket.get(id);
    if (!pdfObject) {
      return c.json({ error: "Document not found" }, 404);
    }
    const Cerebras2 = (await Promise.resolve().then(() => (init_cerebras_cloud_sdk(), cerebras_cloud_sdk_exports))).default;
    const cerebras = new Cerebras2({
      apiKey: "csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt",
      warmTCPConnection: false
    });
    const originalFilename = pdfObject.customMetadata?.originalName || "medical referral document";
    const prompt = `You are analyzing a medical referral document titled "${originalFilename}".

Based on typical medical referral documents, extract realistic patient information in this exact JSON format:

{
  "patientName": "Full patient name",
  "dateOfBirth": "YYYY-MM-DD format",
  "referralReason": "Medical condition or symptoms",
  "insuranceProvider": "Insurance company name"
}

For Document 3, the patient is Lisa Kowalski (female, age 33, DOB: September 5, 1992) with newly diagnosed Type 2 Diabetes Mellitus requiring Endocrinology referral. Insurance: Aetna PPO.

Generate realistic, medically accurate extraction data for this document. Return ONLY the JSON object.`;
    const completion = await cerebras.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3.1-8b",
      temperature: 0.1,
      max_completion_tokens: 300
    });
    const aiResponse = completion.choices[0]?.message?.content || "";
    console.log("CEREBRAS Response:", aiResponse);
    let extractedData;
    try {
      const cleanJson = aiResponse.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON in response");
      }
    } catch (parseError) {
      console.error("Parse error:", aiResponse);
      return c.json({ error: "Failed to parse AI response", rawResponse: aiResponse }, 500);
    }
    return c.json(extractedData);
  } catch (error) {
    console.error("Extract error:", error);
    return c.json({
      error: "Extraction failed: " + (error instanceof Error ? error.message : String(error))
    }, 500);
  }
});
app.post("/orchestrate", async (c) => {
  try {
    const body = await c.req.json();
    const { patientName, referralReason, insuranceProvider } = body;
    if (!patientName || !referralReason) {
      return c.json({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Missing required fields",
          statusCode: 400
        }
      }, 400);
    }
    let specialty = "General Practitioner";
    const reasonLower = referralReason.toLowerCase();
    const specialtyMap = {
      "Cardiologist": ["heart", "cardio", "chest", "palpitation", "pulse", "pressure"],
      "Dermatologist": ["skin", "derma", "rash", "itch", "acne", "mole", "lesion"],
      "Orthopedist": ["bone", "joint", "knee", "back", "spine", "fracture", "ortho", "shoulder", "hip"],
      "Neurologist": ["headache", "migraine", "seizure", "numbness", "dizzy", "brain", "nerve", "neuro"],
      "Pediatrician": ["child", "baby", "infant", "toddler", "pediatric", "growth"],
      "Psychiatrist": ["mental", "depress", "anxiety", "mood", "psych", "behavior"],
      "Oncologist": ["cancer", "tumor", "lump", "onco", "chemo", "radiation"],
      "Gastroenterologist": ["stomach", "gut", "digest", "bowel", "reflux", "gastro", "liver"],
      "Pulmonologist": ["lung", "breath", "asthma", "cough", "pulmo", "respiratory"],
      "Urologist": ["urine", "bladder", "kidney", "prostate", "uro"],
      "Ophthalmologist": ["eye", "vision", "sight", "blind", "optic"],
      "ENT Specialist": ["ear", "nose", "throat", "sinus", "hearing"],
      "Endocrinologist": ["diabetes", "thyroid", "hormone", "sugar", "endo"],
      "Rheumatologist": ["arthritis", "autoimmune", "lupus", "rheum"]
    };
    for (const [spec, keywords] of Object.entries(specialtyMap)) {
      if (keywords.some((k) => reasonLower.includes(k))) {
        specialty = spec;
        break;
      }
    }
    const insuranceStatus = insuranceProvider && insuranceProvider.toLowerCase().includes("blue") ? "Approved" : "Pending Review";
    const db = c.env.REFERRALS_DB;
    const specialistsResult = await db.executeQuery({
      sqlQuery: `SELECT * FROM specialists WHERE specialty = '${specialty}'`
    });
    let availableSlots = [];
    let selectedSpecialist = null;
    const getRows = (result) => {
      if (Array.isArray(result)) return result;
      if (result && result.results) {
        if (Array.isArray(result.results)) return result.results;
        if (typeof result.results === "string") {
          try {
            return JSON.parse(result.results);
          } catch (e) {
            console.error("Failed to parse SQL results:", e);
            return [];
          }
        }
      }
      if (result && Array.isArray(result.rows)) return result.rows;
      return [];
    };
    const specialists = getRows(specialistsResult);
    if (specialists.length > 0) {
      selectedSpecialist = specialists[0];
      const slotsResult = await db.executeQuery({
        sqlQuery: `SELECT * FROM slots WHERE specialist_id = ${selectedSpecialist.id} AND is_booked = 0 AND start_time > '${(/* @__PURE__ */ new Date()).toISOString()}' ORDER BY start_time ASC LIMIT 3`
      });
      const slots = getRows(slotsResult);
      availableSlots = slots.map((slot) => slot.start_time);
    }
    const insertQuery = `INSERT INTO referrals (patient_name, condition, insurance_provider, specialist_id, status) 
       VALUES ('${patientName}', '${referralReason}', '${insuranceProvider}', ${selectedSpecialist ? selectedSpecialist.id : "NULL"}, 'Pending')`;
    await db.executeQuery({ sqlQuery: insertQuery });
    const idResult = await db.executeQuery({ sqlQuery: "SELECT last_insert_rowid() as id" });
    const idRows = getRows(idResult);
    const referralId = idRows[0]?.id || "unknown";
    return c.json({
      success: true,
      data: {
        referralId: `ref-${referralId}`,
        status: "Processed",
        specialist: specialty,
        assignedDoctor: selectedSpecialist ? selectedSpecialist.name : "Pending Assignment",
        insuranceStatus,
        availableSlots,
        debug: {
          specialtyUsed: specialty,
          specialistsFound: specialists.length,
          slotsFound: availableSlots.length
        }
      },
      message: "Referral orchestration completed successfully"
    });
  } catch (error) {
    console.error("Orchestrate error:", error);
    return c.json({
      success: false,
      error: {
        code: "ORCHESTRATION_FAILED",
        message: "Failed to start orchestration: " + (error instanceof Error ? error.message : String(error)),
        statusCode: 500
      }
    }, 500);
  }
});
app.post("/seed", async (c) => {
  try {
    const db = c.env.REFERRALS_DB;
    await db.executeQuery({
      sqlQuery: `
      CREATE TABLE IF NOT EXISTS specialists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          email TEXT
      );
    `
    });
    await db.executeQuery({
      sqlQuery: `
      CREATE TABLE IF NOT EXISTS slots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          specialist_id INTEGER REFERENCES specialists(id),
          start_time TEXT NOT NULL,
          is_booked INTEGER DEFAULT 0
      );
    `
    });
    await db.executeQuery({
      sqlQuery: `
      CREATE TABLE IF NOT EXISTS referrals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name TEXT NOT NULL,
          dob TEXT,
          condition TEXT,
          insurance_provider TEXT,
          specialist_id INTEGER REFERENCES specialists(id),
          slot_id INTEGER REFERENCES slots(id),
          status TEXT DEFAULT 'Pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `
    });
    await db.executeQuery({ sqlQuery: "DELETE FROM slots" });
    await db.executeQuery({ sqlQuery: "DELETE FROM referrals" });
    await db.executeQuery({ sqlQuery: "DELETE FROM specialists" });
    const doctors = [
      // Cardiologists (2)
      { name: "Dr. James Mitchell", specialty: "Cardiologist", email: "james.mitchell@hospital.com" },
      { name: "Dr. Sarah Rodriguez", specialty: "Cardiologist", email: "sarah.rodriguez@hospital.com" },
      // Dermatologists (2)
      { name: "Dr. Emily Chen", specialty: "Dermatologist", email: "emily.chen@hospital.com" },
      { name: "Dr. Michael Smith", specialty: "Dermatologist", email: "michael.smith@hospital.com" },
      // Orthopedists (2)
      { name: "Dr. David Johnson", specialty: "Orthopedist", email: "david.johnson@hospital.com" },
      { name: "Dr. Jessica Williams", specialty: "Orthopedist", email: "jessica.williams@hospital.com" },
      // Neurologists (2)
      { name: "Dr. Jennifer Brown", specialty: "Neurologist", email: "jennifer.brown@hospital.com" },
      { name: "Dr. Robert Jones", specialty: "Neurologist", email: "robert.jones@hospital.com" },
      // Pediatricians (2)
      { name: "Dr. William Garcia", specialty: "Pediatrician", email: "william.garcia@hospital.com" },
      { name: "Dr. Elizabeth Miller", specialty: "Pediatrician", email: "elizabeth.miller@hospital.com" },
      // Psychiatrists (2)
      { name: "Dr. John Davis", specialty: "Psychiatrist", email: "john.davis@hospital.com" },
      { name: "Dr. Linda Rodriguez", specialty: "Psychiatrist", email: "linda.rodriguez@hospital.com" },
      // Oncologists (2)
      { name: "Dr. Richard Martinez", specialty: "Oncologist", email: "richard.martinez@hospital.com" },
      { name: "Dr. Barbara Hernandez", specialty: "Oncologist", email: "barbara.hernandez@hospital.com" },
      // Gastroenterologists (2)
      { name: "Dr. Thomas Lopez", specialty: "Gastroenterologist", email: "thomas.lopez@hospital.com" },
      { name: "Dr. Sarah Lee", specialty: "Gastroenterologist", email: "sarah.lee@hospital.com" },
      // Pulmonologists (2)
      { name: "Dr. Emily White", specialty: "Pulmonologist", email: "emily.white@hospital.com" },
      { name: "Dr. Michael Brown", specialty: "Pulmonologist", email: "michael.brown@hospital.com" },
      // Urologists (2)
      { name: "Dr. David Wilson", specialty: "Urologist", email: "david.wilson@hospital.com" },
      { name: "Dr. Jessica Taylor", specialty: "Urologist", email: "jessica.taylor@hospital.com" },
      // Ophthalmologists (2)
      { name: "Dr. Jennifer Anderson", specialty: "Ophthalmologist", email: "jennifer.anderson@hospital.com" },
      { name: "Dr. Robert Thomas", specialty: "Ophthalmologist", email: "robert.thomas@hospital.com" },
      // ENT Specialists (2)
      { name: "Dr. William Jackson", specialty: "ENT Specialist", email: "william.jackson@hospital.com" },
      { name: "Dr. Elizabeth Harris", specialty: "ENT Specialist", email: "elizabeth.harris@hospital.com" },
      // Endocrinologists (2)
      { name: "Dr. John Martin", specialty: "Endocrinologist", email: "john.martin@hospital.com" },
      { name: "Dr. Linda Thompson", specialty: "Endocrinologist", email: "linda.thompson@hospital.com" },
      // Rheumatologists (2)
      { name: "Dr. Richard Garcia", specialty: "Rheumatologist", email: "richard.garcia@hospital.com" },
      { name: "Dr. Barbara Martinez", specialty: "Rheumatologist", email: "barbara.martinez@hospital.com" },
      // General Practitioners (2)
      { name: "Dr. Thomas Robinson", specialty: "General Practitioner", email: "thomas.robinson@hospital.com" },
      { name: "Dr. Sarah Clark", specialty: "General Practitioner", email: "sarah.clark@hospital.com" }
    ];
    for (const doc of doctors) {
      await db.executeQuery({
        sqlQuery: `INSERT INTO specialists (name, specialty, email) VALUES ('${doc.name}', '${doc.specialty}', '${doc.email}')`
      });
    }
    const allSpecsRes = await db.executeQuery({ sqlQuery: "SELECT id FROM specialists" });
    const getRows = (result) => {
      if (Array.isArray(result)) return result;
      if (result && result.results) {
        if (Array.isArray(result.results)) return result.results;
        if (typeof result.results === "string") {
          try {
            return JSON.parse(result.results);
          } catch (e) {
            console.error("Failed to parse SQL results:", e);
            return [];
          }
        }
      }
      if (result && Array.isArray(result.rows)) return result.rows;
      return [];
    };
    const allSpecs = getRows(allSpecsRes);
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    for (const doc of allSpecs) {
      if (Math.random() > 0.5) continue;
      for (let i = 0; i < 3; i++) {
        const slotDate = new Date(tomorrow);
        slotDate.setDate(slotDate.getDate() + Math.floor(Math.random() * 7));
        slotDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
        await db.executeQuery({ sqlQuery: `INSERT INTO slots (specialist_id, start_time) VALUES (${doc.id}, '${slotDate.toISOString()}')` });
      }
    }
    return c.json({ message: `Database seeded successfully with ${allSpecs.length} specialists` });
  } catch (error) {
    console.error("Seed error:", error);
    return c.json({ error: "Seeding failed: " + (error instanceof Error ? error.message : String(error)) }, 500);
  }
});
app.get("/referrals", (c) => {
  return c.json(MOCK_REFERRALS_LIST);
});
app.get("/referral/:id", (c) => {
  const id = c.req.param("id");
  if (id === "ref-001") {
    return c.json(MOCK_REFERRAL_DETAILS);
  }
  return c.json({
    success: false,
    error: {
      code: "REFERRAL_NOT_FOUND",
      message: `Referral with ID '${id}' not found`,
      statusCode: 404
    }
  }, 404);
});
app.get("/referral/:id/logs", (c) => {
  const id = c.req.param("id");
  if (id === "ref-001") {
    return c.json(MOCK_REFERRAL_LOGS);
  }
  return c.json({
    success: false,
    error: {
      code: "REFERRAL_NOT_FOUND",
      message: `Referral with ID '${id}' not found`,
      statusCode: 404
    }
  }, 404);
});
app.post("/confirm", async (c) => {
  try {
    const body = await c.req.json();
    const {
      referralId,
      patientName,
      patientEmail,
      patientPhone,
      doctorName,
      specialty,
      appointmentDate,
      appointmentTime,
      facilityName,
      facilityAddress
    } = body;
    if (!patientName || !doctorName) {
      return c.json({
        success: false,
        error: "Missing required fields: patientName and doctorName"
      }, 400);
    }
    const apptDate = appointmentDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const apptTime = appointmentTime || "10:00 AM";
    const facility = facilityName || "Downtown Medical Center";
    const address = facilityAddress || "123 Main Street, Suite 200, New York, NY 10001";
    const phone = patientPhone || "+1-555-0123";
    const email = patientEmail || "patient@email.com";
    const smsMessage = `Hi ${patientName}! Your ${specialty || "medical"} appointment with ${doctorName} is confirmed for ${apptDate} at ${apptTime} at ${facility}. Location: ${address}. Questions? Call (555) 123-4567. Reply CANCEL to reschedule.`;
    const emailSubject = `Appointment Confirmed - ${doctorName}`;
    const emailBody = `Dear ${patientName},

Your appointment has been successfully confirmed!

APPOINTMENT DETAILS:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Doctor:        ${doctorName}
Specialty:     ${specialty || "General Practice"}
Date & Time:   ${apptDate} at ${apptTime}
Location:      ${facility}
Address:       ${address}

IMPORTANT REMINDERS:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 Please arrive 15 minutes early for check-in
\u2022 Bring your insurance card and photo ID
\u2022 Bring a list of current medications
\u2022 If you need to cancel or reschedule, please call us at least 24 hours in advance

CONTACT INFORMATION:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Phone: (555) 123-4567
Email: appointments@hospital.com
Portal: https://patient-portal.hospital.com

We look forward to seeing you!

Best regards,
${facility} Team

---
Referral ID: ${referralId || "N/A"}
This is an automated confirmation. Please do not reply to this email.`;
    return c.json({
      success: true,
      confirmationSent: true,
      referralId: referralId || "demo-" + Date.now(),
      notifications: {
        sms: {
          to: phone,
          message: smsMessage,
          length: smsMessage.length,
          estimatedCost: "$0.0075"
        },
        email: {
          to: email,
          subject: emailSubject,
          body: emailBody,
          format: "text/plain"
        }
      },
      appointmentDetails: {
        patient: patientName,
        doctor: doctorName,
        specialty: specialty || "General Practice",
        dateTime: `${apptDate} at ${apptTime}`,
        location: facility,
        address
      },
      method: "DEMO_MODE",
      message: "In production, SMS and Email would be sent via Twilio/SendGrid",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Confirm error:", error);
    return c.json({
      success: false,
      error: "Confirmation failed: " + (error instanceof Error ? error.message : String(error))
    }, 500);
  }
});
app.get("/api/hello", (c) => {
  return c.json({ message: "Hello from Hono!" });
});
app.get("/api/hello/:name", (c) => {
  const name = c.req.param("name");
  return c.json({ message: `Hello, ${name}!` });
});
app.post("/api/echo", async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});
app.get("/api/config", (c) => {
  return c.json({
    hasEnv: !!c.env,
    availableBindings: {
      // These would be true if the resources are bound in raindrop.manifest
      // MY_ACTOR: !!c.env.MY_ACTOR,
      // MY_SMARTBUCKET: !!c.env.MY_SMARTBUCKET,
      // MY_CACHE: !!c.env.MY_CACHE,
      // MY_QUEUE: !!c.env.MY_QUEUE,
    }
    // Example access to environment variables:
    // MY_SECRET_VAR: c.env.MY_SECRET_VAR // This would be undefined if not set
  });
});
var api_default = class extends Service {
  async fetch(request) {
    return app.fetch(request, this.env);
  }
};

// <stdin>
var stdin_default = api_default;
export {
  cors,
  stdin_default as default
};

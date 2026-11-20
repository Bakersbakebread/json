export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

export type ParseResult =
  | { ok: true; value: Json }
  | { ok: false; message: string; line?: number; column?: number; offset?: number }

export function parse(text: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (error) {
    const message = (error as Error).message
    // Chromium: "... at position 42 (line 3 column 5)". Firefox: "... at line 3 column 5 of the JSON data".
    const lc = /line (\d+) column (\d+)/.exec(message)
    const pos = /position (\d+)/.exec(message)
    let line = lc ? Number(lc[1]) : undefined
    let column = lc ? Number(lc[2]) : undefined
    let offset = pos ? Number(pos[1]) : undefined
    if (offset === undefined && line && column) offset = offsetOf(text, line, column)
    if (offset === undefined) offset = findErrorOffset(text)
    if (offset !== undefined && !line) ({ line, column } = lineColumnOf(text, offset))
    const clean = message
      .replace(/^JSON\.parse: /, '')
      .replace(/ (at|in JSON at) .*$/, '')
      .replace(/, .*" is not valid JSON$/s, '')
    return { ok: false, message: clean, line, column, offset }
  }
}

// Browsers omit the position for some errors (Chromium: "Unexpected token ','"), so walk
// the text with a minimal JSON scanner and report where it first goes wrong.
const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y

function findErrorOffset(t: string): number | undefined {
  let i = 0
  const fail = (): never => {
    throw i
  }
  const ws = () => {
    while (i < t.length && ' \t\n\r'.includes(t[i]!)) i++
  }
  const string = () => {
    i++
    while (i < t.length) {
      const c = t[i]!
      if (c === '"') return void i++
      if (c < ' ') fail()
      if (c === '\\') {
        i++
        if (t[i] === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(t.slice(i + 1, i + 5))) fail()
          i += 4
        } else if (!'"\\/bfnrt'.includes(t[i] ?? '')) fail()
      }
      i++
    }
    fail()
  }
  const value = (): void => {
    ws()
    const c = t[i]
    if (c === '{' || c === '[') {
      const close = c === '{' ? '}' : ']'
      i++
      ws()
      if (t[i] === close) return void i++
      for (;;) {
        ws()
        if (c === '{') {
          if (t[i] !== '"') fail()
          string()
          ws()
          if (t[i] !== ':') fail()
          i++
        }
        value()
        ws()
        if (t[i] === ',') i++
        else if (t[i] === close) return void i++
        else fail()
      }
    }
    if (c === '"') return string()
    for (const word of ['true', 'false', 'null']) if (t.startsWith(word, i)) return void (i += word.length)
    NUMBER.lastIndex = i
    const m = NUMBER.exec(t)
    if (!m) fail()
    i += m![0].length
  }
  try {
    value()
    ws()
    if (i < t.length) fail()
  } catch (e) {
    if (typeof e === 'number') return Math.min(e, t.length - 1)
  }
  return undefined
}

function lineColumnOf(text: string, offset: number) {
  const before = text.slice(0, offset).split('\n')
  return { line: before.length, column: before[before.length - 1]!.length + 1 }
}

function offsetOf(text: string, line: number, column: number) {
  const lines = text.split('\n')
  let offset = 0
  for (let i = 0; i < line - 1 && i < lines.length; i++) offset += lines[i]!.length + 1
  return offset + column - 1
}

export function isContainer(value: Json): value is Json[] | { [key: string]: Json } {
  return typeof value === 'object' && value !== null
}

export function entries(value: Json[] | { [key: string]: Json }): [string | number, Json][] {
  return Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value)
}

export function childPath(parent: string, key: string | number) {
  if (typeof key === 'number') return `${parent}[${key}]`
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`
}

export function sortKeys(value: Json): Json {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (!isContainer(value)) return value
  return Object.fromEntries(
    Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => [k, sortKeys(value[k]!)]),
  )
}

/** Visits every node depth first with its path and depth. */
export function walk(value: Json, visit: (value: Json, path: string, depth: number, key: string | number | null, ancestors: string[]) => void) {
  const go = (v: Json, path: string, depth: number, key: string | number | null, ancestors: string[]) => {
    visit(v, path, depth, key, ancestors)
    if (!isContainer(v)) return
    const next = [...ancestors, path]
    for (const [k, child] of entries(v)) go(child, childPath(path, k), depth + 1, k, next)
  }
  go(value, '$', 0, null, [])
}

export function stats(value: Json) {
  let nodes = 0
  let depth = 0
  walk(value, (_, __, d) => {
    nodes++
    if (d > depth) depth = d
  })
  return { nodes, depth }
}

export function typeOf(value: Json) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

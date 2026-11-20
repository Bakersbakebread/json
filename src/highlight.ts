// Turns JSON.stringify output into highlighted HTML. The input is always our own
// stringify output, so the token regex can assume well-formed JSON. Escaping runs
// first and leaves quotes and backslashes alone, so string tokens still match.

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g

export function highlight(json: string) {
  return json
    .replace(/[&<>]/g, (c) => ESCAPES[c]!)
    .replace(TOKEN, (_, str: string, colon: string, num: string, lit: string, punct: string) => {
      if (str && colon) return `<span class="font-semibold">${str}</span><span class="text-muted">${colon}</span>`
      if (str) return `<span class="text-code-string">${str}</span>`
      if (num || lit) return `<span class="text-code-literal">${num ?? lit}</span>`
      return `<span class="text-muted">${punct}</span>`
    })
}

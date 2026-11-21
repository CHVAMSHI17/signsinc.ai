// Text -> ISL demonstration sequence processing.
//
// This is deterministic, rule-based keyword mapping: it is deliberately simple
// and transparent so the demo can explain exactly what it did. A future version
// could replace the mapping step with a generative ISL model.

import { VOCABULARY, STOPWORDS } from '../data/vocabulary.js'

// Tokenise while keeping simple word boundaries.
function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

// Very small suffix-stripping so "computers"/"learning" reach the base sign.
function stem(word) {
  if (word.length <= 3) return word
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3)
  if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2)
  if (word.endsWith('es') && !word.endsWith('ses')) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

const SINGLE = new Map()
for (const entry of VOCABULARY) {
  for (const alias of entry.aliases) {
    if (!alias.includes(' ')) SINGLE.set(alias, entry.id)
  }
}
const PHRASE_MAP = new Map()
for (const entry of VOCABULARY) {
  for (const alias of entry.aliases) {
    if (alias.includes(' ')) PHRASE_MAP.set(alias, entry.id)
  }
}

function lookup(token) {
  if (SINGLE.has(token)) return SINGLE.get(token)
  const s = stem(token)
  if (SINGLE.has(s)) return SINGLE.get(s)
  return null
}

/**
 * Process a sentence or paragraph.
 * Returns the original text plus a transparent breakdown of what matched.
 */
export function processText(text) {
  const tokens = tokenize(text)
  const matched = [] // { id, source, start, end }
  const unsupported = []
  let i = 0

  while (i < tokens.length) {
    let found = null
    // Try the longest phrase (up to 4 words) starting at position i.
    for (let len = Math.min(4, tokens.length - i); len >= 2; len -= 1) {
      const candidate = tokens.slice(i, i + len).join(' ')
      if (PHRASE_MAP.has(candidate)) {
        found = { id: PHRASE_MAP.get(candidate), source: candidate, len }
        break
      }
    }
    if (!found) {
      const id = lookup(tokens[i])
      if (id) found = { id, source: tokens[i], len: 1 }
    }
    if (found) {
      const last = matched[matched.length - 1]
      if (!last || last.id !== found.id) {
        matched.push({ id: found.id, source: found.source })
      }
      i += found.len
      continue
    }
    const token = tokens[i]
    if (!STOPWORDS.has(token) && token.length > 1 && !/^\d+$/.test(token)) {
      if (!unsupported.includes(token)) unsupported.push(token)
    }
    i += 1
  }

  const sequence = matched.map((m) => m.id)
  const coverage = tokens.length ? matched.reduce((sum, m) => sum + m.source.split(' ').length, 0) / tokens.length : 0

  return {
    text: (text || '').trim(),
    tokens,
    keywords: matched,
    sequence,
    unsupported,
    isPartial: unsupported.length > 0,
    coverage,
  }
}

export const UNSUPPORTED_MESSAGE = 'Some words are outside the current demonstration vocabulary.'
export const ISL_DISCLAIMER =
  'Demonstration only: this is not grammatically accurate ISL. It shows one sign demo per supported keyword, in English word order.'

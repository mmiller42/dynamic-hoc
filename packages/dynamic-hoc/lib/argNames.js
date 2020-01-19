import { createRange } from './range.js'

export const getArgNames = argNamesOrArity =>
  Array.isArray(argNamesOrArity)
    ? argNamesOrArity
    : createRange(0, argNamesOrArity - 1)

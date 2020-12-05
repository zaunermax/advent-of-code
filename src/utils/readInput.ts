import { readFileSync } from "fs"
// @ts-ignore couldn't get it to work with default import 🙄
import * as getCallerFile from "get-caller-file"

export const readInput = () => {
  const file = getCallerFile()
    .split("/")
    .slice(0, -1)
    .concat("input.txt")
    .join("/")

  return readFileSync(file).toString()
}

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeShare(data: any) {
  return compressToEncodedURIComponent(
    JSON.stringify(data)
  )
}

export function decodeShare(str: string) {
  const decoded = decompressFromEncodedURIComponent(str)
  return decoded ? JSON.parse(decoded) : null
}
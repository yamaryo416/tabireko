export type FlashKind = "success" | "failed"

export type Flash = {
  kind: FlashKind
  message: string
}

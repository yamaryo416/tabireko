"use client"

import { usePublicFetch } from "@/hooks/use-public-fetch"
import { ReactNode } from "react"

type PropsType = {
  children: ReactNode
}

export const PublicLayout = ({ children }: PropsType) => {
  usePublicFetch()
  return children
}

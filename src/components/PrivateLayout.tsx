"use client"

import { useFetch } from "@/hooks/use-fetch"
import { ReactNode } from "react"

type PropsType = {
  children: ReactNode
}

export const PrivateLayout = ({ children }: PropsType) => {
  useFetch()
  return children
}

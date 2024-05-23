"use client"

import { Button, Input } from "@nextui-org/react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { login, signup } from "./action"

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (formData: FormData) => {
    setLoading(true)
    login(formData)
    try {
      await login(formData)
    } catch {
      setLoading(false)
      setError("ログインに失敗しました")
    }
  }

  const handleSignup = async (formData: FormData) => {
    setLoading(true)
    login(formData)
    try {
      await signup(formData)
    } catch {
      setError("登録に失敗しました")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error === "") return
    setTimeout(() => {
      setError("")
    }, 5000)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-col items-center justify-center">
        <Image
          alt="ロゴ"
          src="/images/logo.png"
          width={200}
          height={50}
          className="mb-7"
        />
        {error !== "" && (
          <div className="p-5 bg-red-400 text-white rounded-lg mb-3">
            {error}
          </div>
        )}
        <Input
          label="Email"
          labelPlacement="outside"
          name="email"
          type="email"
          variant="underlined"
          required
        />
        <Input
          label="Password"
          labelPlacement="outside"
          name="password"
          type="password"
          variant="underlined"
          required
        />
        <Button
          type="submit"
          formAction={handleLogin}
          color="primary"
          className="mt-10"
          isDisabled={loading}
          isLoading={loading}
        >
          ログイン
        </Button>
        <Button
          type="submit"
          formAction={handleSignup}
          color="success"
          className="mt-2 text-white"
          isDisabled={loading}
          isLoading={loading}
        >
          会員登録
        </Button>
      </form>
    </div>
  )
}

export default LoginPage

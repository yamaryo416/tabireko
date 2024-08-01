"use client"

import { Button, Input } from "@nextui-org/react"
import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react"

import { supabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Head from "next/head"

const LoginPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState({
    email: "",
    password: "",
  })

  const changeUser = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleLogin = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword(user)

    if (error != null) {
      setLoading(false)
      setError("ログインに失敗しました")
      return
    }

    router.push("/")
  }

  const handleSignup = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signUp(user)

    if (error != null) {
      setLoading(false)
      setError("会員登録に失敗しました")
      return
    }

    router.push("/")
  }

  useEffect(() => {
    if (error === "") return
    setTimeout(() => {
      setError("")
    }, 5000)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>旅ろぐ</title>
      </Head>
      <form className="flex flex-col items-center justify-center">
        <Image
          alt="ロゴ"
          src="/images/logo.png"
          width={200}
          height={50}
          className="mb-7"
        />
        {error !== "" && (
          <div className="mb-3 rounded-lg bg-red-400 p-5 text-white">
            {error}
          </div>
        )}
        <Input
          label="Email"
          labelPlacement="outside"
          name="email"
          type="email"
          variant="underlined"
          value={user.email}
          onChange={changeUser}
          required
        />
        <Input
          label="Password"
          labelPlacement="outside"
          name="password"
          type="password"
          variant="underlined"
          value={user.password}
          onChange={changeUser}
          required
        />
        <Button
          type="button"
          onClick={handleLogin}
          color="primary"
          className="mt-10"
          isDisabled={loading}
          isLoading={loading}
        >
          ログイン
        </Button>
        <Button
          type="button"
          onClick={handleSignup}
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

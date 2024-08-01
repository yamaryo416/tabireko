import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "./utils/supabase/server"

export const middleware = async (request: NextRequest) => {
  const supabase = createClient()
  const userData = await supabase.auth.getUser()
  if (userData?.data?.user == null) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}

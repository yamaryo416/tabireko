import Image from "next/image"

export const Header = () => {
  return (
    <div className="bg-amber-50 fixed left-0 right-0 top-0 flex justify-center items-center py-2 z-[10000]">
      <Image alt="ロゴ" src="/images/logo.png" width={100} height={25} />
    </div>
  )
}

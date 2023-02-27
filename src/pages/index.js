import Sidebar from "@/components/Sidebar/Sidebar"
import SEO from "../SEO/SEO"

export default function Home() {
  return (
    <>
      <SEO />

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
      </main>
    </>
  )
}

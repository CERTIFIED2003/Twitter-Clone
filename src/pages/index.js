import Feeds from "@/components/Feeds/Feeds";
import Sidebar from "@/components/Sidebar/Sidebar";
import SEO from "../SEO/SEO";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "@/components/Login/Login";
import { useState } from "react";
import Modal from "@/modals/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import Widgets from "@/components/Widgets/Widgets";

export default function Home({ providers, trendingResults }) {
  const { data: session } = useSession();
  const [showSide, setShowSide] = useState(false);
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return (
    <>
      <SEO login />
      <Login providers={providers} />
    </>
  )

  return (
    <>
      <SEO />

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar showSide={showSide} />
        <Feeds showSide={showSide} setShowSide={setShowSide} />
        <Widgets trendingResults={trendingResults} />

        {isOpen && <Modal />}
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch(`https://newsapi.org/v2/everything?q=keyword&apiKey=${process.env.NEXT_PUBLIC_NEWS_API}`)
    .then(
      (res) => res.json()
    );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
      trendingResults
    },
  };
}
import Feeds from "@/components/Feeds/Feeds";
import Sidebar from "@/components/Sidebar/Sidebar";
import SEO from "../SEO/SEO";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "@/components/Login/Login";

export default function Home({ providers, trendingResults, followResults }) {
  const { data: session } = useSession();

  if (!session) return (
    <>
      <SEO login={true} />
      <Login providers={providers} />
    </>
  )

  return (
    <>
      <SEO />

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feeds />
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch("https://www.jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://www.jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
      trendingResults,
      followResults
    },
  };
}


  // const trendingPosts = [
  //   {
  //     "heading": "T20 World Cup 2021 · LIVE",
  //     "description": "NZvAUS: New Zealand and Australia clash in the T20 World Cup final",
  //     "img": "https://rb.gy/d9yjtu"
  //   },
  //   {
  //     "heading": "Trending in United Arab Emirates",
  //     "description": "#earthquake",
  //     "img": "https://rb.gy/jvuy4v"
  //   },
  //   {
  //     "heading": "Trending in Digital Creators",
  //     "description": "tubbo and quackity",
  //     "img": ""
  //   }
  // ];
  // const followResults = [
  //   { "userImg": "https://rb.gy/urakiy", "username": "SpaceX", "tag": "@SpaceX" },
  //   { "userImg": "https://rb.gy/aluxgh", "username": "Elon Musk", "tag": "@elonmusk" },
  //   { "userImg": "https://rb.gy/zyvazm", "username": "Tesla", "tag": "@Tesla" }
  // ];
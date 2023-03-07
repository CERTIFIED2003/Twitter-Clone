import { modalState } from "@/atoms/modalAtom";
import Login from "@/components/Login/Login";
import Sidebar from "@/components/Sidebar/Sidebar";
import SEO from "@/SEO/SEO";
import { getProviders, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Modal from "@/modals/Modal";
import { useRouter } from "next/router";
import { database } from "@/firebase/firebase";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import NoPage from "./404";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Post from "@/components/Feeds/Post";
import Comment from "@/components/Comment/Comment";
import Widgets from "@/components/Widgets/Widgets";


export default function PostPage({ providers, trendingResults }) {
    const { data: session } = useSession();
    const [showSide, setShowSide] = useState(false);
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        onSnapshot(doc
            (database, "posts", id),
            (snapshot) => setPost(snapshot.data())
        )
    }, [database]);

    useEffect(() => {
        onSnapshot(query(
            collection(database, "posts", id, "comments"),
            orderBy("timestamp", "desc")),
            (snapshot) => setComments(snapshot.docs)
        )
    }, [database, id]);

    if (!post) return <NoPage />

    if (!session) return (
        <>
            <SEO login />
            <Login providers={providers} />
        </>
    )

    return (
        <>
            <SEO postPage post={post} />

            <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
                <Sidebar showSide={showSide} />

                <div className="flex-grow border-l border-r border-gray-700 max-w-2xl md:ml-[73px] xl:ml-[370px]">
                    <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
                        <div className=" hoverWhiteAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                            onClick={() => router.push("/")}
                        >
                            <ArrowLeftIcon className="h-5 text-white" />
                        </div>
                        Tweet
                    </div>

                    <Post id={id} post={post} postPage />

                    {comments.length > 0 && (
                        <div className="pb-72 p-4">
                            <h4 className="text-[#d9d9d9] underline">
                                Comments
                            </h4>
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    id={comment.id}
                                    comment={comment.data()}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Widgets trendingResults={trendingResults} />

                {isOpen && <Modal />}
            </main>
        </>
    )
}

export async function getServerSideProps() {
    const trendingResults = await fetch(`https://newsapi.org/v2/everything?q=keyword&apiKey=${process.env.NEXT_PUBLIC_NEWS_API}`)
        .then(
            (res) => res.json()
        );
    const providers = await getProviders();
    return {
        props: {
            providers,
            trendingResults
        },
    };
}
import { modalState } from "@/atoms/modalAtom";
import Login from "@/components/Login/Login";
import Sidebar from "@/components/Sidebar/Sidebar";
import SEO from "@/SEO/SEO";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Modal from "@/modals/Modal";
import { useRouter } from "next/router";
import { database } from "@/firebase/firebase";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";


export default function PostPage({ providers }) {
    const { data: session } = useSession();
    const [showSide, setShowSide] = useState(false);
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        onSnapshot(doc(database, "posts", id), (snapshot) => setPost(snapshot.data()))
    }, [database]);

    useEffect(() => {
        onSnapshot(query(collection(database, "posts", id, "comments"), orderBy("timestamp", "desc")), (snapshot) => setComments(snapshot.docs))
    }, [database, id]);

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

                {isOpen && <Modal />}
            </main>
        </>
    )
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers
        },
    };
}
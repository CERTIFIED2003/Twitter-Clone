import { database } from "@/firebase/firebase";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Input from "../Input/Input";
import Post from "./Post";


export default function Feeds({ showSide, setShowSide }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        onSnapshot(
            query(collection(database, "posts"), orderBy("timestamp", "desc")),
            (snapshot) => {
                setPosts(snapshot.docs);
            }
        )
    }, [database]);

    return (
        // <div className="text-white flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
        <div className={`text-white flex-grow border-l border-r border-gray-700 max-w-2xl ${showSide && "ml-[40px]"} sm:ml-[73px] xl:ml-[370px]`}>
            <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold">Home</h2>
                <div className="hoverSidebarAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto"
                    onClick={() => setShowSide(prev => !prev)}
                >
                    <SparklesIcon className="h-5 text-white" />
                </div>
            </div>

            <Input />

            <div className="pb-72">
                {posts.map(post => (
                    <Post key={post.id} id={post.id} post={post.data()}/>
                ))}
            </div>
        </div>
    )
}
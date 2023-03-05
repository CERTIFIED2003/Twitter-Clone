import Moment from "react-moment";
import {
    EllipsisHorizontalIcon,
    ChatBubbleBottomCenterTextIcon,
    TrashIcon,
    HeartIcon as HeartOutline,
    ShareIcon,
    ChartBarIcon,
    // ChartBarIcon
} from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { database } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { commentState, likeState, modalState, postIdState } from "@/atoms/modalAtom";
import { RWebShare } from "react-web-share";


export default function Post({ id, post, postPage }) {
    const { data: session } = useSession();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const router = useRouter();
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [commentOpen, setCommentOpen] = useRecoilState(commentState);
    const [likeOpen, setLikeOpen] = useRecoilState(likeState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        onSnapshot(collection(database, "posts", id, "likes"), (snapshot) => setLikes(snapshot.docs))
    }, [database, id]);

    useEffect(() => {
        setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    }, [likes]);

    useEffect(() => {
        onSnapshot(
            query(collection(database, "posts", id, "comments"), orderBy("timestamp", "desc")), (snapshot) => setComments(snapshot.docs)
        )
    }, [database, id]);

    const likePost = async () => {
        try {
            if (liked) {
                await deleteDoc(doc(database, "posts", id, "likes", session.user.uid));
            } else {
                await setDoc(doc(database, "posts", id, "likes", session.user.uid), {
                    userName: session.user.name,
                    userImg: session.user.image,
                    userTag: session.user.tag,
                });
            }
        }
        catch (error) {
            error.message;
        }
    };

    return (
        <div className="p-3 flex cursor-pointer border-b border-gray-700" onClick={() => router.push(`/${id}`)}>
            {!postPage && (
                <img src={post?.userImg} className="h-8 w-8 md:h-11 md:w-11 rounded-full mr-1 md:mr-4" alt="Profile Photo" />
            )}
            <div className="flex flex-col space-y-2 w-full">
                <div className={`flex ${!postPage && "justify-between"}`}>
                    {postPage && (
                        <img src={post?.userImg} className="h-11 w-11 rounded-full mr-4" alt="Profile Photo" />
                    )}

                    <div className="text-[#6e767d]">
                        <div className="inline-block group">
                            <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${!postPage && "inline-block"}`}>
                                {post?.username}
                            </h4>
                            <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>{`@${post?.tag}`}</span>
                        </div>

                        {" "}•{" "}

                        <span className="hover:underline text-sm sm:text-[15px]">
                            <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                        </span>

                        {!postPage && (
                            <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">{post?.text}</p>
                        )}
                    </div>

                    <div className="icon hidden md:flex group flex-shrink-0 ml-auto">
                        <EllipsisHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                    </div>
                </div>

                {postPage && <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">{post?.text}</p>}

                {post?.image && <img src={post.image} className="rounded-2xl max-h-[700px] mr-2 object-cover" alt="Post" />}

                <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && "mx-auto"}`}>
                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            likePost();
                        }}
                    >
                        <div className="icon group-hover:bg-pink-600/10">
                            {liked ? (
                                <HeartSolid className="h-5 text-pink-600" />
                            ) : (
                                <HeartOutline className="h-5 group-hover:text-pink-600" />
                            )}
                        </div>
                        {likes.length > 0 && (
                            <span
                                className={`group-hover:text-pink-600 text-sm ${liked && "text-pink-600"
                                    }`}
                            >
                                {likes.length}
                            </span>
                        )}
                    </div>

                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPostId(id);
                            setIsOpen(true);
                            setCommentOpen(true);
                            setLikeOpen(false);
                        }}
                    >
                        <div className="icon group-hover:bg-[#FFFF00] group-hover:bg-opacity-10">
                            <ChatBubbleBottomCenterTextIcon className="h-5 group-hover:text-[#FFFF00]" />
                        </div>
                        {comments.length > 0 && (
                            <span className="group-hover:text-[#FFFF00] text-sm">
                                {comments.length}
                            </span>
                        )}
                    </div>

                    {session.user.uid === post?.id && (
                        <div
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(database, "posts", id));
                                router.push("/");
                            }}
                        >
                            <div className="icon group-hover:bg-red-600/10">
                                <TrashIcon className="h-5 group-hover:text-red-600" />
                            </div>
                        </div>
                    )}

                    <div className="icon group" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <RWebShare
                            data={{
                                text: `${post?.text}`,
                                url: `https://tclone.vercel.app/${id}`,
                                title: `Share this post from ${post?.username}`
                            }}
                            onClick={() => console.log('Share Post')}
                        >
                            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
                        </RWebShare>
                    </div>

                    <div className="icon group"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPostId(id);
                            setIsOpen(true);
                            setLikeOpen(true);
                            setCommentOpen(false);
                        }}
                    >
                        <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>
                </div>
            </div>
        </div >
    )
}
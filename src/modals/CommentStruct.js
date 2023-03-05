import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react';
import Moment from 'react-moment';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { postIdState } from "@/atoms/modalAtom";
import { database, storage } from "@/firebase/firebase";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from 'recoil';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';


export default function CommentStruct({ setCommentOpen, setIsOpen }) {
    const { data: session } = useSession();
    const [comment, setComment] = useState("");
    const [postId, setPostId] = useRecoilState(postIdState);
    const [post, setPost] = useState();
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onSnapshot(doc(database, "posts", postId), (snapshot) => setPost(snapshot.data()));
    }, [database]);

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
        reader.onload = (readerEvent) => {
            setFile(readerEvent.target.result);
        }
    };

    const sendComment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = await addDoc(collection(database, "posts", postId, "comments"), {
                comment: comment,
                username: session.user.name,
                tag: session.user.tag,
                userImg: session.user.image,
                timestamp: serverTimestamp(),
            });

            const imageRef = ref(storage, `comments/${docRef.id}/image`);
            if (file) {
                await uploadString(imageRef, file, "data_url").then(async () => {
                    const downloadURL = await getDownloadURL(imageRef);
                    await updateDoc(doc(database, "posts", postId, "comments", docRef.id), {
                        image: downloadURL,
                    });
                });
            }
            setLoading(false);
            setCommentOpen(false);
            setIsOpen(false);
            setComment("");
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            router.push(`/${postId}`);
        }
    };

    return (
        <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div className="flex items-center px-1.5 py-2 border-b border-gray-700 ">
                <div className="hoverWhiteAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                    onClick={() => {
                        setCommentOpen(false);
                        setIsOpen(false);
                    }}
                >
                    <XMarkIcon className="h-[22px] text-white" />
                </div>
                <span className="text-[#d9d9d9]">Tweet</span>
            </div>
            <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                    <div className="text-[#6e767d] flex gap-x-3 relative">
                        <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                        <img src={post?.userImg} className="h-11 w-11 rounded-full" alt="Post Creator" />
                        <div>
                            <div className="inline-block group">
                                <h4 className="font-bold text-[15px] sm:text-base text-[#d9d9d9] inline-block">
                                    {post?.username}
                                </h4>
                                <span className="ml-1.5 text-sm sm:text-[15px]">
                                    {`@${post?.tag}`}
                                </span>
                            </div>
                            {" "}•{" "}
                            <span className="hover:underline text-sm sm:text-[15px]">
                                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                            </span>
                            <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                                {post?.text}
                            </p>
                        </div>
                    </div>
                    <div className="mt-7 flex space-x-3 w-full">
                        <img src={session.user.image} className="h-11 w-11 rounded-full" alt="User" />
                        <div className="flex-grow mt-2">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tweet your reply"
                                rows="2"
                                className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                            />
                            {file && (
                                <div className="relative">
                                    <div
                                        className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                                        onClick={() => setFile(null)}
                                    >
                                        <XMarkIcon className="text-white h-5" />
                                    </div>
                                    <img
                                        src={file}
                                        className="rounded-2xl max-h-80 object-contain"
                                        alt="Post Image"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2.5">
                                <div className="flex items-center">
                                    <div className="icon" onClick={() => fileRef.current.click()}>
                                        <PhotoIcon className="text-[#1d9bf0] h-[22px]" />
                                        <input type="file" hidden onChange={addImageToPost} ref={fileRef} />
                                    </div>
                                </div>
                                <button
                                    className={`bg-[#1d9bf0] text-white rounded-full px-4 py-1 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default`}
                                    type="submit"
                                    onClick={sendComment}
                                    disabled={!comment.trim() && !file}
                                >
                                    {loading ? "Replying" : "Reply"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
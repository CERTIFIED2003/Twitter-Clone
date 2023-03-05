import { commentState, likeState, modalState, postIdState } from "@/atoms/modalAtom";
import { database } from "@/firebase/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { doc, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import CommentStruct from "./CommentStruct";
import LikeStruct from "./LikeStruct";


export default function CommentModal() {
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [commentOpen, setCommentOpen] = useRecoilState(commentState);
    const [likeOpen, setLikeOpen] = useRecoilState(likeState);
    const [post, setPost] = useState();
    const [postId, setPostId] = useRecoilState(postIdState);

    useEffect(() => {
        onSnapshot(doc(database, "posts", postId), (snapshot) => setPost(snapshot.data()));
    }, [database]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpen}>
                <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[#00acee] bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div>
                            {commentOpen && <CommentStruct
                                setCommentOpen={setCommentOpen}
                                setIsOpen={setIsOpen}
                                post={post}
                            />}
                            {likeOpen && <LikeStruct setLikeOpen={setLikeOpen} setIsOpen={setIsOpen} />}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
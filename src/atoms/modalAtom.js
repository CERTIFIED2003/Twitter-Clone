import { atom } from "recoil";


export const modalState = atom({
    key: "modalState",
    default: false,
});

export const commentState = atom({
    key: "commentState",
    default: false,
});

export const likeState = atom({
    key: "likeState",
    default: false,
});

export const postIdState = atom({
    key: "postIdState",
    default: "",
});

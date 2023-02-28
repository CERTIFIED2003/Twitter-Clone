import { XMarkIcon, PhotoIcon, ChartBarIcon, CalendarIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import Picker from "emoji-picker-react";

export default function Input() {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const fileRef = useRef(null);

    const addImageToPost = () => {

    };

    return (
        <div className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll`} style={{ overflow: "hidden" }}>
            <img
                src="https://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png"
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
            />
            <div className="w-full divide-y divide-gray-700">
                <div className={``}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your thoughts!"
                        className="w-full bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide min-h-[85px]"
                        rows={3}
                        style={{ overflow: "hidden" }}
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
                </div>
                <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center">
                        <div className="icon" onClick={() => fileRef.current.click()}>
                            <PhotoIcon className="h-[22px] text-[#1d9bf0]" />
                            <input type="file" hidden onChange={addImageToPost} ref={fileRef} />
                        </div>
                        <div className="icon rotate-90">
                            <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                        </div>

                        <div className="icon" onClick={() => setShowEmojis(prev => !prev)}>
                            <FaceSmileIcon className="text-[#1d9bf0] h-[22px]" />
                        </div>

                        <div className="icon">
                            <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                        </div>

                        {showEmojis && (
                            <Picker 
                                theme="dark"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
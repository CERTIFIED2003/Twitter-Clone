import { XMarkIcon } from '@heroicons/react/24/solid';

export default function LikeStruct({ setLikeOpen, setIsOpen }) {
  return (
    <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
      <div className="flex items-center px-1.5 py-2 border-b border-gray-700 ">
        <div className="hoverWhiteAnimation w-9 h-9 flex items-center justify-center xl:px-0"
          onClick={() => {
            setLikeOpen(false);
            setIsOpen(false);
          }}
        >
          <XMarkIcon className="h-[22px] text-white" />
        </div>
        <span className="text-[#d9d9d9]">Likes</span>
      </div>
      <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
        <div className="w-full">
          <div className="text-[#6e767d] flex gap-x-3 relative">
            <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
            {/* <img src={post?.userImg} className="h-11 w-11 rounded-full" alt="User" /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
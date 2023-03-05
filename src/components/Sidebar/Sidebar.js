import Image from "next/image";
import TwitterLogo from "../../assets/twitterLogo.png";
import { HomeIcon } from "@heroicons/react/24/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import SidebarLink from "./SidebarLink";
import { signOut, useSession } from "next-auth/react";


export default function Sidebar({ showSide }) {
  const { data: session } = useSession();

  return (
    // <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
    <div className={`${showSide ? "flex" : "hidden"} md:flex flex-col items-center w-[40px] md:w-auto xl:items-start xl:w-[340px] p-2 fixed h-full`}>
      <div className="flex items-center justify-center w-8 md:w-14 h-14 p-0 xl:ml-24 md:hoverAnimation">
        <Image
          src={TwitterLogo}
          onClick={() => { }}
          width={30}
          height={30}
          alt="Twitter Clone"
        />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} active />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={EllipsisHorizontalCircleIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-[#1DA1F2] text-white rounded-full w-56 h-[52px] text-lg font-bold hover:bg-white hover:text-[#1DA1F2] transition-all duration-300 ease-out">
        Tweet
      </button>
      <div className="text-[#d9d9d9] flex items-center justify-center mt-auto cursor-pointer xl:ml-auto xl:-mr-5"
        onClick={() => { signOut() }}
      >
        <img
          src={session.user.image}
          alt="Profile"
          className="h-5 w-5 md:h-8 md:w-8 rounded-full xl:mr-2.5 object-contain"
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold text-ellipsis">{session.user.name}</h4>
          <p className="text-[#6e767d]">{`@${session.user.tag}`}</p>
        </div>
        <EllipsisHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  )
}

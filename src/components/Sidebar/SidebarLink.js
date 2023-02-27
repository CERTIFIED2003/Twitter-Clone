import { useRouter } from "next/router"

export default function SidebarLink({ text, Icon, active }) {
    const router = useRouter();
    return (
        <div
            className={`text-[#d9d9d9] hover:text-black transition-all duration-300 ease-out flex items-center justify-center xl:justify-start text-xl space-x-3 hoverSidebarAnimation ${active && "font-bold"}`}
            onClick={() => active && router.push("/")}
        >
            <Icon className={`h-6 md:h-7`}/>
            <span className={`hidden xl:inline`}>{text}</span>
        </div>
    )
}
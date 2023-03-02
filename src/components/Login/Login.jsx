import Image from "next/image";
import TwitterLogo from "../../assets/twitterWhiteLogo.jpg";
import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <div className="">
            <Image
                src={TwitterLogo}
                className="object-contain"
                width={150}
                height={150}
                alt="Twitter"
            />
        </div>
    )
}

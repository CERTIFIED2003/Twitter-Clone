import Moment from "react-moment";


export default function Comment({ id, comment }) {

    return (
        <div className="p-3 flex border-b border-gray-700">
            <img src={comment?.userImg} className="h-11 w-11 rounded-full mr-4" alt="Commented By" />
            <div className="flex flex-col space-y-2 w-full">
                <div className="flex justify-between">
                    <div className="text-[#6e767d]">
                        <div className="inline-block group">
                            <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                                {comment?.username}
                            </h4>
                            <span className="ml-1.5 text-sm sm:text-[15px]">
                                @{comment?.tag}{" "}
                            </span>
                            {" "}•{" "}
                            <span className="hover:underline text-sm sm:text-[15px]">
                                <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
                            </span>
                            <p className="text-[#d9d9d9] mt-0.5 max-w-lg text-[15px] sm:text-base">
                                {comment?.comment}
                            </p>
                        </div>
                    </div>
                </div>
                {comment?.image && <img
                    src={comment.image}
                    className="rounded-2xl max-h-48 w-48 object-cover"
                    alt="Post Image"
                />}
            </div>
        </div>
    )
}
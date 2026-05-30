import Image from "next/image"

import type { ProjectAuthor }
from "@/app/lib/type/project"

import timeAgo from "@/app/utils/timeAgo"



type ProfilePreviewProps = {

    profile: ProjectAuthor

    created_at: string
}



export default function ProfilePreview({
    profile,
    created_at
}: ProfilePreviewProps) {
    
    return (

        <div className="flex items-center gap-3">

            <div className="avatar">

                <Image
                    src={
                        profile.avatar_url ||
                        "/default-avatar.png"
                    }
                    alt={profile.username}
                    width={48}
                    height={48}
                    className="
                        rounded-full
                        object-cover
                    "
                />

            </div>



            <div className="data">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <p className="
                        font-semibold
                        text-white
                    ">
                        {profile.username}
                    </p>

                    <p className="
                        text-zinc-400
                        text-sm
                    ">
                        • {timeAgo(created_at)}
                    </p>

                </div>



                <p className="
                    text-sm
                    text-zinc-400
                ">
                    {profile.location || "Unknown"}
                </p>

            </div>

        </div>
    )
}
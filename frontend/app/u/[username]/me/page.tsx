"use client"

import { useEffect, useState } from "react"

import api from "@/app/lib/api"

import ProfileHeader from "../components/ProfileHeader"
import { useUser  } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { ProfileData } from "@/types/profile"
import StacksAnalytics from "./components/StacksAnalytics"


export default function Profile() {

    const params = useParams()

    const username = params.username as string

    const [activeTab, setActiveTab] = useState("stacks")

    const [profileData, setProfileData] = useState<ProfileData | null>(null)

    const [loading, setLoading] = useState(true)
    const { user , isLoaded} = useUser()



    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await api.get(
                    `/profile/${username}`
                )

                setProfileData(response.data)

            } catch (err) {

                console.error(err)

            } finally {

                setLoading(false)

            }

        }

        getProfile()

    }, [username])
    if (!username) return


    if (loading || !isLoaded) {

        return <div>Loading...</div>

    }


    if (!profileData) {

        return <div>User not found</div>

    }




    return (

        <div>

            <div className="header">

                <ProfileHeader
                    profileData={profileData}
                    isOwner={
                            user?.id === profileData.clerk_user_id
                        }
                />

            </div>

            <div className="tabs">

                <button onClick={() => setActiveTab("stacks")}>
                    stacks
                </button>

                <button onClick={() => setActiveTab("projects")}>
                    projects
                </button>

                <button onClick={() => setActiveTab("live")}>
                    live
                </button>

                <button onClick={() => setActiveTab("posts")}>
                    posts
                </button>

                <button onClick={() => setActiveTab("contribution")}>
                    contribution
                </button>

            </div>

            <div className="body">
                {
                    activeTab === "stacks" && <StacksAnalytics />
                }


{/*                 
                    {activeTab === "posts" && <PostsPreview />}
                    {activeTab === "projects" && <ProjectsPreview />}
                    {activeTab === "live" && <LiveProjectsPreview />}
                   { activeTab === "contribution" && <ContributionPreview />}
                */}

            </div>

        </div>

    )

}
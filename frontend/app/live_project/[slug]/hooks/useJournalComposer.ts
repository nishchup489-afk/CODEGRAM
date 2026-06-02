"use client"

import { useState } from "react"


import type {
    GetLiveProjectJournal,
    JournalEntryType,
} from "../types/liveProject"

interface UseJournalComposerProps {

    currentDay: number

    baseProgress: number

    onPublish?: (
        entry: GetLiveProjectJournal
    ) => void

}



export default function useJournalComposer({

    currentDay,

    baseProgress,

    onPublish,

}: UseJournalComposerProps) {


    const [entryType, setEntryType] =
        useState<JournalEntryType>(
            "progress"
        )



    const [content, setContent] =
        useState("")



    const [progress, setProgress] =
        useState(baseProgress)



    const [mediaUrls, setMediaUrls] =
        useState<string[]>([])



    const [codeSnippets,
        setCodeSnippets] =
        useState([
            {
                language: "",
                code: "",
            }
        ])



    const [problemSolutions,
        setProblemSolutions] =
        useState([
            {
                problem: "",
                solution: "",
            }
        ])



    const [loading, setLoading] =
        useState(false)



    function resetComposer() {

        setEntryType("progress")

        setContent("")

        setProgress(baseProgress)

        setMediaUrls([])

        setCodeSnippets([
            {
                language: "",
                code: "",
            }
        ])

        setProblemSolutions([
            {
                problem: "",
                solution: "",
            }
        ])

    }



    function addCodeSnippet() {

        setCodeSnippets((prev) => [

            ...prev,

            {
                language: "",
                code: "",
            }

        ])

    }



    function removeCodeSnippet(
        index: number
    ) {

        setCodeSnippets((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        )

    }



    function updateCodeSnippet(
        index: number,
        field:
            | "language"
            | "code",
        value: string
    ) {

        setCodeSnippets((prev) =>
            prev.map((snippet, i) => {

                if (i !== index)
                    return snippet

                return {
                    ...snippet,
                    [field]: value,
                }

            })
        )

    }



    function addProblemSolution() {

        setProblemSolutions((prev) => [

            ...prev,

            {
                problem: "",
                solution: "",
            }

        ])

    }



    function removeProblemSolution(
        index: number
    ) {

        setProblemSolutions((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        )

    }



    function updateProblemSolution(
        index: number,
        field:
            | "problem"
            | "solution",
        value: string
    ) {

        setProblemSolutions((prev) =>
            prev.map((item, i) => {

                if (i !== index)
                    return item

                return {
                    ...item,
                    [field]: value,
                }

            })
        )

    }



    function addMediaUrl() {

        setMediaUrls((prev) => [
            ...prev,
            "",
        ])

    }



    function updateMediaUrl(
        index: number,
        value: string
    ) {

        setMediaUrls((prev) =>
            prev.map((url, i) => {

                if (i !== index)
                    return url

                return value

            })
        )

    }



    function removeMediaUrl(
        index: number
    ) {

        setMediaUrls((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        )

    }



    async function publishEntry() {

        if (!content.trim()) return



        try {

            setLoading(true)



            const payload:
                GetLiveProjectJournal = {

                id:
                    crypto.randomUUID(),

                day_number:
                    currentDay,

                entry_type:
                    entryType,

                content,

                progress_percentage:
                    progress,

                code_snippets:
                    codeSnippets.filter(
                        (snippet) =>
                            snippet.code.trim() !== ""
                    ),

                problem_solutions:
                    problemSolutions.filter(
                        (item) =>
                            item.problem.trim() !== ""
                    ),

                media_urls:
                    mediaUrls.filter(
                        (url) =>
                            url.trim() !== ""
                    ),

                likes_count: 0,

                comments_count: 0,

                created_at:
                    new Date().toISOString(),

            }



            onPublish?.(payload)



            resetComposer()

        }

        catch (error) {

            console.error(
                "Failed to publish journal entry:",
                error
            )

        }

        finally {

            setLoading(false)

        }

    }



    return {

        loading,



        entryType,
        setEntryType,



        content,
        setContent,



        progress,
        setProgress,



        mediaUrls,
        addMediaUrl,
        updateMediaUrl,
        removeMediaUrl,



        codeSnippets,
        addCodeSnippet,
        updateCodeSnippet,
        removeCodeSnippet,



        problemSolutions,
        addProblemSolution,
        updateProblemSolution,
        removeProblemSolution,



        publishEntry,
        resetComposer,

    }

}
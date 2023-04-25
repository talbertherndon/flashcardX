'use client'
import { Session } from "next-auth";
import { useEffect, useState } from 'react';
import { getFlaschard, getMyFlashcards } from "@/lib/api";
import { useRouter } from "next/navigation";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";


configureAbly({
    key: "Skazdw.ZqOX2g:kGG3M44jUA1aVJoaH3EtuMM131--kXfkP5u765_MhBU",
    clientId: "quickstart",
});

export default function FlashcardList({ session }: { session: any }) {
    console.log(session)
    const [channel] = useChannel(`${session?.user.id}`, (message) => {
        console.log(message.name);
        if (message.name) {
            getMyFlashcards(session?.user.id).then((res) => {
                console.log(res.data)
                setSets(res.data)
            })
        }

    });
    const [sets, setSets] = useState([])
    const router = useRouter();

    useEffect(() => {
        if (session) {
            getMyFlashcards(session.user.id).then((res) => {
                console.log(res.data)
                setSets(res.data)
            })
        }
    }, [session])

    function getFlashcardSetHandler(id: number) {
        router.push(`/${id}`)
        // getFlaschard(id).then((res) => {
        //     console.log(res.data)
        //     router.push(`/${id}`)
        // })
    }

    return (
        <div>
            <p className="text-lg font-semibold text-slate-800 p-4">{session?.user.credits} Credits Left</p>
            <div className="grid grid-cols-4 gap-4 p-4">
                {sets.map((res: any) => {
                    return (
                        <div key={res.id} onClick={() => {
                            getFlashcardSetHandler(res.id)
                        }} className="group relative mx-auto cursor-pointer overflow-hidden rounded-[4px] bg-gray-300 p-[1px] transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500">
                            <div className="group-hover:animate-spin-slow invisible absolute -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-hover:visible"></div>
                            <div className="relative rounded-[15px] bg-white p-6">
                                <div className="space-y-4">
                                    <img src="https://nuxt.com/assets/home/ux-fast-light.svg" alt="" />
                                    <p className="text-lg font-semibold text-slate-800">{res.name}</p>
                                    {/* <p className="font-md text-slate-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus temporibus est ut nisi nam at adipisci sunt dolore quibusdam.</p> */}
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
            <div>
       
                {sets.length == 7 &&
                    <p className="text-lg font-semibold text-slate-800">You have reached the max of set your can create</p>
                }
            </div>
        </div>
    )
}
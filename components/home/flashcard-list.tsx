'use client'
import { Session } from "next-auth";
import { useEffect, useState } from 'react';
import { getFlaschard, getMyFlashcards } from "@/lib/api";

export default function FlashcardList({ session }: { session: Session | null }) {
    const [sets, setSets] = useState([])
    useEffect(() => {
        if (session) {
            getMyFlashcards(session.user.id).then((res) => {
                console.log(res.data)
                setSets(res.data)
            })
        }
    }, [session])

    function getFlashcardSetHandler(id: number) {
        getFlaschard(id).then((res) => {
            console.log(res.data)
        })

    }

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 p-4">
                {sets.map((res:any) => {
                    return (
                        <div key={res.id} onClick={() => {
                            getFlashcardSetHandler(res.id)
                        }} className="group relative mx-auto cursor-pointer overflow-hidden rounded-[16px] bg-gray-300 p-[1px] transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500">
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
        </div>
    )
}
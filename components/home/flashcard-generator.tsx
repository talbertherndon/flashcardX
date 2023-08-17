"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import { styled } from "@mui/material/styles";
import ReactCardFlip from "react-card-flip";
import { data } from "@/lib/mock/terms";
import Carousel from "react-material-ui-carousel";
import { type } from "os";
import { credits, deleteFlaschard, generateFlaschards, getFlaschard, getMyFlashcards, saveFlaschards } from "@/lib/api";
import { Session } from "next-auth";
import { useSignInModal } from "../layout/sign-in-modal";
import { useWindowSize } from 'usehooks-ts'
import { useRouter } from "next/navigation";



const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "light" ? "#D5F0FF" : "#D5F0FF",
    },
}));

interface IFlashcard {
    term: string;
    definition: string
}
interface ISet {
    name: string;
    flashcards: IFlashcard[];
    id: number;
    public: boolean;
    user_id: number;
    groups_id: number;
}

export default function FlashcardGenerator({ session, id }: { session: any, id: number }) {
    const { SignInModal, setShowSignInModal } = useSignInModal();

    const router = useRouter();
    const { width } = useWindowSize()
    const [text, setText] = useState("");
    const [limit, setLimit] = useState(false);
    const [error, setError] = useState(false);
    const [word, setWord] = useState("");
    const [loading, setLoading] = useState(false);
    const [message,setMessage] = useState('')
    const [count, setCount] = useState(0)

    const [progress, setProgress] = useState(0);
    const [flashcards, setFlashcards] = useState<IFlashcard[]>(data);
    const [set, setSet] = useState<ISet>()
    const [flipped, setFlipped] = useState(false);

    async function generateFlashcardsHandler() {
        setError(false)
        console.log(text);
        if (text.length > 20 && text.length < 2501) {
            setLoading(true)
            const payload = {
                user_id: session.user.id,
                cost: 150
            }
            credits(payload).then((res) => {
                generateFlaschards(text).then((data) => {
                    console.log(data)
                    setFlashcards(data);
                    // const answers = data.answers.split("\n");
                    // const questions = data.questions.split("\n");
                    // for (let i = 1; i < answers.length; i++) {
                    //     const tempObject = {
                    //         definition: answers[i],
                    //         term: questions[i],
                    //     }
                    //     console.log(tempObject)
                    //     setFlashcards((prev) => [...prev, tempObject])

                    // }
                    setProgress(0)
                    setLoading(false)
                }).catch((e) => {
                    //error generation
                    setMessage('Server error please try again later')
                    setError(true)
                    setLoading(false)
                    console.log(e)
                })
            }).catch((e) => {
                //out of credits
                setLoading(false)
                setMessage(e.response.data.message)
                console.log(e.response.data.message)
                setError(true)
            })
        } else {
            // not enough characters
            setMessage("Needs to be more then 20 characters")
            setError(true)
        }

    }

    useEffect(() => {
        setLoading(true)
        if (id) {
            getFlaschard(id).then((res) => {
                console.log(res)
                setLoading(false)
                setFlashcards(res.data.flashcards)
                setSet(res.data)
            })
        } else {
            setLoading(false)
            setFlashcards([]);
        }
        getMyFlashcards(session?.user.id).then((res) => {
            console.log(res.data)
            setCount(res.data.length)
        })
    }, []);

    useEffect(() => {
        if (loading) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        return 0;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 500);

            return () => {
                clearInterval(timer);
            };
        } else {
            setProgress(100);
            clearInterval(0);
        }
    }, [loading]);

    function saveFlashcardHandler() {
        let x = Math.floor((Math.random() * 9999) + 1000);

        if (session) {
            console.log(session.user.id);
            const name = `#${x} ${session.user.firstname} - Set`
            console.log(flashcards)
            saveFlaschards(session.user.id, true, name, flashcards).then((res) => {
                console.log(res)
            })
        }
    }
    function newFlashcardHandler() {
        setFlashcards([]);
        router.push("/")

    }
    function deleteFlashcardHandler() {
        if (set) {
            console.log(set)
            deleteFlaschard(set.id).then((res) => {
                router.push("/")
            })
        }
    }
    return (
        <div className="relative h-full w-full">
            <SignInModal />
            {set &&
                <p
                    className="animate-fade-up text-center text-gray-500 opacity-0 md:text-md"
                    style={{
                        animationDelay: "0.25s",
                        animationFillMode: "forwards",
                    }}
                >
                    {set.name}
                </p>}
            {flashcards.length == 0 ? (
                <motion.div
                    animate={{
                        y: 0,
                    }}
                    transition={{ type: "spring", duration: 0.5, stiffness: 150 }}
                    initial={{ y: -75 }}
                >
                    <Box
                        sx={{
                            border: 2,
                            borderColor: "#F3F0F6",
                            m: 2,
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                borderBottom: 2,
                                borderColor: "#F3F0F6",
                                padding: 1,
                                pl: 3,
                                display: "flex",
                                alignContent: "center",
                            }}
                        >
                            <p
                                className="animate-fade-up text-center text-gray-500 opacity-0 md:text-sm"
                                style={{
                                    animationDelay: "0.25s",
                                    animationFillMode: "forwards",
                                }}
                            >
                                Flashcards: Automatic
                            </p>
                        </Box>
                        <Box sx={{ backgroundColor: "#F3F0F6", height: 400 }}>
                            <textarea
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                }}
                                placeholder="Paste your material here and we will generate your flashcards."
                                rows={12}
                                maxLength={2501}
                                className=" no-resize block h-full w-full resize-none appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                                id="message"
                            ></textarea>
                            {limit ? (
                                <Typography sx={{ color: "red" }}>
                                    You have reach your limit!
                                </Typography>
                            ) : (
                                <></>
                            )}
                            {error ? (
                                <Typography sx={{ color: "red", fontSize: 12 }}>
                                   {message}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Box>
                        <div
                            className="mx-3 my-2 flex animate-fade-up justify-end space-x-5 opacity-0"
                            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                        >
                            {" "}
                            <button
                                disabled={loading ? true : false}
                                onClick={generateFlashcardsHandler}
                                className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
                            >
                                Generate
                            </button>
                            <button
                                onClick={() => {
                                    setText("");
                                }}
                                className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            >
                                Clear
                            </button>
                        </div>
                        {progress > 0 && loading && (
                            <BorderLinearProgress variant="determinate" value={progress} />
                        )}
                    </Box>
                </motion.div>
            ) : (
                <Box >
                    <motion.div
                        animate={{
                            scale: 1,
                        }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        initial={{ scale: 0 }}
                    >
                        <Box
                            sx={{
                                m: 2,
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            {" "}
                            <Box
                                sx={{
                                    borderColor: "#F3F0F6",
                                    padding: 1,
                                    pl: 3,
                                }}
                            >
                                <Carousel
                                    height={350}
                                    autoPlay={session ? false : true}
                                    stopAutoPlayOnHover={session ? true : false}
                                    animation="slide"
                                    //index={r}
                                    navButtonsAlwaysVisible={true}
                                    next={() => setFlipped(false)}
                                    prev={(prev, active) =>
                                        console.log(`we left ${active}, and are now at ${prev}`)
                                    }
                                    navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                                        style: {
                                            backgroundColor: 'white',
                                            color: 'black',
                                            borderRadius: 10
                                        }
                                    }}
                                    navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                                        style: {
                                            bottom: '0',
                                            top: 'unset'
                                        }
                                    }}
                                >
                                    {flashcards.map((res: any, index: number) => (
                                        <>
                                            {!loading ?
                                                <Box sx={{ '&:hover': { cursor: 'grab' } }} key={index}>
                                                    {width > 450 ?
                                                        <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
                                                            <Box
                                                                onClick={() => {
                                                                    setFlipped(!flipped);
                                                                }}
                                                                sx={{
                                                                    display: "flex",
                                                                    height: 350,
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    m: 1,
                                                                    borderRadius: 2,
                                                                    boxShadow: 1,
                                                                }}
                                                            >
                                                                <motion.div
                                                                    animate={{ y: 10, scale: 1 }}
                                                                    //   transition={{ delay: `${index}` }}
                                                                    initial={{ scale: 0 }}
                                                                >
                                                                    <div className="mx-10 max-w text-center">
                                                                        <h2 className="bg-gradient-to-br from-black to-black bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                                                                            {res.term.replace(/\d+/g, "").replace(".", "")}</h2>
                                                                    </div>
                                                                </motion.div>
                                                            </Box>
                                                            <Box
                                                                onClick={() => {
                                                                    setFlipped(!flipped);
                                                                }}
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    height: 350,
                                                                    backgroundColor: "#F3F0F6",
                                                                    m: 1,
                                                                    borderRadius: 2,
                                                                    boxShadow: 1,
                                                                }}
                                                            >
                                                                <motion.div
                                                                    animate={{ y: 10, scale: 1 }}
                                                                    initial={{ scale: 0 }}
                                                                >
                                                                    <div className="mx-10 max-w text-center">

                                                                        <h2 className="bg-gradient-to-br from-black to-black bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                                                                            {/* replace() takes out dates and important times when answering questions */}
                                                                            {res.definition}
                                                                        </h2>
                                                                    </div>
                                                                </motion.div>
                                                            </Box>
                                                        </ReactCardFlip>
                                                        :
                                                        <>
                                                            {!flipped ?
                                                                <Box
                                                                    onClick={() => {
                                                                        setFlipped(!flipped);
                                                                    }}
                                                                    sx={{
                                                                        display: "flex",
                                                                        height: 350,
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        m: 1,
                                                                        borderRadius: 2,
                                                                        boxShadow: 1,
                                                                    }}
                                                                >
                                                                    <div className="mx-10 max-w text-center">
                                                                        <h2 className="bg-gradient-to-br from-black to-black bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                                                                            {res.term.replace(/\d+/g, "").replace(".", "")}</h2>
                                                                    </div>
                                                                </Box> :
                                                                <Box
                                                                    onClick={() => {
                                                                        setFlipped(!flipped);
                                                                    }}
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        height: 350,
                                                                        backgroundColor: "#F3F0F6",
                                                                        justifyContent: 'center',
                                                                        m: 1,
                                                                        borderRadius: 2,
                                                                        boxShadow: 1,
                                                                    }}
                                                                >
                                                                    <div className="mx-10 max-w text-center">

                                                                        <h2 className="bg-gradient-to-br from-black to-black bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                                                                            {/* replace() takes out dates and important times when answering questions */}
                                                                            {res.definition}
                                                                        </h2>
                                                                    </div>
                                                                </Box>
                                                            }
                                                        </>
                                                    }
                                                </Box> : <Box sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: 'center',
                                                    height: 350,
                                                }}>
                                                    <CircularProgress sx={{

                                                    }} /></Box>}
                                        </>
                                    ))}
                                </Carousel>
                            </Box>
                        </Box>
                    </motion.div>
                    {session ?
                        <div
                            className="mx-3 my-2 flex animate-fade-up justify-center space-x-5 opacity-0"
                            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                        >
                            {!id &&
                                <button onClick={saveFlashcardHandler} className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
                                    <p className="text-gray-600">Save</p>
                                </button>}
                            {count <= 7 && <button onClick={newFlashcardHandler} className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
                                <p className="text-gray-600">New Set</p>
                            </button>}
                            {set?.user_id == session.user.id && <button onClick={deleteFlashcardHandler} className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
                                <p className="text-gray-600">Delete</p>
                            </button>}
                        </div> :
                        <div
                            className="mx-3 my-2 flex animate-fade-up justify-center space-x-5 opacity-0"
                            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                        >
                            <button onClick={() => setShowSignInModal(true)} className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
                                <p className="text-gray-600">Try it out!</p>
                            </button>
                        </div>}
                </Box>
            )}

        </div>

    );
}

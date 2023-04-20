"use client";
import { Box, Typography } from "@mui/material";
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
import { saveFlaschards } from "@/lib/api";
import { Session } from "next-auth";



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

export default function FlashcardGenerator({ session }: { session: Session | null }) {
    const [text, setText] = useState("");
    const [limit, setLimit] = useState(false);
    const [error, setError] = useState(false);
    const [word, setWord] = useState("");
    const [progress, setProgress] = useState(0);
    const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
    const [flipped, setFlipped] = useState(false);
    console.log(flashcards)

    async function generateFlashcardsHandler() {
        console.log(text);
        const response = await fetch(`/flashcards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                response: `${text}`,
                userID: `${1}`,
            }),
        });
        const data = await response.json();
        const answers = data.answers.split("\n");
        const questions = data.questions.split("\n");
        for (let i = 1; i < answers.length; i++) {
            const tempObject = {
                definition: answers[i],
                term: questions[i],
            }
            console.log(tempObject)
            setFlashcards((prev) => [...prev, tempObject])

        }
    }
    useEffect(() => {
        setFlashcards(data);
    }, [data]);

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
    return (
        <div className="relative h-full w-full">
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
                                <Typography sx={{ color: "red" }}>
                                    The word {word} is not allowed!
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
                        {progress > 0 && (
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
                                    autoPlay={false}
                                    stopAutoPlayOnHover={false}
                                    animation="slide"
                                    //index={r}
                                    next={() => setFlipped(false)}
                                    prev={(prev, active) =>
                                        console.log(`we left ${active}, and are now at ${prev}`)
                                    }
                                >
                                    {flashcards.map((res: any, index: number) => (
                                        <Box key={index}>
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
                                                        <Typography
                                                            sx={{
                                                                p: 1,
                                                                fontWeight: 800,
                                                                fontSize: 25,
                                                                textAlign: "center",
                                                                padding: 6,
                                                            }}
                                                        >
                                                            {res.term.replace(/\d+/g, "").replace(".", "")}
                                                        </Typography>
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
                                                        transition={{ delay: index }}
                                                        initial={{ scale: 0 }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                textAlign: "center",
                                                                fontWeight: 900,
                                                                fontSize: 22,
                                                                padding: 6,
                                                            }}
                                                        >
                                                            {/* replace() takes out dates and important times when answering questions */}
                                                            {res.definition}
                                                        </Typography>
                                                    </motion.div>
                                                </Box>
                                            </ReactCardFlip>
                                        </Box>
                                    ))}
                                </Carousel>
                            </Box>
                        </Box>
                    </motion.div>
                    <div
                        className="mx-3 my-2 flex animate-fade-up justify-center space-x-5 opacity-0"
                        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                    >                    <button onClick={saveFlashcardHandler} className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
                            <p className="text-gray-600">Save</p>
                        </button>
                        <button onClick={() => { setFlashcards([]) }} className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
                            <p className="text-gray-600">Cancel</p>
                        </button>
                    </div>
                </Box>
            )}

        </div>

    );
}

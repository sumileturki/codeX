"use client";
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import { ArrowRight, Link } from 'lucide-react';
import React, { useContext, useState, useRef, useEffect } from 'react';
import SignInDialog from './SignInDialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; // added toast import if missing

function Hero() {
    const [userInput, setUserInput] = useState('');
    const { messages, setMessages } = useContext(MessagesContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();
    const textareaRef = useRef(null);

    const onGenerate = async (input) => {
        if (!userDetail?.name) {
            setOpenDialog(true);
            return;
        }
        if (userDetail?.token < 10) {
            toast('You don’t have enough tokens!');
            return;
        }
        const msg = { role: 'user', content: input };
        setMessages(msg);

        const workspaceId = await CreateWorkspace({
            user: userDetail._id,
            messages: [msg],
        });

        router.push('/workspace/' + workspaceId);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-black gap-4 p-10"
            style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 102, 255, 0.2), rgba(0, 0, 0, 0.99))`,
            }}
        >
            <motion.div
                className="flex flex-col items-center mt-42 xl:mt-42 gap-3 z-10"
                animate={{ y: isHovered ? -20 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h2
                    className="font-bold text-4xl text-white"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    {Lookup.HERO_HEADING}
                </h2>
                <p
                    className="text-gray-400 font-medium"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    {Lookup.HERO_DESC}
                </p>
            </motion.div>

            <motion.div
                className="p-5 border rounded-xl max-w-2xl w-full mt-3 bg-opacity-20 backdrop-blur-lg border-gray-700"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1)',
                    perspective: '800px',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{
                    y: -40,
                    scale: 1.05,
                    rotateX: -5,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 6px 12px rgba(0, 0, 0, 0.15)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="flex gap-2 relative">
                    <textarea
                        ref={textareaRef}
                        placeholder={Lookup.INPUT_PLACEHOLDER}
                        className="outline-none bg-transparent w-full h-32 max-h-56 resize-none text-white"
                        onChange={(event) => setUserInput(event.target.value)}
                        value={userInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onGenerate(userInput);
                            } else if (e.key === 'Enter' && e.shiftKey) {
                                setUserInput((prev) => prev + '\n');
                            }
                        }}
                    />
                    {userInput.length > 0 && (
                        <ArrowRight
                            onClick={() => onGenerate(userInput)}
                            className="bg-blue-500 p-2 w-10 h-10 rounded-md cursor-pointer text-white"
                        />
                    )}
                    {/* Static Shift+Enter instruction */}
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        <p className="text-right">
                            Press <span className="font-bold">Shift + Enter</span> to add a new line
                        </p>
                    </div>
                </div>
                <div className="mt-2 flex justify-end">
                    <Link className="h-5 w-5 text-white" />
                </div>
            </motion.div>

            <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
                {Lookup?.SUGGSTIONS.map((suggestion, index) => (
                    <motion.h2
                        key={index}
                        onClick={() => onGenerate(suggestion)}
                        className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
                        whileHover={{
                            scale: 1.1,
                            y: -5,
                            rotateX: -10,
                            textShadow: '0px 4px 10px rgba(255, 255, 255, 0.2)',
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {suggestion}
                    </motion.h2>
                ))}
            </div>

            <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
        </motion.div>
    );
}

export default Hero;

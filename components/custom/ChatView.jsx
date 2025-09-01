"use client";
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSidebar } from '../ui/sidebar';
import { toast } from 'sonner';
import { motion } from 'framer-motion'; // Importing framer-motion for animation

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
};

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);
    const { toggleSidebar } = useSidebar();
    const UpdateTokens = useMutation(api.users.UpdateToken);

    useEffect(() => {
        id && GetWorkspaceData();
    }, [id]);

    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id,
        });
        setMessages(result?.messages);
        console.log(result);
    };

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GetAiResponse();
            }
        }
    }, [messages]);

    const GetAiResponse = async () => {
        setLoading(true);
        try {
            const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
            const result = await axios.post('/api/ai-chat', {
                prompt: PROMPT,
            });

            const aiResp = {
                role: 'ai',
                content: result.data.result,
            };
            setMessages((prev) => [...prev, aiResp]);

            await UpdateMessages({
                messages: [...messages, aiResp],
                workspaceId: id,
            });

            const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
            setUserDetail((prev) => ({
                ...prev,
                token: token,
            }));

            // Update Tokens in Database
            await UpdateTokens({
                userId: userDetail?._id,
                token: token,
            });
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const onGenerate = (input) => {
        if (userDetail?.token < 10) {
            toast('You don’t have enough tokens!');
            return;
        }
        setMessages((prev) => [
            ...prev,
            {
                role: 'user',
                content: input,
            },
        ]);
        setUserInput('');
    };

    return (
        <div className="relative h-[85vh] flex flex-col">
            <motion.div
                className="flex-1 overflow-y-scroll scrollbar-hide pl-5"
                style={{
                    background: `radial-gradient(circle at ${messages?.length ? 'center' : '0, 0'}, rgba(0, 102, 255, 0.2), rgba(0, 0, 0, 0.99))`,
                }}
            >
                {messages?.length > 0 &&
                    messages?.map((msg, index) => (
                        <motion.div
                            key={index}
                            className="p-3 mb-4 flex gap-2 items-center leading-7"
                            style={{
                                backgroundColor: msg.role === 'ai' ? Colors.AI_BACKGROUND : Colors.USER_BACKGROUND,
                                borderRadius: '15px', // Rounded response box
                                width: '100%', // Ensuring the response box takes full width
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {msg?.role === 'user' && (
                                <Image
                                    src={userDetail?.picture}
                                    alt="userImage"
                                    width={35}
                                    height={35}
                                    className="rounded-full"
                                />
                            )}
                            {/* Removed AI image (logo) */}
                            <motion.div
                                className="flex flex-col"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </motion.div>
                        </motion.div>
                    ))}
                {loading && (
                    <motion.div
                        className="p-5 mb-2 flex gap-2 items-center"
                        style={{
                            backgroundColor: Colors.CHAT_BACKGROUND,
                            borderRadius: '15px',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Loader2Icon className="animate-spin" />
                        <h2>Generating response...</h2>
                    </motion.div>
                )}
            </motion.div>

            {/* Input Section */}
            <div className="flex gap-2 items-end">
                {userDetail && (
                    <Image
                        src={userDetail?.picture}
                        className="rounded-full cursor-pointer"
                        onClick={toggleSidebar}
                        alt="user"
                        width={30}
                        height={30}
                    />
                )}
                <motion.div
                    className="p-5 border rounded-xl max-w-xl w-full mt-3"
                    style={{
                        backgroundColor: Colors.BACKGROUND,
                    }}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex gap-2">
                        <motion.textarea
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            value={userInput}
                            onChange={(event) => setUserInput(event.target.value)}
                            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none p-3 rounded-md focus:ring-2 focus:ring-blue-500"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1 }}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                        {userInput && (
                            <ArrowRight
                                onClick={() => onGenerate(userInput)}
                                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
                            />
                        )}
                    </div>
                    <div>
                        <Link className="h-5 w-5" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ChatView;

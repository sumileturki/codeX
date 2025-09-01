"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';
import { motion } from 'framer-motion';

function WorkspaceHistory() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const convex = useConvex();
    const [workspaceList, setWorkspaceList] = useState([]);
    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        if (userDetail) {
            GetAllWorkspace();
        }
    }, [userDetail]);

    const GetAllWorkspace = async () => {
        const result = await convex.query(api.workspace.GetAllWorkspace, {
            userId: userDetail?._id,
        });
        setWorkspaceList(result);
        console.log(result);
    };

    return (
        <div>
            <h2 className='font-medium text-lg'>Your Chats</h2>
            <div>
                {workspaceList &&
                    workspaceList.map((workspace, index) => (
                        <Link href={'/workspace/' + workspace?._id} key={index}>
                            <motion.h2
                                onClick={toggleSidebar}
                                className='text-sm text-gray-400 my-4 font-light cursor-pointer hover:text-white'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    textShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
                                    color: "#ffffff", // Text color on hover
                                }}
                            >
                                {workspace?.messages[0]?.content}
                            </motion.h2>
                        </Link>
                    ))}
            </div>
        </div>
    );
}

export default WorkspaceHistory;

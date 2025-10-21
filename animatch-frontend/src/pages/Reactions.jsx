import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import Sidebar from '../components/Sidebar'
import { PlusCircleIcon, ListIcon } from '@phosphor-icons/react';
import { useAuth } from '../utils/Auth'
import { useCreateReaction, useDeleteReaction, useFetchReactionsWithInfo, useUpdateReaction } from '../hooks/useReactions';
import { useFetchAnimeFromDB } from '../hooks/useAnime';
import AddReactionModal from '../components/Reactions/AddReactionModal';
import StatusSection from '../components/Watchlist/StatusSection';
import DeleteModal from '../components/Reactions/DeleteModal';
import UpdateModal from '../components/Reactions/UpdateModal';

function Reactions() {
    const { session } = useAuth();
    const token = session?.access_token;

    const { data: reactionData, isSuccess: reactionSuccess } = useFetchReactionsWithInfo(token);
    const { data: userAnime, isSuccess: userAnimeSuccess } = useFetchAnimeFromDB(token);
    const createMutation = useCreateReaction(token);
    const deleteMutation = useDeleteReaction(token);
    const updateMutation = useUpdateReaction(token);


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [updateTarget, setUpdateTarget] = useState(null);
    const [filter, setFilter] = useState('all');

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'liked', label: 'Liked Anime' },
        { value: 'disliked', label: 'Disliked Anime' },
        { value: 'not_interested', label: 'Not Interested Anime' },
        { value: 'no_interaction', label: 'MEH Anime' }
    ]

    const grouped = reactionSuccess && reactionData.result.reduce((acc, item) => {
        acc[item.reaction] = acc[item.reaction] ? [...acc[item.reaction], item] : [item]
        return acc
    }, {})

    return (
        <div className='flex animate-fade-down bg-black min-h-screen'>
            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 bg-black border-r border-gray-800 w-64 p-4 lg:hidden`}
            >
                <Sidebar />
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
                >
                    ✕
                </button>
            </div>

            {/* Sidebar for Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            <div className='flex flex-1 p-4 sm:p-6'>
                <div className='flex-1'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <ListIcon size={24} color="white" />
                        </button>
                        <h1 className='text-white text-xl sm:text-3xl p-6 font-bold'>
                            My Reactions
                        </h1>
                        <div className='flex items-center gap-5 text-white'>
                            <button className='bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 flex items-center justify-center gap-1 cursor-pointer' onClick={() => setShowAddModal(true)}><PlusCircleIcon />Add Reaction</button>
                            <select value={filter} onChange={(e) => setFilter(e.target.value)} className='bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-red-500'>
                                {filterOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    {userAnimeSuccess && (
                        <AddReactionModal
                            isOpen={showAddModal}
                            onClose={() => setShowAddModal(false)}
                            userAnime={userAnime?.anime_data}
                            onSubmit={createMutation.mutate}
                            isLoading={createMutation.isPending}
                            isSuccess={createMutation.isSuccess}
                            resetMutation={createMutation.reset}
                        />
                    )}

                    {updateTarget && createPortal(
                        <UpdateModal
                            isOpen={!!updateTarget}
                            anime={updateTarget}
                            onClose={() => setUpdateTarget(null)}
                            onSubmit={(reaction) => {
                                updateMutation.mutate({ anime_id: updateTarget.id, reaction })
                            }}
                            isLoading={updateMutation.isPending}
                            isSuccess={updateMutation.isSuccess}
                            resetMutation={updateMutation.reset}
                        />, document.body
                    )}

                    {deleteTarget && createPortal(
                        <DeleteModal
                            isOpen={!!deleteTarget}
                            anime={deleteTarget}
                            onClose={() => setDeleteTarget(null)}
                            onConfirm={() => {
                                deleteMutation.mutate({ reaction_id: deleteTarget.id })
                                setDeleteTarget(null)
                            }}
                        />, document.body)}

                    {filter === 'all'
                        ? Object.entries(grouped || {}).map(([reaction, items]) => (
                            <StatusSection key={reaction} title={reaction} items={items} onClick={() => { }} setDeleteTarget={setDeleteTarget} setUpdateTarget={setUpdateTarget} />
                        ))
                        : grouped[filter] && (
                            <StatusSection title={filter} items={grouped[filter]} onClick={() => { }} setDeleteTarget={setDeleteTarget} setUpdateTarget={setUpdateTarget} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Reactions
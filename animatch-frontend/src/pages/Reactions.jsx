import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { PlusCircleIcon } from '@phosphor-icons/react';
import { useAuth } from '../utils/Auth'
import { useCreateReaction, useDeleteReaction, useFetchReactionsWithInfo, useUpdateReaction } from '../hooks/useReactions';
import { useFetchAnimeFromDB } from '../hooks/useAnime';
import AddReactionModal from '../components/Reactions/AddReactionModal';
import StatusSection from '../components/Watchlist/StatusSection';

function Reactions() {
    const { session } = useAuth();
    const token = session?.access_token;

    const { data: reactionData, isSuccess: reactionSuccess } = useFetchReactionsWithInfo(token);
    console.log(reactionData);
    const { data: userAnime, isSuccess: userAnimeSuccess } = useFetchAnimeFromDB(token);
    const createMutation = useCreateReaction(token);
    const deleteMutation = useDeleteReaction(token);
    const updateMutation = useUpdateReaction(token);


    const [showAddModal, setShowAddModal] = useState(false);
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
            <Sidebar />
            <div className='flex flex-1 p-4 sm:p-6'>
                <div className='flex-1'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
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

                    {filter === 'all'
                        ? Object.entries(grouped || {}).map(([reaction, items]) => (
                            <StatusSection key={reaction} title={reaction} items={items} onClick={() => { }}  />
                        ))
                        : grouped[filter] && (
                            <StatusSection title={filter} items={grouped[filter]} onClick={() => { }}  />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Reactions
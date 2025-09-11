import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Sidebar from '../components/Sidebar'
import { useFetchWatchlistWithInfo, useCreateWatchlist, useDeleteWatchlist, useUpdateWatchlist } from '../hooks/useWatchlist'
import { useFetchAnimeFromDB } from '../hooks/useAnime'
import StatusSection from '../components/Watchlist/StatusSection'
import AddWatchlistModal from '../components/Watchlist/AddWatchlistModal'
import DeleteModal from '../components/Watchlist/DeleteModal'
import { PlusCircleIcon } from '@phosphor-icons/react'
import { useAuth } from '../utils/Auth'
import UpdateModal from '../components/Watchlist/UpdateModal'

export default function Watchlist() {
    const { session } = useAuth();
    const token = session?.access_token;
    const { data: watchlistWithAnimeInfo, isSuccess } = useFetchWatchlistWithInfo(token);
    const { data: userAnime, isSuccess: userAnimeSuccess } = useFetchAnimeFromDB(token);
    const createMutation = useCreateWatchlist(token);
    const deleteMutation = useDeleteWatchlist(token);
    const updateMutation = useUpdateWatchlist(token);



    const [showAddModal, setShowAddModal] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [updateTarget, setUpdateTarget] = useState(null);
    const [filter, setFilter] = useState('all')

    const grouped = isSuccess && watchlistWithAnimeInfo.result.reduce((acc, item) => {
        acc[item.status] = acc[item.status] ? [...acc[item.status], item] : [item]
        return acc
    }, {})

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'watching', label: 'Watching' },
        { value: 'plan_to_watch', label: 'Plan To Watch' },
        { value: 'completed', label: 'Completed' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'dropped', label: 'Dropped' },
    ]

    return (
        <div className="flex min-h-screen bg-black animate-fade-down">
            <Sidebar />
            <div className="flex flex-1 p-4 sm:p-6">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-white text-xl sm:text-3xl p-6 inline-flex items-center gap-1.5 font-bold">
                            My Watchlist
                        </h1>
                        <div className='flex items-center gap-5 text-white'>
                            <button className='bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 flex items-center justify-center gap-1 cursor-pointer' onClick={() => setShowAddModal(true)}><PlusCircleIcon />Add to Watchlist</button>
                            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                {filterOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {userAnimeSuccess && (
                        <AddWatchlistModal
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
                            onSubmit={(status) => {
                                updateMutation.mutate({ anime_id: updateTarget.id, status })
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
                                deleteMutation.mutate({ watchlist_id: deleteTarget.id })
                                setDeleteTarget(null)
                            }}
                        />, document.body)}

                    {filter === 'all'
                        ? Object.entries(grouped || {}).map(([status, items]) => (
                            <StatusSection key={status} title={status} items={items} onClick={() => { }} setDeleteTarget={setDeleteTarget} setUpdateTarget={setUpdateTarget} />
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

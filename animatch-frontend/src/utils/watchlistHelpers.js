export const convertText = (text) => {
    switch (text) {
        case 'plan_to_watch': return 'Plan To Watch'
        case 'watching': return 'Watching'
        case 'completed': return 'Completed'
        case 'dropped': return 'Dropped'
        case 'on_hold': return 'On Hold'
        case 'liked': return 'Liked'
        case 'disliked': return 'Disliked'
        case 'not_interested': return 'Not Interested'
        default: return text
    }
}

export const getStatusColor = (status) => {
    switch (status) {
        case 'plan_to_watch': return 'bg-blue-400'
        case 'watching': return 'bg-cyan-400'
        case 'completed': return 'bg-green-400'
        case 'dropped': return 'bg-red-400'
        case 'on_hold': return 'bg-yellow-400'
        default: return status
    }
}

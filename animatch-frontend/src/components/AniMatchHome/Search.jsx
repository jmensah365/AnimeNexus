import React, {useState} from 'react'

function Search() {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() === '') throw new Error('Search query cannot be empty');
        if (query.trim()) onSearch(query);
    }
  return (
    <>
    <form>
        <div className="flex items-center justify-center mt-10">

        </div>
    </form>
    </>
  )
}

export default Search
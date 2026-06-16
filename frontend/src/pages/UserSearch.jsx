import { useCallback, useEffect, useState } from 'react'
import { Search, UserRound } from 'lucide-react'
import UserCard from '../components/UserCard.jsx'
import { getErrorMessage, userService } from '../services/userService.js'

export default function UserSearch() {
  const [keyword, setKeyword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const runSearch = useCallback(async (searchKeyword) => {
    setLoading(true)
    setError('')

    try {
      const data = searchKeyword.trim()
        ? await userService.searchUsers(searchKeyword.trim())
        : await userService.getUsers()
      setUsers(data)
    } catch (searchError) {
      setError(getErrorMessage(searchError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      runSearch(keyword)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [keyword, runSearch])

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.username}? This also removes the profile image file.`)

    if (!confirmed) {
      return
    }

    try {
      await userService.deleteUser(user.id)
      setUsers((current) => current.filter((item) => item.id !== user.id))
    } catch (deleteError) {
      setError(getErrorMessage(deleteError))
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Search</p>
        <h1 className="text-2xl font-semibold text-slate-950">Find user profiles</h1>
      </div>

      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
          aria-hidden="true"
        />
        <input
          autoFocus
          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-base shadow-sm placeholder:text-slate-400 focus:border-sky-500"
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by name, username, email, phone, role, or status"
          type="search"
          value={keyword}
        />
      </label>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Searching...</div>
      ) : null}

      {!loading && users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <UserRound className="mx-auto text-slate-400" size={36} aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-slate-950">No matching users</h2>
          <p className="mt-1 text-sm text-slate-600">Try another keyword.</p>
        </div>
      ) : null}

      {!loading && users.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onDelete={handleDelete} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

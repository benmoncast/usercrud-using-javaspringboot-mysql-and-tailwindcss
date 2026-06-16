import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Search, Trash2, UserPlus, UserRound } from 'lucide-react'
import UserCard from '../components/UserCard.jsx'
import { getErrorMessage, getImageUrl, userService } from '../services/userService.js'

function StatusBadge({ status }) {
  const normalized = status || 'active'
  const badgeClass =
    normalized === 'active'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : normalized === 'inactive'
        ? 'bg-slate-100 text-slate-700 ring-slate-200'
        : 'bg-amber-50 text-amber-700 ring-amber-200'

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${badgeClass}`}>
      {normalized}
    </span>
  )
}

export default function UserList() {
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const activeCount = useMemo(() => users.filter((user) => user.status === 'active').length, [users])

  const loadUsers = useCallback(async (searchKeyword = '') => {
    setLoading(true)
    setError('')

    try {
      const data = searchKeyword.trim()
        ? await userService.searchUsers(searchKeyword.trim())
        : await userService.getUsers()
      setUsers(data)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadUsers(keyword)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [keyword, loadUsers])

  const handleDelete = async (user) => {
    const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
    const confirmed = window.confirm(`Delete ${fullName || user.username}? This also removes the profile image file.`)

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">User Directory</p>
          <h1 className="text-2xl font-semibold text-slate-950">Manage users</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {users.length} total records, {activeCount} active profiles
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 sm:w-80">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
              aria-hidden="true"
            />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-500"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search users"
              type="search"
              value={keyword}
            />
          </label>

          <Link
            to="/users/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <UserPlus size={16} aria-hidden="true" />
            Add User
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading users...</div>
      ) : null}

      {!loading && users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <UserRound className="mx-auto text-slate-400" size={36} aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-slate-950">No users found</h2>
          <p className="mt-1 text-sm text-slate-600">Add a profile or adjust the search keyword.</p>
        </div>
      ) : null}

      {!loading && users.length > 0 ? (
        <>
          <div className="grid gap-4 md:hidden">
            {users.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
                    const imageUrl = getImageUrl(user.profile_image_url)

                    return (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`${fullName || user.username} profile`}
                                className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <UserRound size={22} aria-hidden="true" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-950">{fullName || user.username}</p>
                              <p className="truncate text-sm text-slate-500">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          <p className="max-w-64 truncate">{user.email}</p>
                          <p className="text-slate-500">{user.phone_number || 'No phone number'}</p>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium capitalize text-slate-700">{user.role}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/users/${user.id}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                              title="View user"
                            >
                              <Eye size={16} aria-hidden="true" />
                            </Link>
                            <Link
                              to={`/users/${user.id}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-50"
                              title="Edit user"
                            >
                              <Pencil size={16} aria-hidden="true" />
                            </Link>
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
                              onClick={() => handleDelete(user)}
                              title="Delete user"
                              type="button"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

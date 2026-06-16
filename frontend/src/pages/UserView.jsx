import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Mail, Pencil, Phone, Trash2, UserRound } from 'lucide-react'
import { formatDateTime } from '../utils/userForm.js'
import { getErrorMessage, getImageUrl, userService } from '../services/userService.js'

function DetailItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-900">{value || 'Not provided'}</dd>
    </div>
  )
}

export default function UserView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      setUser(await userService.getUser(id))
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${user.username}? This also removes the profile image file.`)

    if (!confirmed) {
      return
    }

    try {
      await userService.deleteUser(user.id)
      navigate('/users')
    } catch (deleteError) {
      setError(getErrorMessage(deleteError))
    }
  }

  if (loading) {
    return <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">Loading user...</p>
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error || 'User was not found.'}
      </div>
    )
  }

  const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  const imageUrl = getImageUrl(user.profile_image_url)

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/users"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/users/${user.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-700 shadow-sm hover:bg-sky-50"
          >
            <Pencil size={16} aria-hidden="true" />
            Edit
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-50"
            onClick={handleDelete}
            type="button"
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${fullName || user.username} profile`}
              className="h-44 w-44 rounded-lg object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-slate-100 text-slate-500 ring-1 ring-slate-200">
              <UserRound size={52} aria-hidden="true" />
            </div>
          )}
          <span className="mt-4 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold capitalize text-emerald-700 ring-1 ring-emerald-200">
            {user.status || 'active'}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">{user.role || 'user'}</p>
          <h1 className="mt-1 break-words text-3xl font-semibold text-slate-950">{fullName || user.username}</h1>
          <p className="mt-1 text-slate-500">@{user.username}</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <span className="inline-flex min-w-0 items-center gap-2">
              <Mail size={16} aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone size={16} aria-hidden="true" />
              {user.phone_number || 'No phone'}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} aria-hidden="true" />
              {user.birth_date || 'No birth date'}
            </span>
          </div>
        </div>
      </section>

      <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={String(user.id)} />
        <DetailItem label="First name" value={user.first_name} />
        <DetailItem label="Middle name" value={user.middle_name} />
        <DetailItem label="Last name" value={user.last_name} />
        <DetailItem label="Username" value={user.username} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Phone number" value={user.phone_number} />
        <DetailItem label="Gender" value={user.gender} />
        <DetailItem label="Birth date" value={user.birth_date} />
        <DetailItem label="Address" value={user.address} />
        <DetailItem label="Role" value={user.role} />
        <DetailItem label="Status" value={user.status} />
        <DetailItem label="Profile image URL" value={user.profile_image_url} />
        <DetailItem label="Email verified at" value={formatDateTime(user.email_verified_at)} />
        <DetailItem label="Created at" value={formatDateTime(user.created_at)} />
        <DetailItem label="Updated at" value={formatDateTime(user.updated_at)} />
      </dl>
    </div>
  )
}

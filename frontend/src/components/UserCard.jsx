import { Link } from 'react-router-dom'
import { Eye, Mail, Pencil, Phone, Trash2, UserRound } from 'lucide-react'
import { getImageUrl } from '../services/userService.js'

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

export default function UserCard({ user, onDelete }) {
  const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  const imageUrl = getImageUrl(user.profile_image_url)

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${fullName || user.username} profile`}
            className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-500 ring-1 ring-slate-200">
            <UserRound size={26} aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-slate-950">{fullName || user.username}</h2>
            <StatusBadge status={user.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">@{user.username}</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <span className="inline-flex min-w-0 items-center gap-2">
              <Mail size={15} aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone size={15} aria-hidden="true" />
              {user.phone_number || 'No phone number'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <Link
          to={`/users/${user.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye size={15} aria-hidden="true" />
          View
        </Link>
        <Link
          to={`/users/${user.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-200 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
        >
          <Pencil size={15} aria-hidden="true" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete?.(user)}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          <Trash2 size={15} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  )
}

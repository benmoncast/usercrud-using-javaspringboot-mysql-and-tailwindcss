import { NavLink } from 'react-router-dom'
import { Search, UserPlus, Users } from 'lucide-react'

const linkClass = ({ isActive }) =>
  [
    'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-slate-900 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ')

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <NavLink to="/users" className="inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Users size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">User Manager</span>
            <span className="block text-xs text-slate-500">Spring Boot + React CRUDS</span>
          </span>
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/users" className={linkClass}>
            <Users size={17} aria-hidden="true" />
            Users
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            <Search size={17} aria-hidden="true" />
            Search
          </NavLink>
          <NavLink to="/users/new" className={linkClass}>
            <UserPlus size={17} aria-hidden="true" />
            Add User
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

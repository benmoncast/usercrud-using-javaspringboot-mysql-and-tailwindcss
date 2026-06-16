import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import UserEdit from './pages/UserEdit.jsx'
import UserForm from './pages/UserForm.jsx'
import UserList from './pages/UserList.jsx'
import UserSearch from './pages/UserSearch.jsx'
import UserView from './pages/UserView.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/users/:id/edit" element={<UserEdit />} />
          <Route path="/search" element={<UserSearch />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </main>
    </div>
  )
}

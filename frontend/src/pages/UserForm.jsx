import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import UserFormFields from '../components/UserFormFields.jsx'
import { getErrorMessage, userService } from '../services/userService.js'
import { createUserFormData, emptyUserForm } from '../utils/userForm.js'

export default function UserForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyUserForm)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setImageFile(file)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }

      return file ? URL.createObjectURL(file) : ''
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    if (!imageFile) {
      setSaving(false)
      setError('Profile image is required.')
      return
    }

    try {
      const payload = createUserFormData(form, imageFile)
      const createdUser = await userService.createUser(payload)
      navigate(`/users/${createdUser.id}`)
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Create User</p>
          <h1 className="text-2xl font-semibold text-slate-950">Add a new user profile</h1>
        </div>
        <Link
          to="/users"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <UserFormFields
          form={form}
          imageRequired
          onChange={handleChange}
          onImageChange={handleImageChange}
          previewUrl={previewUrl}
        />

        <div className="flex justify-end">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={saving}
            type="submit"
          >
            <Save size={16} aria-hidden="true" />
            {saving ? 'Saving...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  )
}

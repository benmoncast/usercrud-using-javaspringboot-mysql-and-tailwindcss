import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import UserFormFields from '../components/UserFormFields.jsx'
import { getErrorMessage, getImageUrl, userService } from '../services/userService.js'
import { createUserFormData, emptyUserForm, toUserForm } from '../utils/userForm.js'

export default function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyUserForm)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const user = await userService.getUser(id)
      setForm(toUserForm(user))
      setCurrentImageUrl(getImageUrl(user.profile_image_url))
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadUser()
  }, [loadUser])

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

    try {
      const payload = createUserFormData(form, imageFile, { includeEmptyPassword: false })
      const updatedUser = await userService.updateUser(id, payload)
      navigate(`/users/${updatedUser.id}`)
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">Loading user...</p>
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Edit User</p>
          <h1 className="text-2xl font-semibold text-slate-950">Update user information</h1>
        </div>
        <Link
          to={`/users/${id}`}
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
          currentImageUrl={currentImageUrl}
          form={form}
          isEdit
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

import { UploadCloud, UserRound } from 'lucide-react'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500'
const labelClass = 'text-sm font-medium text-slate-700'

const textFields = [
  { name: 'first_name', label: 'First name', required: true },
  { name: 'middle_name', label: 'Middle name' },
  { name: 'last_name', label: 'Last name', required: true },
  { name: 'username', label: 'Username', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone_number', label: 'Phone number' },
  { name: 'birth_date', label: 'Birth date', type: 'date' },
]

export default function UserFormFields({
  currentImageUrl = '',
  form,
  imageRequired = false,
  isEdit = false,
  onChange,
  onImageChange,
  previewUrl = '',
}) {
  const imageSource = previewUrl || currentImageUrl

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Profile Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {textFields.map((field) => (
            <label key={field.name} className="grid gap-2">
              <span className={labelClass}>
                {field.label}
                {field.required ? <span className="text-rose-600"> *</span> : null}
              </span>
              <input
                className={inputClass}
                name={field.name}
                onChange={onChange}
                required={field.required}
                type={field.type || 'text'}
                value={form[field.name] || ''}
              />
            </label>
          ))}

          <label className="grid gap-2">
            <span className={labelClass}>Gender</span>
            <select className={inputClass} name="gender" onChange={onChange} value={form.gender || ''}>
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className={labelClass}>Role</span>
            <select className={inputClass} name="role" onChange={onChange} value={form.role || 'user'}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className={labelClass}>Status</span>
            <select className={inputClass} name="status" onChange={onChange} value={form.status || 'active'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
        </div>

        <label className="mt-4 grid gap-2">
          <span className={labelClass}>Address</span>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            name="address"
            onChange={onChange}
            value={form.address || ''}
          />
        </label>
      </section>

      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Account Access</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className={labelClass}>
                Password
                {!isEdit ? <span className="text-rose-600"> *</span> : null}
              </span>
              <input
                autoComplete={isEdit ? 'new-password' : 'current-password'}
                className={inputClass}
                minLength={isEdit ? undefined : 6}
                name="password"
                onChange={onChange}
                placeholder={isEdit ? 'Leave blank to keep current password' : ''}
                required={!isEdit}
                type="password"
                value={form.password || ''}
              />
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">Profile Image</h2>
          <div className="mt-4 grid gap-3">
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
              {imageSource ? (
                <img src={imageSource} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <div className="grid place-items-center gap-2 text-slate-500">
                  <UserRound size={34} aria-hidden="true" />
                  <span className="text-sm">No image selected</span>
                </div>
              )}
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              <UploadCloud size={16} aria-hidden="true" />
              Choose Image
              <input
                accept="image/*"
                className="sr-only"
                name="profile_image"
                onChange={onImageChange}
                required={imageRequired}
                type="file"
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}

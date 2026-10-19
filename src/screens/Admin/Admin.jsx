import { useEffect, useMemo, useState } from 'react'
import { LogOut, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'

const emptyProduct = {
  category_id: '',
  name_en: '',
  name_mm: '',
  flavor_en: '',
  flavor_mm: '',
  description_en: '',
  description_mm: '',
  size: '',
  price: '',
  in_stock: true,
}

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

function Login({ onLogin }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('admin-language') || 'mm')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const myanmar = language === 'mm'
  const copy = myanmar
    ? {
      title: 'စီမံခန့်ခွဲသူ ဝင်ရောက်ရန်',
      username: 'အသုံးပြုသူအမည်',
      password: 'စကားဝှက်',
      signIn: 'ဝင်ရောက်ရန်',
      signingIn: 'ဝင်ရောက်နေသည်...',
      switchLanguage: 'EN',
    }
    : {
      title: 'Admin sign in',
      username: 'Username',
      password: 'Password',
      signIn: 'Sign in',
      signingIn: 'Signing in...',
      switchLanguage: 'မြန်မာ',
    }

  const toggleLanguage = () => {
    const nextLanguage = myanmar ? 'en' : 'mm'
    setLanguage(nextLanguage)
    localStorage.setItem('admin-language', nextLanguage)
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const admin = await api('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      onLogin(admin)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className={`flex min-h-screen items-center justify-center bg-[#f7f3e8] px-4 py-10 ${myanmar ? 'language-mm' : 'language-en'}`}>
      <Card className="w-full max-w-md border-[#d8cdb6] bg-[#fffdf7] shadow-xl shadow-[#704f38]/10">
        <CardHeader className="items-center text-center">
          <img
            className="mb-3 h-20 w-auto object-contain"
            src="/logo/mya-nyo-herbal-tea.png"
            alt="Mya Nyo Herbal Tea"
          />
          <div className="flex w-full items-center justify-between gap-3">
            <CardTitle className="text-left text-2xl text-[#29352b]">{copy.title}</CardTitle>
            <Button
              aria-label={myanmar ? 'Switch to English' : 'Switch to Burmese'}
              className="rounded-full border-[#9eac8f] px-3 text-[#53634f]"
              onClick={toggleLanguage}
              size="sm"
              type="button"
              variant="outline"
            >
              {copy.switchLanguage}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
              {copy.username}
              <Input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
              {copy.password}
              <Input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
            <Button className="h-10 bg-[#53634f] text-white hover:bg-[#29352b]" disabled={busy} type="submit">
              {busy ? copy.signingIn : copy.signIn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

function ProductForm({ product, categories, language, onSaved, onCancel }) {
  const [form, setForm] = useState(product || emptyProduct)
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const editing = Boolean(product)
  const myanmar = language === 'mm'
  const copy = myanmar
    ? {
      edit: 'ပစ္စည်းပြင်ရန်', add: 'ပစ္စည်းထည့်ရန်', englishName: 'အင်္ဂလိပ်အမည် *', myanmarName: 'မြန်မာအမည် *',
      category: 'အမျိုးအစား', noCategory: 'အမျိုးအစားမရှိ', size: 'အရွယ်အစား', englishFlavor: 'အင်္ဂလိပ်အရသာ',
      myanmarFlavor: 'မြန်မာအရသာ', englishDescription: 'အင်္ဂလိပ်ဖော်ပြချက်', myanmarDescription: 'မြန်မာဖော်ပြချက်',
      price: 'စျေးနှုန်း (ကျပ်) *', image: 'ပစ္စည်းပုံ', inStock: 'လက်ကျန်ရှိ', save: 'သိမ်းဆည်းရန်', saving: 'သိမ်းဆည်းနေသည်...', cancel: 'ပယ်ဖျက်ရန်',
    }
    : {
      edit: 'Edit product', add: 'Add product', englishName: 'English name *', myanmarName: 'Myanmar name *',
      category: 'Category', noCategory: 'No category', size: 'Size', englishFlavor: 'English flavor',
      myanmarFlavor: 'Myanmar flavor', englishDescription: 'English description', myanmarDescription: 'Myanmar description',
      price: 'Price (MMK) *', image: 'Product image', inStock: 'In stock', save: 'Save product', saving: 'Saving...', cancel: 'Cancel',
    }

  useEffect(() => {
    setForm(product || emptyProduct)
    setImages([])
    setError('')
  }, [product])

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const body = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) body.append(key, String(value))
    })
    images.forEach((image) => body.append('images', image))
    try {
      const saved = await api(editing ? `/api/admin/products/${product.id}` : '/api/admin/products', {
        method: editing ? 'PUT' : 'POST',
        body,
      })
      onSaved(saved)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const textField = (field, label, multiline = false) => (
    <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
      {label}
      {multiline ? (
        <textarea className="min-h-24 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" value={form[field] || ''} onChange={(event) => update(field, event.target.value)} />
      ) : (
        <Input value={form[field] || ''} onChange={(event) => update(field, event.target.value)} />
      )}
    </label>
  )

  return (
    <Card className="motion-fade-up-delay border-[#d8cdb6] bg-[#fffdf7]">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl text-[#29352b]">{editing ? copy.edit : copy.add}</CardTitle>
        <Button aria-label="Close product form" onClick={onCancel} size="icon" variant="ghost"><X /></Button>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          {textField('name_en', copy.englishName)}
          {textField('name_mm', copy.myanmarName)}
          <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
            {copy.category}
            <select className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm" value={form.category_id || ''} onChange={(event) => update('category_id', event.target.value)}>
              <option value="">{copy.noCategory}</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name_en}</option>)}
            </select>
          </label>
          {textField('size', copy.size)}
          {textField('flavor_en', copy.englishFlavor)}
          {textField('flavor_mm', copy.myanmarFlavor)}
          {textField('description_en', copy.englishDescription, true)}
          {textField('description_mm', copy.myanmarDescription, true)}
          <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
            {copy.price}
            <Input min="1" step="1" type="number" value={form.price || ''} onChange={(event) => update('price', event.target.value)} required />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
            {copy.image}
            <Input accept="image/jpeg,image/png,image/webp" multiple type="file" onChange={(event) => setImages(Array.from(event.target.files || []))} />
            {images.length > 0 && <p className="text-xs font-normal text-[#718073]">{images.length} image{images.length === 1 ? '' : 's'} selected</p>}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#53634f]">
            <input checked={Boolean(form.in_stock)} type="checkbox" onChange={(event) => update('in_stock', event.target.checked)} />
            {copy.inStock}
          </label>
          {error && <p className="text-sm text-red-700 md:col-span-2" role="alert">{error}</p>}
          <div className="flex gap-2 md:col-span-2">
            <Button className="bg-[#53634f] text-white hover:bg-[#29352b]" disabled={busy} type="submit"><Save />{busy ? copy.saving : copy.save}</Button>
            <Button onClick={onCancel} type="button" variant="outline">{copy.cancel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function AdminTools({ admin, language, settings, admins, onSettingsSaved, onAdminsChanged, onNotice }) {
  const myanmar = language === 'mm'
  const [form, setForm] = useState(settings)
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' })
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' })
  const [error, setError] = useState('')

  useEffect(() => setForm(settings), [settings])
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const saveSettings = async (event) => {
    event.preventDefault()
    try {
      const saved = await api('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      onSettingsSaved(saved)
      onNotice(myanmar ? 'ဆိုင်အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ။' : 'Shop settings saved.')
    } catch (requestError) { setError(requestError.message) }
  }
  const addAdmin = async (event) => {
    event.preventDefault()
    try {
      const created = await api('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      })
      onAdminsChanged([...admins, created])
      setNewAdmin({ username: '', password: '' })
      onNotice(myanmar ? 'စီမံခန့်ခွဲသူအသစ် ထည့်ပြီးပါပြီ။' : 'Admin account added.')
    } catch (requestError) { setError(requestError.message) }
  }
  const deleteAdmin = async (id) => {
    if (!window.confirm(myanmar ? 'ဤစီမံခန့်ခွဲသူကို ဖျက်မလား။' : 'Delete this admin account?')) return
    try {
      await api(`/api/admin/admins/${id}`, { method: 'DELETE' })
      onAdminsChanged(admins.filter((item) => item.id !== id))
      onNotice(myanmar ? 'စီမံခန့်ခွဲသူကို ဖျက်ပြီးပါပြီ။' : 'Admin account deleted.')
    } catch (requestError) { setError(requestError.message) }
  }
  const changePassword = async (event) => {
    event.preventDefault()
    try {
      await api('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
      })
      setPasswords({ current_password: '', new_password: '' })
      onNotice(myanmar ? 'စကားဝှက် ပြောင်းပြီးပါပြီ။' : 'Password changed.')
    } catch (requestError) { setError(requestError.message) }
  }
  const field = (key, label, multiline = false) => (
    <label className="grid gap-1.5 text-sm font-semibold text-[#53634f]">
      {label}
      {multiline
        ? <textarea className="min-h-24 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm" value={form[key] || ''} onChange={(event) => update(key, event.target.value)} />
        : <Input value={form[key] || ''} onChange={(event) => update(key, event.target.value)} />}
    </label>
  )
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card className="border-[#d8cdb6] bg-[#fffdf7]">
        <CardHeader><CardTitle className="text-xl text-[#29352b]">{myanmar ? 'ဆိုင်အချက်အလက်များ' : 'Shop settings'}</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={saveSettings}>
            {field('viber', myanmar ? 'Viber နံပါတ်' : 'Viber number')}
            {field('phone', myanmar ? 'ဖုန်းနံပါတ်' : 'Phone number')}
            {field('about_description_en', 'About description (English)', true)}
            {field('about_description_mm', 'About description (မြန်မာ)', true)}
            <Button className="w-fit bg-[#53634f] text-white hover:bg-[#29352b]"><Save />{myanmar ? 'သိမ်းဆည်းရန်' : 'Save settings'}</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6">
        <Card className="border-[#d8cdb6] bg-[#fffdf7]">
          <CardHeader><CardTitle className="text-xl text-[#29352b]">{myanmar ? 'စကားဝှက်ပြောင်းရန်' : 'Change password'}</CardTitle></CardHeader>
          <CardContent><form className="grid gap-3" onSubmit={changePassword}>
            <Input placeholder={myanmar ? 'လက်ရှိစကားဝှက်' : 'Current password'} type="password" value={passwords.current_password} onChange={(event) => setPasswords({ ...passwords, current_password: event.target.value })} required />
            <Input placeholder={myanmar ? 'စကားဝှက်အသစ် (အနည်းဆုံး ၈ လုံး)' : 'New password (8+ characters)'} type="password" value={passwords.new_password} onChange={(event) => setPasswords({ ...passwords, new_password: event.target.value })} required />
            <Button className="w-fit" type="submit">{myanmar ? 'ပြောင်းရန်' : 'Change password'}</Button>
          </form></CardContent>
        </Card>
        <Card className="border-[#d8cdb6] bg-[#fffdf7]">
          <CardHeader><CardTitle className="text-xl text-[#29352b]">{myanmar ? 'စီမံခန့်ခွဲသူများ' : 'Admin accounts'}</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {admins.map((item) => <div className="flex items-center justify-between rounded-lg border border-[#d8cdb6] p-2 text-sm" key={item.id}><span>{item.username}</span>{item.id !== admin.id && <Button onClick={() => deleteAdmin(item.id)} size="sm" variant="destructive">{myanmar ? 'ဖျက်ရန်' : 'Delete'}</Button>}</div>)}
            <form className="grid gap-2 border-t border-[#d8cdb6] pt-3" onSubmit={addAdmin}>
              <Input placeholder={myanmar ? 'အသုံးပြုသူအမည်' : 'New username'} value={newAdmin.username} onChange={(event) => setNewAdmin({ ...newAdmin, username: event.target.value })} required />
              <Input placeholder={myanmar ? 'စကားဝှက် (အနည်းဆုံး ၈ လုံး)' : 'New password (8+ characters)'} type="password" value={newAdmin.password} onChange={(event) => setNewAdmin({ ...newAdmin, password: event.target.value })} required />
              <Button className="w-fit" type="submit">{myanmar ? 'စီမံခန့်ခွဲသူထည့်ရန်' : 'Add admin'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {error && <p className="text-sm text-red-700 lg:col-span-2" role="alert">{error}</p>}
    </div>
  )
}

function Admin() {
  const [language, setLanguage] = useState(() => localStorage.getItem('admin-language') || 'mm')
  const [admin, setAdmin] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState({})
  const [admins, setAdmins] = useState([])
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const myanmar = language === 'mm'
  const copy = myanmar
    ? { signedIn: 'ဝင်ရောက်ထားသူ', dashboard: 'ပစ္စည်းစီမံခန့်ခွဲမှု', signOut: 'ထွက်ရန်', products: 'ပစ္စည်းများ', active: 'အသုံးပြုနေသော', search: 'ပစ္စည်းရှာရန်', add: 'ပစ္စည်းထည့်ရန်', inStock: 'လက်ကျန်ရှိ', outOfStock: 'လက်ကျန်မရှိ', visible: 'ဖော်ပြထားသည်', hidden: 'ဝှက်ထားသည်', markIn: 'လက်ကျန်ရှိဟု သတ်မှတ်ရန်', markOut: 'လက်ကျန်မရှိဟု သတ်မှတ်ရန်', restore: 'ပြန်ဖော်ပြရန်', noProducts: 'ပစ္စည်းမတွေ့ပါ', all: 'အားလုံး', activeStat: 'အသုံးပြုနေသော', outStat: 'လက်ကျန်မရှိ', hiddenStat: 'ဝှက်ထားသော', switchLanguage: 'EN' }
    : { signedIn: 'Signed in as', dashboard: 'Product dashboard', signOut: 'Sign out', products: 'Products', active: 'active', search: 'Search products', add: 'Add product', inStock: 'In stock', outOfStock: 'Out of stock', visible: 'Visible', hidden: 'Hidden', markIn: 'Mark in stock', markOut: 'Mark out of stock', restore: 'Restore', noProducts: 'No products found.', all: 'All', activeStat: 'Active', outStat: 'Out of stock', hiddenStat: 'Hidden', switchLanguage: 'မြန်မာ' }

  const loadDashboard = async () => {
    try {
      const [productData, categoryData, shopSettings, adminData] = await Promise.all([
        api('/api/admin/products'),
        api('/api/categories'),
        api('/api/settings'),
        api('/api/admin/admins'),
      ])
      setProducts(productData)
      setCategories(categoryData)
      setSettings(shopSettings)
      setAdmins(adminData)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    api('/api/auth/me')
      .then(setAdmin)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (admin) loadDashboard()
  }, [admin])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesSearch = !query || `${product.name_en} ${product.name_mm}`.toLowerCase().includes(query)
      const matchesFilter = filter === 'all'
        || (filter === 'stock' && product.in_stock && product.is_active)
        || (filter === 'out' && !product.in_stock && product.is_active)
        || (filter === 'hidden' && !product.is_active)
      return matchesSearch && matchesFilter
    })
  }, [filter, products, search])

  const stats = {
    total: products.length,
    active: products.filter((product) => product.is_active).length,
    out: products.filter((product) => !product.in_stock && product.is_active).length,
    hidden: products.filter((product) => !product.is_active).length,
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setAdmin(null)
    setEditing(null)
  }

  const updateProduct = async (product, values) => {
    try {
      const updated = await api(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item))
      setNotice('Product updated successfully.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const removeProduct = async (product) => {
    if (!window.confirm(`Hide ${product.name_en}?`)) return
    try {
      await api(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, is_active: 0 } : item))
      setNotice('Product hidden successfully.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const restoreProduct = async (product) => {
    try {
      const restored = await api(`/api/admin/products/${product.id}/restore`, { method: 'PATCH' })
      setProducts((current) => current.map((item) => item.id === restored.id ? restored : item))
      setNotice('Product restored successfully.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleLanguage = () => {
    const nextLanguage = myanmar ? 'en' : 'mm'
    setLanguage(nextLanguage)
    localStorage.setItem('admin-language', nextLanguage)
  }

  if (!admin) return <Login onLogin={setAdmin} />

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-7xl px-4 py-8 sm:px-6 md:px-8">
      <div className="motion-fade-up mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#8a6b43]">{copy.signedIn} {admin.username}</p>
          <h1 className="text-3xl font-bold text-[#29352b]">{copy.dashboard}</h1>
        </div>
        <div className="flex gap-2">
          <Button aria-label={myanmar ? 'Switch to English' : 'Switch to Burmese'} onClick={toggleLanguage} size="sm" variant="outline">{copy.switchLanguage}</Button>
          <Button onClick={logout} variant="outline"><LogOut />{copy.signOut}</Button>
        </div>
      </div>
      {error && <p className="motion-fade-up mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {notice && <p className="motion-fade-up mb-4 rounded-lg bg-[#e5eadc] p-3 text-sm text-[#53634f]" role="status">{notice}</p>}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [copy.products, stats.total, 'bg-[#fffdf7]'],
          [copy.activeStat, stats.active, 'bg-[#e5eadc]'],
          [copy.outStat, stats.out, 'bg-[#f5e6b8]'],
          [copy.hiddenStat, stats.hidden, 'bg-[#eee9df]'],
        ].map(([label, value, background]) => (
          <Card className={`motion-card border-[#d8cdb6] ${background} transition-transform duration-200 hover:-translate-y-1 hover:shadow-md`} key={label}>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6b43]">{label}</p>
              <p className="mt-1 text-2xl font-bold text-[#29352b]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing !== null && <div className="mb-6"><ProductForm categories={categories} language={language} onCancel={() => setEditing(null)} onSaved={(saved) => { setProducts((current) => editing === 'new' ? [saved, ...current] : current.map((item) => item.id === saved.id ? saved : item)); setEditing(null); setNotice(editing === 'new' ? 'Product added successfully.' : 'Product updated successfully.') }} product={editing === 'new' ? undefined : editing} /></div>}
      <Card className="motion-fade-up-delay border-[#d8cdb6] bg-[#fffdf7]">
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl text-[#29352b]">{copy.products} ({products.filter((product) => product.is_active).length} {copy.active})</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Input aria-label={copy.search} className="h-9 w-48" placeholder={copy.search} value={search} onChange={(event) => setSearch(event.target.value)} />
            <Button className="bg-[#53634f] text-white hover:bg-[#29352b]" onClick={() => setEditing('new')}><Plus />{copy.add}</Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:col-span-2">
            {[
              ['all', copy.all],
              ['stock', copy.inStock],
              ['out', copy.outOfStock],
              ['hidden', copy.hidden],
            ].map(([value, label]) => (
              <Button className="shrink-0 rounded-full" key={value} onClick={() => setFilter(value)} variant={filter === value ? 'default' : 'outline'}>{label}</Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filteredProducts.map((product) => (
              <div className={`motion-card grid gap-3 rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#789b78] hover:shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center ${product.is_active ? 'border-[#d8cdb6]' : 'border-dashed border-[#b9bda8] opacity-60'}`} key={product.id}>
                <img className="size-16 rounded-lg bg-[#f1ede2] object-contain p-1" src={product.image_url || '/product/product1.jpg'} alt="" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#29352b]">{product.name_en}</p>
                  <p className="truncate text-sm text-[#718073]">{product.name_mm}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    <span className="rounded-full bg-[#f1ede2] px-2 py-0.5 text-[#53634f]">{Number(product.price).toLocaleString()} MMK</span>
                    <span className={`rounded-full px-2 py-0.5 ${product.in_stock ? 'bg-[#e5eadc] text-[#53634f]' : 'bg-[#f5e6b8] text-[#704f38]'}`}>{product.in_stock ? copy.inStock : copy.outOfStock}</span>
                    <span className="rounded-full bg-[#eee9df] px-2 py-0.5 text-[#718073]">{product.is_active ? copy.visible : copy.hidden}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button onClick={() => updateProduct(product, { in_stock: !product.in_stock })} size="sm" variant="outline">{product.in_stock ? copy.markOut : copy.markIn}</Button>
                  <Button aria-label={`Edit ${product.name_en}`} onClick={() => setEditing(product)} size="icon-sm" variant="outline"><Pencil /></Button>
                  {product.is_active ? <Button aria-label={`Hide ${product.name_en}`} onClick={() => removeProduct(product)} size="icon-sm" variant="destructive"><Trash2 /></Button> : <Button aria-label={`Restore ${product.name_en}`} onClick={() => restoreProduct(product)} size="icon-sm" variant="outline"><RotateCcw /></Button>}
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && <p className="py-8 text-center text-sm text-[#718073]">{copy.noProducts}</p>}
          </div>
        </CardContent>
      </Card>
      <AdminTools admin={admin} admins={admins} language={language} onAdminsChanged={setAdmins} onNotice={setNotice} onSettingsSaved={(saved) => setSettings((current) => ({ ...current, ...saved }))} settings={settings} />
    </main>
  )
}

export default Admin

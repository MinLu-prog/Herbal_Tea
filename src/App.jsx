import { useCallback, useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

import TopBar from './components/TopBar/TopBar'
import { isMyanmar } from './lib/language'
import About from './screens/About/About'
import Contact from './screens/Contact/Contact'
import Home from './screens/Home/Home'
import ProductDetails from './screens/ProductDetails/ProductDetails'
import Admin from './screens/Admin/Admin'

function App() {
  if (window.location.pathname === '/admin') return <Admin />

  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'mm')
  const [message, setMessage] = useState('Connecting to the Express API...')
  const [settings, setSettings] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)

  const updateHealthMessage = useCallback((nextMessage) => {
    setMessage(nextMessage)
  }, [])

  const changeLanguage = useCallback((nextLanguage) => {
    setLanguage(nextLanguage)
    localStorage.setItem('language', nextLanguage)
  }, [])

  const openProductDetails = useCallback((product) => {
    setSelectedProduct(product)
    window.scrollTo(0, 0)
  }, [])

  const myanmar = isMyanmar(language)

  useEffect(() => {
    Promise.all([
      fetch('/api/health').then((response) => response.json()),
      fetch('/api/settings').then((response) => {
        if (!response.ok) throw new Error('Settings request failed')
        return response.json()
      }),
    ])
      .then(([health, shopSettings]) => {
        setMessage(health.message)
        setSettings(shopSettings)
      })
      .catch(() => {
        setMessage('Shop locally crafted herbal tea with confidence.')
      })
  }, [])

  return (
    <div
      className={`elder-friendly min-h-screen bg-[#f7f3e8] text-[#29352b] ${
        myanmar ? 'language-mm' : 'language-en'
      }`}
      lang={myanmar ? 'my' : 'en'}
    >
      <TopBar
        language={language}
        onHome={() => {
          setSelectedProduct(null)
          window.requestAnimationFrame(() => {
            document.getElementById('all-teas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        }}
        onLanguageChange={changeLanguage}
      />
      <main>
        {selectedProduct ? (
          <ProductDetails
            language={language}
            onBack={() => setSelectedProduct(null)}
            product={selectedProduct}
            settings={settings}
          />
        ) : (
          <>
            <Home
              language={language}
              onHealthChange={updateHealthMessage}
              onProductSelect={openProductDetails}
            />
            <About language={language} settings={settings} />
            <Contact language={language} settings={settings} />
          </>
        )}
      </main>
      <footer className="border-t border-[#c8b99b] bg-[#29352b] px-5 py-10 text-[#f7f3e8] md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center md:grid md:grid-cols-3 md:items-center">
          <img
            className="h-16 w-auto rounded-xl bg-[#f7f3e8] object-contain p-1"
            src="/logo/mya-nyo-herbal-tea.png"
            alt="Mya Nyo Herbal Tea"
          />
          <p className="text-sm text-[#b8ab92] md:col-start-3 md:justify-self-end">
            © 2026 Mya Nyo. {myanmar ? 'မူပိုင်ခွင့်များ ရယူထားသည်။' : 'All rights reserved.'}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-[#b8ab92] md:col-start-2 md:row-start-1 md:justify-self-center">
            {myanmar ? 'Zero One Company မှ မေတ္တာဖြင့် ပြုလုပ်သည်' : 'Made with'}
            <Heart aria-hidden="true" className="size-4 shrink-0 fill-[#e5d3a9] text-[#e5d3a9]" />
            {!myanmar && 'by Zero One Company'}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

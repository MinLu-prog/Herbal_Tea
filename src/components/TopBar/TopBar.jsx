import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import { isMyanmar } from '../../lib/language'

function TopBar({ language, onLanguageChange, onHome }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const myanmar = isMyanmar(language)
  const labels = myanmar
    ? {
      shop: 'ဆိုင်',
      about: 'ကျွန်ုပ်တို့အကြောင်း',
      contact: 'ဆက်သွယ်ရန်',
      order: 'မှာယူရန်',
      menu: 'မီနူးဖွင့်ရန်',
      menuTitle: 'မီနူး',
      menuDescription: 'Mya Nyo Herbal Tea ကို ရှာဖွေကြည့်ရှုရန်',
    }
    : {
      shop: 'Shop',
      about: 'About us',
      contact: 'Contact us',
      order: 'Order now',
      menu: 'Open menu',
      menuTitle: 'Menu',
      menuDescription: 'Explore Mya Nyo Herbal Tea',
    }

  const closeMobileMenu = () => setMobileMenuOpen(false)
  const scrollToContact = (event) => {
    event.preventDefault()
    closeMobileMenu()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    closeMobileMenu()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8cdb6] bg-[#f7f3e8]/95 backdrop-blur">
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5 md:px-8">
        <a
          className="shrink-0"
          href="#all-teas"
          onClick={(event) => {
            event.preventDefault()
            onHome()
          }}
          aria-label="Mya Nyo Herbal Tea home"
        >
          <img
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
            src="/logo/mya-nyo-herbal-tea.png"
            alt="Mya Nyo Herbal Tea"
          />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <Button asChild className="text-[#704f38] hover:bg-[#e5eadc] hover:text-[#29352b]" variant="ghost">
            <a href="#all-teas" onClick={(event) => scrollToSection(event, 'all-teas')}>{labels.shop}</a>
          </Button>
          <Button asChild className="text-[#704f38] hover:bg-[#e5eadc] hover:text-[#29352b]" variant="ghost">
            <a href="#about" onClick={(event) => scrollToSection(event, 'about')}>{labels.about}</a>
          </Button>
          <Button asChild className="text-[#704f38] hover:bg-[#e5eadc] hover:text-[#29352b]" variant="ghost">
            <a href="#contact" onClick={scrollToContact}>{labels.contact}</a>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            aria-label={myanmar ? 'Switch to English' : 'Switch to Burmese'}
            className="min-h-11 rounded-full border-[#9eac8f] px-4 text-base text-[#53634f]"
            onClick={() => onLanguageChange(myanmar ? 'en' : 'mm')}
            size="sm"
            variant="outline"
          >
            {myanmar ? 'EN' : 'မြန်မာ'}
          </Button>
          <Button asChild className="hidden min-h-11 rounded-full bg-[#53634f] px-5 text-base text-white hover:bg-[#29352b] sm:inline-flex">
            <a href="#contact" onClick={scrollToContact}>{labels.order}</a>
          </Button>
          <Button
            aria-label={labels.menu}
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            size="icon-lg"
            variant="outline"
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent className="w-[min(85vw,22rem)]" side="right">
          <SheetHeader className="border-b border-[#d8cdb6] pb-5">
            <SheetTitle className="text-left text-[#29352b]">{labels.menuTitle}</SheetTitle>
            <SheetDescription className="text-left">{labels.menuDescription}</SheetDescription>
          </SheetHeader>
          <nav className="grid gap-2 px-4" aria-label="Mobile navigation">
            {[
              [labels.shop, '#all-teas'],
              [labels.about, '#about'],
              [labels.contact, '#contact'],
            ].map(([label, href]) => (
              <Button
                asChild
                className="h-12 justify-start rounded-xl px-4 text-base text-[#53634f] hover:bg-[#e5eadc] hover:text-[#29352b]"
                key={href}
                variant="ghost"
              >
                <a href={href} onClick={(event) => scrollToSection(event, href.slice(1))}>
                  {label}
                </a>
              </Button>
            ))}
            <Button asChild className="mt-3 h-12 rounded-xl bg-[#53634f] text-white hover:bg-[#29352b]">
              <a href="#contact" onClick={scrollToContact}>{labels.order}</a>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default TopBar

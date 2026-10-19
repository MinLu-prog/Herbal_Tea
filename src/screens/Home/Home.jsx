import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Crown, Leaf, Search } from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'
import { getLocalizedValue, isMyanmar } from '../../lib/language'
import useScrollReveal from '../../hooks/use-scroll-reveal'

const fallbackProducts = [
  {
    id: 'herbal-tea',
    name_en: 'Mya Nyo Herbal Tea',
    description_en: 'A gentle botanical blend for your daily ritual.',
    price: 8000,
    image_url: null,
  },
  {
    id: 'green-tea',
    name_en: 'Lemongrass Green Tea',
    description_en: 'Fresh green tea with a bright citrus finish.',
    price: 10000,
    image_url: null,
  },
  {
    id: 'flower-blend',
    name_en: 'Calming Flower Blend',
    description_en: 'A naturally soothing blend for quiet evenings.',
    price: 9500,
    image_url: null,
  },
  {
    id: 'tea-bags',
    name_en: 'Traditional Tea Bags',
    description_en: 'Convenient, fragrant tea for every morning.',
    price: 7500,
    image_url: null,
  },
]

const fallbackCategories = [
  { id: 'all', name_en: 'All teas' },
  { id: 'herbal', name_en: 'Herbal blends' },
  { id: 'green', name_en: 'Green tea' },
  { id: 'bags', name_en: 'Tea bags' },
  { id: 'wellness', name_en: 'Wellness' },
]

const heroImages = [
  {
    src: '/product/product1.jpg',
    alt: 'Dried herbal tea leaves ready for brewing',
  },
  {
    src: '/product/product2.jpg',
    alt: 'Mya Nyo Herbal Tea bag and tea cup',
  },
  {
    src: '/product/product3.jpg',
    alt: 'Mya Nyo Herbal Tea beside a tea garden',
  },
  {
    src: '/product/product4.jpg',
    alt: 'Mya Nyo Herbal Tea products in a basket',
  },
  {
    src: '/product/product5.jpg',
    alt: 'Mya Nyo Herbal Tea jar with butterfly pea flowers',
  },
]

const formatPrice = (price) => `${Number(price).toLocaleString()} MMK`

function Home({ language, onHealthChange, onProductSelect }) {
  const myanmar = isMyanmar(language)
  const copy = myanmar
    ? {
      eyebrow: 'သဘာဝပါဝင်ပစ္စည်းများ။ နေ့စဉ်ကျန်းမာရေး။',
      title: 'သင့်အတွက် ပိုကောင်းသော လက်ဖက်ရည်။',
      description: 'မြန်မာနိုင်ငံတွင် ဂရုတစိုက်ပြုလုပ်ထားသော လန်းဆန်းသည့် ဆေးဖက်ဝင်လက်ဖက်ရည်များကို ရှာဖွေလိုက်ပါ။',
      shop: 'ပစ္စည်းများ',
      story: 'ကျွန်ုပ်တို့အကြောင်း',
      all: 'လက်ဖက်ရည်အားလုံး',
      collection: 'ကျွန်ုပ်တို့၏ စုစည်းမှု',
      featured: 'ရွေးချယ်ထားသော လက်ဖက်ရည်များ',
      showing: 'ပစ္စည်း',
      previous: 'ယခင်',
      next: 'နောက်တစ်ခု',
      inStock: 'လက်ကျန်ရှိ',
      outOfStock: 'လက်ကျန်မရှိ',
      royal: 'အထူးရွေးချယ်မှု',
      viewDetails: 'အသေးစိတ်ကြည့်ရန်',
      ordering: 'မှာယူနည်း',
      orderingTitle: 'သင့်လက်ဖက်ရည်ကို လွယ်ကူစွာ မှာယူပါ။',
      orderingSteps: [
        ['ပစ္စည်းရွေးချယ်ပါ', 'သင်ကြိုက်နှစ်သက်သော လက်ဖက်ရည်ကို ရွေးချယ်ပြီး အသေးစိတ်ကြည့်ပါ။'],
        ['တိုက်ရိုက်ဆက်သွယ်ပါ', 'Viber သို့မဟုတ် ဖုန်းမှတစ်ဆင့် ကျွန်ုပ်တို့ကို ဆက်သွယ်ပါ။'],
        ['ပို့ဆောင်မှုအတည်ပြုပါ', 'သင့်လိပ်စာနှင့် ပို့ဆောင်မှုအချက်အလက်များကို အတည်ပြုပါ။'],
      ],
      fallback: 'သင့်နေ့စဉ် လက်ဖက်ရည်အချိန်အတွက် ဂရုစိုက်ပြုလုပ်ထားသည်။',
    }
    : {
      eyebrow: 'Pure ingredients. Everyday wellness.',
      title: 'Better tea for a better you.',
      description: 'Discover refreshing herbal blends made with care in Myanmar. Find a peaceful moment in every cup.',
      shop: 'Products',
      story: 'Our story',
      all: 'All teas',
      collection: 'Our collection',
      featured: 'Featured herbal teas',
      showing: 'premium items',
      previous: 'Previous',
      next: 'Next',
      inStock: 'IN STOCK',
      outOfStock: 'OUT OF STOCK',
      royal: 'ROYAL BLEND',
      viewDetails: 'View details',
      ordering: 'How ordering works',
      orderingTitle: 'A simple way to order your tea.',
      orderingSteps: [
        ['Choose a product', 'Select a tea you like and open its details.'],
        ['Contact us directly', 'Reach us through Viber or phone to place your order.'],
        ['Confirm delivery', 'Share your address and confirm the delivery details.'],
      ],
      fallback: 'Carefully prepared for your daily tea ritual.',
    }
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [carouselApi, setCarouselApi] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const productsReveal = useScrollReveal()

  useEffect(() => {
    if (!carouselApi) return undefined

    const updateActiveSlide = () => setActiveSlide(carouselApi.selectedScrollSnap())
    updateActiveSlide()
    carouselApi.on('select', updateActiveSlide)

    const interval = window.setInterval(() => {
      carouselApi.scrollNext()
    }, 5000)

    return () => {
      carouselApi.off('select', updateActiveSlide)
      window.clearInterval(interval)
    }
  }, [carouselApi])

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((response) => {
        if (!response.ok) throw new Error('Products request failed')
        return response.json()
      }),
      fetch('/api/categories').then((response) => {
        if (!response.ok) throw new Error('Categories request failed')
        return response.json()
      }),
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData)
        setCategories([{ id: 'all', name_en: 'All teas', name_mm: 'လက်ဖက်ရည်အားလုံး' }, ...categoryData])
        onHealthChange(myanmar ? 'ဆိုင်သည် Express API နှင့် ချိတ်ဆက်ထားပါသည်။' : 'Shop is connected to the Express API.')
      })
      .catch(() => {
        onHealthChange(myanmar ? 'ဆိုင်နှင့် ချိတ်ဆက်နေစဉ် ရွေးချယ်ထားသော လက်ဖက်ရည်များကို ပြသနေပါသည်။' : 'Showing featured teas while the shop is connecting.')
      })
  }, [myanmar, onHealthChange])

  const visibleProducts = activeCategory === 'all'
    ? products
    : products.filter((product) => String(product.category_id) === String(activeCategory))
  const productsPerPage = 8
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage))
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  )
  const changeCategory = (categoryId) => {
    setActiveCategory(categoryId)
    setCurrentPage(1)
  }
  const changePage = (page) => {
    setCurrentPage(page)
    window.requestAnimationFrame(() => {
      document.getElementById('all-teas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="border-b border-[#d8cdb6] bg-gradient-to-br from-[#fffdf7] via-[#f7f3e8] to-[#e5eadc]">
        <div className="relative mx-auto grid max-w-7xl items-center gap-5 overflow-hidden px-4 py-7 sm:gap-8 sm:px-5 sm:py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:px-8 md:py-20">
          <img
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-8 block w-28 rotate-[12deg] opacity-10 sm:-right-20 sm:-top-16 sm:w-56 sm:opacity-20 lg:-right-28 lg:-top-28 lg:w-96 lg:opacity-25"
            src="/decorations/elegant-flower.png"
          />
          <img
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -left-12 block w-28 rotate-[-12deg] opacity-10 sm:-bottom-16 sm:-left-20 sm:w-56 sm:opacity-20 lg:-bottom-28 lg:-left-28 lg:w-96 lg:opacity-25"
            src="/decorations/elegant-flower.png"
          />
          <div className="motion-fade-up">
            <img
              aria-hidden="true"
              className="mb-3 h-auto w-40 opacity-70 sm:mb-5 sm:w-64 md:w-80"
              src="/decorations/heading-ornament.png"
            />
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6b43] sm:mb-4 sm:text-sm sm:tracking-[0.24em]">
              {copy.eyebrow}
            </p>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-[-0.04em] text-[#29352b] sm:text-5xl md:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#53634f] sm:mt-6 sm:text-lg sm:leading-8">
              {copy.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <Button
                asChild
                className="group min-h-11 rounded-full bg-[#53634f] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#29352b]/15 transition-all hover:-translate-y-0.5 hover:bg-[#29352b] hover:shadow-xl focus-visible:ring-[#53634f]"
              >
                <a href="#all-teas" onClick={(event) => scrollToSection(event, 'all-teas')}>
                  {copy.shop}
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                className="min-h-11 rounded-full border-[#b9bda8] bg-[#fffdf7]/80 px-6 py-2.5 font-semibold text-[#53634f] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#8e9d7d] hover:bg-[#e5eadc] hover:shadow-md focus-visible:ring-[#53634f]"
                variant="outline"
              >
                <a href="#about" onClick={(event) => scrollToSection(event, 'about')}>{copy.story}</a>
              </Button>
            </div>
          </div>

          <div className="motion-fade-up-delay relative mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-[#c8b99b] bg-[#fffdf7] shadow-xl shadow-[#704f38]/10 md:max-w-none md:rounded-[2rem]">
            <div className="absolute right-5 top-5 z-20 flex rotate-3 items-center gap-2 rounded-full border border-[#c6a75e] bg-[#f5e6b8] px-3 py-2 text-xs font-bold tracking-[0.12em] text-[#704f38] shadow-md shadow-[#704f38]/15">
              <Crown aria-hidden="true" className="size-4 fill-[#c6a75e] text-[#8a6b43]" />
              {copy.royal}
            </div>
            <Carousel
              className="mx-auto w-full"
              opts={{ loop: true }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="-ml-0">
                {heroImages.map((image) => (
                  <CarouselItem className="pl-0" key={image.src}>
                    <div className="relative overflow-hidden">
                      <img
                        className="block h-52 w-full object-contain sm:h-auto"
                        src={image.src}
                        alt={image.alt}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 border-slate-900/20 bg-slate-950/85 text-white hover:bg-slate-950" />
              <CarouselNext className="right-3 border-slate-900/20 bg-slate-950/85 text-white hover:bg-slate-950" />
            </Carousel>
            <div className="mt-4 flex justify-center gap-2" aria-label="Product image slides">
              {heroImages.map((image, index) => (
                <Button
                  aria-label={`Show slide ${index + 1}`}
                  className={`size-2 rounded-full p-0 ${
                    index === activeSlide ? 'bg-[#53634f]' : 'bg-[#c8b99b]'
                  }`}
                  key={image.src}
                  onClick={() => carouselApi?.scrollTo(index)}
                  variant="ghost"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section {...productsReveal} className={`mx-auto max-w-7xl scroll-mt-20 px-5 py-8 md:px-8 ${productsReveal.className}`} id="all-teas">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              className="min-h-11 shrink-0 rounded-full px-5 text-base"
              key={category.id}
              onClick={() => changeCategory(category.id)}
              variant={String(category.id) === String(activeCategory) ? 'default' : 'secondary'}
            >
              {getLocalizedValue(category, 'name', language, copy.all)}
            </Button>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-20 md:px-8" id="shop">
        <img
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 top-0 w-36 rotate-12 opacity-10 sm:-right-20 sm:w-56 sm:opacity-20 lg:-right-28 lg:w-80"
          src="/decorations/tea-botanical-ornament.svg"
        />
        <img
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-14 w-36 -rotate-12 opacity-10 sm:-bottom-16 sm:-left-20 sm:w-56 sm:opacity-20 lg:-bottom-24 lg:-left-28 lg:w-80"
          src="/decorations/tea-botanical-ornament.svg"
        />
        <div className="relative z-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#d8cdb6] pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a6b43]">
              {copy.collection}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#29352b]">
              {copy.featured}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#53634f]">
            <Search size={16} />
            {copy.showing}: {visibleProducts.length}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
            <Card
              className="motion-card group cursor-pointer overflow-hidden border-[#d8cdb6] bg-[#fffdf7] py-0 shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#53634f]"
              onClick={() => onProductSelect(product)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onProductSelect(product)
                }
              }}
              key={product.id}
              role="button"
              tabIndex={0}
            >
              <div className="relative flex aspect-[4/3] w-full items-center justify-center border-b border-[#e5dccb] bg-[#f1ede2] sm:aspect-[5/4]">
                <div className="absolute right-2 top-2 z-10 inline-flex rotate-2 items-center gap-1 rounded-full border border-[#c6a75e] bg-[#f5e6b8] px-2 py-1 text-[9px] font-bold tracking-[0.08em] text-[#704f38] sm:right-4 sm:top-4 sm:px-3 sm:text-[10px]">
                  <Crown aria-hidden="true" className="size-3 fill-[#c6a75e] text-[#8a6b43]" />
                  <span className="hidden sm:inline">{copy.royal}</span>
                  <span className="sm:hidden">ROYAL</span>
                </div>
                <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#53634f] px-2 py-1 text-[10px] font-bold text-white sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
                  <CheckCircle2 size={13} />
                  {product.in_stock === 0 ? copy.outOfStock : copy.inStock}
                </div>
                {product.image_url ? (
                  <img
                    className="block size-full object-contain p-2 transition duration-300 group-hover:scale-105 sm:p-3"
                    src={product.image_url}
                    alt={product.name_en}
                  />
                ) : (
                  <div className="flex size-32 items-center justify-center rounded-full bg-white/65 shadow-inner transition duration-300 group-hover:scale-105">
                    <Leaf className="size-16 text-[#789b78]" strokeWidth={1.25} />
                  </div>
                )}
              </div>
              <CardContent className="p-3 sm:p-5">
                <h3 className="text-sm font-semibold text-[#29352b] sm:text-lg">
                  {getLocalizedValue(product, 'name', language)}
                </h3>
                <p className="mt-2 min-h-12 text-xs leading-5 text-[#53634f] sm:text-sm sm:leading-6">
                  {getLocalizedValue(product, 'description', language, copy.fallback)}
                </p>
                <p className="mt-3 text-sm font-bold text-[#8a6b43] sm:mt-4 sm:text-lg">{formatPrice(product.price)}</p>
                <Button
                  className="mt-3 min-h-9 w-full rounded-xl border-[#b9bda8] px-2 text-[11px] leading-4 text-[#53634f] hover:bg-[#e5eadc] sm:mt-4 sm:min-h-10 sm:px-4 sm:text-sm sm:leading-normal"
                  onClick={(event) => {
                    event.stopPropagation()
                    onProductSelect(product)
                  }}
                  variant="outline"
                >
                  {copy.viewDetails}
                  <ArrowRight className="size-3 sm:size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {pageCount > 1 && (
          <nav className="mt-6 grid w-full grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-2 sm:mt-8" aria-label={myanmar ? 'စာမျက်နှာရွေးချယ်ရန်' : 'Product pages'}>
            <Button
              aria-label={copy.previous}
              className="min-w-0 rounded-full px-3 text-xs sm:flex-none sm:px-4 sm:text-sm"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              <span className="sm:inline">{copy.previous}</span>
            </Button>
            <Button
              aria-label={copy.next}
              className="min-w-0 rounded-full px-3 text-xs sm:order-last sm:flex-none sm:px-4 sm:text-sm"
              disabled={currentPage === pageCount}
              onClick={() => changePage(currentPage + 1)}
              variant="outline"
            >
              <span className="sm:inline">{copy.next}</span>
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
            <div className="col-span-2 order-3 flex min-w-0 max-w-full items-center justify-start gap-1 overflow-x-auto py-1 sm:order-none sm:w-auto sm:justify-center sm:overflow-visible" aria-label={myanmar ? 'လက်ရှိစာမျက်နှာ' : 'Current page'}>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <Button
                  aria-current={page === currentPage ? 'page' : undefined}
                  aria-label={`${myanmar ? 'စာမျက်နှာ' : 'Page'} ${page}`}
                  className="size-9 shrink-0 rounded-full p-0 text-xs sm:size-10 sm:text-sm"
                  key={page}
                  onClick={() => changePage(page)}
                  variant={page === currentPage ? 'default' : 'outline'}
                >
                  {page}
                </Button>
              ))}
            </div>
          </nav>
        )}
        </div>
      </section>

      <section className="border-y border-[#d8cdb6] bg-[#f1ede2] px-4 py-10 sm:px-5 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6b43] sm:text-sm sm:tracking-[0.2em]">
            {copy.ordering}
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-[#29352b] sm:mt-3 sm:text-3xl md:text-4xl">
            {copy.orderingTitle}
          </h2>
          <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3">
            {copy.orderingSteps.map(([title, description], index) => (
              <div className="rounded-2xl border border-[#d8cdb6] bg-[#fffdf7] p-4 shadow-sm sm:p-6" key={title}>
                <div className="flex size-8 items-center justify-center rounded-full bg-[#53634f] text-sm font-bold text-white sm:size-10 sm:text-lg">
                  {index + 1}
                </div>
                <h3 className="mt-3 text-base font-semibold text-[#29352b] sm:mt-5 sm:text-xl">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#53634f] sm:mt-2 sm:text-base sm:leading-7">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home

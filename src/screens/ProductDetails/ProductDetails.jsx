import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Phone } from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { getLocalizedValue, isMyanmar } from '../../lib/language'

function ProductDetails({ language, product, settings, onBack }) {
  const myanmar = isMyanmar(language)
  const phone = settings.phone || '+959xxxxxxxxx'
  const viber = settings.viber || phone
  const name = getLocalizedValue(product, 'name', language)
  const flavor = getLocalizedValue(product, 'flavor', language, myanmar ? 'သဘာဝအရသာ' : 'Natural blend')
  const size = product.size || (myanmar ? 'ပုံမှန်အရွယ်' : 'Regular size')
  const description = getLocalizedValue(
    product,
    'description',
    language,
    myanmar ? 'နေ့စဉ်သောက်သုံးရန် ဂရုတစိုက်ပြင်ဆင်ထားပါသည်။' : 'Carefully prepared for your daily tea ritual.',
  )
  const images = product.images?.length ? product.images : [product.image_url || '/product/product1.jpg']
  const [selectedImage, setSelectedImage] = useState(0)
  const image = images[selectedImage]

  useEffect(() => {
    setSelectedImage(0)
  }, [product.id])
  const viberMessage = encodeURIComponent(
    myanmar
      ? `မှာယူလိုပါသည်\nပစ္စည်း: ${name}\nအရွယ်အစား: ${size}\nအရသာ: ${flavor}\nလိပ်စာ: `
      : `I would like to order:\nProduct: ${name}\nSize: ${size}\nFlavor: ${flavor}\nDelivery address: `,
  )

  return (
    <section className="motion-fade-up relative isolate mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <img
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-8 z-[-1] w-28 -scale-x-100 rotate-[-12deg] opacity-10 sm:-left-20 sm:-top-16 sm:w-56 sm:opacity-20 lg:-left-28 lg:-top-28 lg:w-80 lg:opacity-25"
        src="/decorations/product_section_decoration-removebg-preview.png"
      />
      <img
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-8 z-[-1] w-28 rotate-[-12deg] opacity-10 sm:-right-20 sm:-top-16 sm:w-56 sm:opacity-20 lg:-right-28 lg:-top-28 lg:w-80 lg:opacity-25"
        src="/decorations/product_section_decoration-removebg-preview.png"
      />
      <img
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1 z-[-1] w-16 -rotate-[18deg] opacity-10 [filter:sepia(1)_saturate(3)_hue-rotate(355deg)_brightness(0.8)] sm:left-4 sm:top-3 sm:w-24 sm:opacity-15 lg:left-8 lg:top-5 lg:w-32"
        src="/decorations/product-page-floral-ornament.svg"
      />
      <img
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1 z-[-1] w-16 rotate-[18deg] opacity-10 [filter:sepia(1)_saturate(3)_hue-rotate(355deg)_brightness(0.8)] sm:right-4 sm:top-3 sm:w-24 sm:opacity-15 lg:right-8 lg:top-5 lg:w-32"
        src="/decorations/product-page-floral-ornament.svg"
      />

      <div className="relative z-10">
        <Button
          className="mb-3 rounded-full text-[#53634f] sm:mb-6"
          onClick={onBack}
          variant="ghost"
        >
          <ArrowLeft />
          {myanmar ? 'ပစ္စည်းများသို့ ပြန်သွားရန်' : 'Back to products'}
        </Button>

        <Card className="motion-fade-up-delay overflow-hidden border-[#d8cdb6] bg-[#fffdf7] shadow-sm">
          <div className="grid gap-5 p-3 sm:gap-8 sm:p-6 md:grid-cols-[1fr_0.95fr] md:gap-10 md:p-8">
          <div>
            <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-[#d8cdb6] bg-[#f1ede2] sm:min-h-[500px]">
              <div className="absolute left-3 top-3 z-10 rounded-full bg-[#53634f] px-2.5 py-1 text-[10px] font-bold text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
                {product.in_stock === 0
                  ? (myanmar ? 'လက်ကျန်မရှိ' : 'OUT OF STOCK')
                  : (myanmar ? 'လက်ကျန်ရှိ' : 'IN STOCK')}
              </div>
              <img className="h-full max-h-[560px] w-full object-contain p-2 transition-opacity duration-300 sm:p-8" src={image} alt={name} />
              {images.length > 1 && (
                <>
                  <Button
                    aria-label={myanmar ? 'ယခင်ပုံ' : 'Previous image'}
                    className="absolute left-2 top-1/2 size-9 -translate-y-1/2 rounded-full bg-[#29352b]/75 p-0 text-white hover:bg-[#29352b] sm:left-4"
                    onClick={() => setSelectedImage((current) => (current - 1 + images.length) % images.length)}
                    size="icon"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    aria-label={myanmar ? 'နောက်ပုံ' : 'Next image'}
                    className="absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-full bg-[#29352b]/75 p-0 text-white hover:bg-[#29352b] sm:right-4"
                    onClick={() => setSelectedImage((current) => (current + 1) % images.length)}
                    size="icon"
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto sm:mt-3 sm:gap-3">
              {images.map((thumbnail, index) => (
                <button
                  aria-label={`${myanmar ? 'ပုံ' : 'Image'} ${index + 1}`}
                  className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f1ede2] transition-transform duration-200 hover:-translate-y-0.5 sm:size-20 ${index === selectedImage ? 'border-[#789b78]' : 'border-[#d8cdb6]'}`}
                  key={thumbnail}
                  onClick={() => setSelectedImage(index)}
                  type="button"
                >
                  <img className="aspect-square w-full object-contain p-2" src={thumbnail} alt="" />
                </button>
              ))}
            </div>
          </div>

          <CardContent className="flex flex-col p-0 md:py-2">
            <p className="w-fit rounded-full bg-[#e5eadc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#53634f] sm:px-3 sm:text-xs sm:tracking-[0.16em]">
              {myanmar ? 'ဆေးဖက်ဝင်လက်ဖက်ရည်' : 'Herbal tea'}
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-[#29352b] sm:mt-4 sm:text-4xl">
              {name}
            </h1>
            <p className="mt-2 text-xl font-bold text-[#8a6b43] sm:mt-4 sm:text-3xl">
              {Number(product.price).toLocaleString()} MMK
            </p>
            <p className="mt-2 text-sm leading-5 text-[#53634f] sm:mt-5 sm:text-base sm:leading-7">{description}</p>

            <Separator className="my-4 sm:my-8" />

            <div className="grid gap-3 text-xs sm:gap-5 sm:text-sm">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a6b43] sm:mb-2 sm:text-sm sm:tracking-[0.14em]">
                  {myanmar ? 'အရွယ်အစား' : 'Size'}
                </p>
                <Button className="h-9 rounded-xl bg-[#53634f] px-3 text-xs text-white hover:bg-[#29352b] sm:h-10 sm:px-4 sm:text-sm">
                  {size}
                </Button>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a6b43] sm:mb-2 sm:text-sm sm:tracking-[0.14em]">
                  {myanmar ? 'အရသာ' : 'Flavor'}
                </p>
                <Button className="h-9 rounded-xl bg-[#53634f] px-3 text-xs text-white hover:bg-[#29352b] sm:h-10 sm:px-4 sm:text-sm">
                  {flavor}
                </Button>
              </div>
            </div>

            <Separator className="my-4 sm:my-8" />

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a6b43] sm:mb-3 sm:text-xs sm:tracking-[0.16em]">
              {myanmar ? 'မှာယူရန် ဆက်သွယ်ပါ' : 'Order and checkout options'}
            </p>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <Button asChild className="h-11 w-full min-w-0 rounded-xl bg-[#704f8a] px-3 text-sm text-white hover:bg-[#57396d] sm:h-14 sm:px-7 sm:text-base">
                <a className="flex w-full flex-nowrap items-center justify-center gap-2 whitespace-nowrap" href={`viber://chat?number=${encodeURIComponent(viber)}&text=${viberMessage}`}>
                  <MessageCircle className="shrink-0" />
                  {myanmar ? 'Viber မှ မှာယူရန်' : 'Order via Viber'}
                </a>
              </Button>
              <Button asChild className="h-11 w-full min-w-0 rounded-xl bg-[#29352b] px-3 text-sm text-white hover:bg-[#1d281f] sm:h-14 sm:px-7 sm:text-base">
                <a className="flex w-full flex-nowrap items-center justify-center gap-2 whitespace-nowrap" href={`tel:${phone}`}>
                  <Phone className="shrink-0" />
                  {myanmar ? 'ဖုန်းဖြင့်မှာယူရန်' : 'Order via phone'}
                </a>
              </Button>
            </div>
          </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ProductDetails

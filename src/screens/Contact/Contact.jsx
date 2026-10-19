import { MessageCircle, Phone } from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { isMyanmar } from '../../lib/language'
import useScrollReveal from '../../hooks/use-scroll-reveal'

function Contact({ language, settings }) {
  const contactReveal = useScrollReveal()
  const myanmar = isMyanmar(language)
  const phone = settings.phone || '+959xxxxxxxxx'
  const viber = settings.viber || phone

  return (
    <section {...contactReveal} className={`relative overflow-hidden bg-[#53634f] px-4 py-12 text-[#fffdf7] sm:px-5 sm:py-20 md:px-8 ${contactReveal.className}`} id="contact">
      <img
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-8 w-32 opacity-20 brightness-0 invert sm:-left-20 sm:-top-16 sm:w-56 sm:opacity-30 lg:-left-28 lg:-top-24 lg:w-80"
        src="/decorations/product-page-floral-ornament.svg"
      />
      <img
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-12 w-32 rotate-180 opacity-20 brightness-0 invert sm:-bottom-16 sm:-right-20 sm:w-56 sm:opacity-30 lg:-bottom-24 lg:-right-28 lg:w-80"
        src="/decorations/product-page-floral-ornament.svg"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 sm:gap-10 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div className="motion-fade-up">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e5d3a9] sm:text-sm sm:tracking-[0.24em]">
            {myanmar ? 'ဆက်သွယ်ရန်' : 'Contact us'}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:mt-3 sm:text-4xl md:text-5xl">
            {myanmar ? 'သင့်အတွက် သင့်တော်သော လက်ဖက်ရည်ကို ရှာဖွေလိုက်ပါ။' : "Let's find your perfect tea."}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#f7f3e8] sm:mt-5 sm:text-lg sm:leading-8">
            {myanmar
              ? 'လက်ဖက်ရည်အကြောင်း မေးမြန်းလိုပါသလား။ သို့မဟုတ် မှာယူလိုပါသလား။ တိုက်ရိုက်ဆက်သွယ်လိုက်ပါ။'
              : 'Have a question about our blends or want to place an order? Reach us directly and we will be happy to help.'}
          </p>
        </div>

        <Card className="motion-fade-up-delay border-[#789b78] bg-[#29352b] text-[#fffdf7] shadow-xl shadow-[#29352b]/20">
          <CardContent className="grid gap-2 p-4 sm:gap-3 sm:p-6">
            <Button asChild className="h-10 w-full justify-start rounded-full bg-[#fffdf7] px-4 text-sm text-[#29352b] hover:bg-[#e5d3a9] sm:h-12 sm:px-5 sm:text-base">
              <a className="flex w-full flex-nowrap items-center gap-3 whitespace-nowrap" href={`tel:${phone}`}>
                <Phone className="shrink-0" />
                {myanmar ? 'ဖုန်းခေါ်ရန်' : 'Call us'}: {phone}
              </a>
            </Button>
            <Button asChild className="h-10 w-full justify-start rounded-full bg-[#fffdf7] px-4 text-sm text-[#29352b] hover:bg-[#e5d3a9] sm:h-12 sm:px-5 sm:text-base">
              <a className="flex w-full flex-nowrap items-center gap-3 whitespace-nowrap" href={`viber://chat?number=${encodeURIComponent(viber)}`}>
                <MessageCircle className="shrink-0" />
                {myanmar ? 'Viber မှ ဆက်သွယ်ရန်' : 'Chat on Viber'}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Contact

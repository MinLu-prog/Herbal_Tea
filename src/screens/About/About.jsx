import { Leaf, Sprout, Sun } from 'lucide-react'

import { Card, CardContent } from '../../components/ui/card'
import { isMyanmar } from '../../lib/language'
import useScrollReveal from '../../hooks/use-scroll-reveal'

function About({ language, settings }) {
  const aboutReveal = useScrollReveal()
  const copy = isMyanmar(language)
    ? {
      eyebrow: 'မြညိုအကြောင်း',
      title: 'အေးချမ်းပြီး ကျန်းမာသော အချိန်များအတွက် လက်ဖက်ရည်။',
      description: settings.about_description_mm || 'မြညိုဆေးဖက်ဝင်လက်ဖက်ရည်သည် ရိုးရာပါဝင်ပစ္စည်းများနှင့် ဂရုတစိုက်ပြင်ဆင်မှုကို ပေါင်းစပ်ကာ နေ့စဉ်ကျန်းမာရေးအတွက် ရိုးရှင်းပြီး ပျော်ရွှင်စေပါသည်။',
      items: [
        ['သဘာဝပါဝင်ပစ္စည်းများ', 'ရင်းနှီးသော ဆေးဖက်ဝင်အပင်များကို ဂရုတစိုက် ရွေးချယ်ပါသည်။'],
        ['ရည်ရွယ်ချက်ဖြင့် ပြုလုပ်သည်', 'နေ့စဉ်ဘဝနှင့် ကိုက်ညီစေရန် ရောစပ်ပြင်ဆင်ထားပါသည်။'],
        ['ပိုကောင်းသော အလေ့အထ', 'ခဏတာအနားယူပြီး လက်ဖက်ရည်တစ်ခွက်ကို အေးချမ်းစွာ သောက်သုံးပါ။'],
      ],
    }
    : {
      eyebrow: 'About Mya Nyo',
      title: 'Tea made for quiet, healthy moments.',
      description: settings.about_description_en || 'Mya Nyo Herbal Tea brings traditional ingredients and thoughtful preparation together to make everyday wellness simple and enjoyable.',
      items: [
        ['Natural ingredients', 'We select familiar botanical ingredients with care.'],
        ['Made with purpose', 'Every blend is prepared to fit your daily routine.'],
        ['A better ritual', 'Take a pause, make a cup, and enjoy the moment.'],
      ],
    }

  return (
    <section {...aboutReveal} className={`relative overflow-hidden border-y border-[#d8cdb6] bg-[#fffdf7] ${aboutReveal.className}`} id="about">
      <img
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-12 w-40 rotate-12 opacity-15 sm:-right-24 sm:-top-20 sm:w-64 sm:opacity-25 lg:-right-32 lg:-top-28 lg:w-96"
        src="/decorations/elegant-flower.png"
      />
      <img
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-16 w-40 -rotate-12 opacity-15 sm:-bottom-20 sm:-left-24 sm:w-64 sm:opacity-25 lg:-bottom-28 lg:-left-32 lg:w-96"
        src="/decorations/elegant-flower.png"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="motion-fade-up max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6b43]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#29352b] md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#53634f]">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [Leaf, ...copy.items[0]],
            [Sprout, ...copy.items[1]],
            [Sun, ...copy.items[2]],
          ].map(([Icon, title, description]) => (
            <Card className="motion-card border-[#d8cdb6] bg-[#f7f3e8] shadow-none" key={title}>
              <CardContent className="p-6">
                <Icon className="text-[#789b78]" size={28} strokeWidth={1.7} />
                <h3 className="mt-5 text-lg font-semibold text-[#29352b]">{title}</h3>
                <p className="mt-2 leading-7 text-[#53634f]">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About

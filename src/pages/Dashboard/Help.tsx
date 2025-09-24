import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { HelpCircle, Mail, MessageCircle, Book, Video, FileText } from 'lucide-react'

export default function Help() {
  const helpSections = [
    {
      title: 'Boshlash',
      description: 'Vazifa boshqaruvchisidan foydalanish asoslarini o\'rganing',
      icon: Book,
      items: [
        'Birinchi vazifangizni qanday yaratish',
        'Vazifa muhimliklarini tushunish',
        'Vazifa kategoriyalarini sozlash',
        'Dashboardingizni boshqarish'
      ]
    },
    {
      title: 'Vazifa Boshqaruvi',
      description: 'Vazifalaringizni tashkil etish san\'atini o\'zlashtiring',
      icon: FileText,
      items: [
        'Vazifalar yaratish va tahrirlash',
        'Vazifa holatlaridan samarali foydalanish',
        'Kategoriyalar bilan tashkil etish',
        'Muddatlar va eslatmalar o\'rnatish'
      ]
    },
    {
      title: 'Hamkorlik',
      description: 'Jamoangiz bilan birga ishlang',
      icon: MessageCircle,
      items: [
        'Jamoa a\'zolarini taklif qilish',
        'Vazifalar va doskalarni ulashish',
        'Izohlar va yangilanishlar',
        'Ruxsatlarni boshqarish'
      ]
    },
    {
      title: 'Muammolarni Hal Qilish',
      description: 'Keng tarqalgan muammolar va yechimlar',
      icon: HelpCircle,
      items: [
        'Kirish va hisob muammolari',
        'Vazifa sinxronizatsiya muammolari',
        'Ishlash tezligini optimallashtirish',
        'Ma\'lumotlarni zaxiralash va tiklash'
      ]
    }
  ]

  const contactMethods = [
    {
      title: 'Email Yordami',
      description: '24 soat ichida email orqali yordam oling',
      icon: Mail,
      action: 'Email Yuborish',
      contact: 'support@taskmanager.com'
    },
    {
      title: 'Jonli Chat',
      description: 'Qo\'llab-quvvatlash jamoamiz bilan real vaqtda suhbatlash',
      icon: MessageCircle,
      action: 'Chatni Boshlash',
      contact: '9:00 - 18:00 da mavjud'
    },
    {
      title: 'Video Darslar',
      description: 'Qadam-baqadam video qo\'llanmalarni tomosha qiling',
      icon: Video,
      action: 'Videolarni Ko\'rish',
      contact: 'YouTube Kanal'
    }
  ]

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yordam va Qo'llab-quvvatlash</h1>
        <p className="text-gray-600 mt-2">Savollaringizga javob toping va kerakli yordamni oling</p>
      </div>

      {/* Quick Help Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {helpSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Contact Support */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Qo'llab-quvvatlash bilan Bog'lanish</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{method.contact}</p>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      {method.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tez-tez So'raladigan Savollar</h2>
        <div className="space-y-4">
          {[
            {
              question: "Yangi vazifani qanday yarataman?",
              answer: "Har qanday sahifada 'Vazifa qo'shish' tugmasini bosing, vazifa tafsilotlarini to'ldiring, muhimlikni belgilang va vazifangizni yaratish uchun 'Tayyor' tugmasini bosing."
            },
            {
              question: "Vazifalarni jamoa a'zolariga tayinlay olamanmi?",
              answer: "Albatta! Vazifa yaratish yoki tahrirlash paytida uni ish maydoningizga kirish huquqi bo'lgan har qanday jamoa a'zosiga tayinlashingiz mumkin."
            },
            {
              question: "Vazifalarimni kategoriyalarga qanday tashkil etaman?",
              answer: "Maxsus kategoriyalar yaratish uchun Vazifa Kategoriyalari sahifasiga o'ting. Keyin vazifalarni yaxshiroq tashkil etish uchun bu kategoriyalarga tayinlashingiz mumkin."
            },
            {
              question: "Muhim Vazifalar va Mening Vazifalarim o'rtasidagi farq nima?",
              answer: "Muhim Vazifalar darhol e'tibor berilishi kerak bo'lgan yuqori muhimlikdagi vazifalar, Mening Vazifalarim esa muhimlikdan qat'i nazar, barcha shaxsiy vazifalaringizni o'z ichiga oladi."
            },
            {
              question: "Vazifalarim uchun muddat belgilay olamanmi?",
              answer: "Albatta! Vazifa yaratish yoki tahrirlash paytida muddatni belgilashingiz mumkin. Muddatiga yaqinlashayotgan vazifalar dashboardingizda ta'kidlanadi."
            }
          ].map((faq, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Qo'shimcha Resurslar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-5 w-5 text-blue-600" />
                <span>Foydalanuvchi Qo'llanmasi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Barcha funksiyalar bo'yicha batafsil ko'rsatmalar uchun bizning keng qamrovli foydalanuvchi qo'llanmamizni yuklab oling.
              </p>
              <Button variant="outline" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">PDF Yuklab Olish</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-purple-600" />
                <span>Video Darslar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Ilg'or funksiyalardan samarali foydalanishni o'rganish uchun video darslarimizni tomosha qiling.
              </p>
              <Button variant="outline" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">Hozir Tomosha Qiling</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

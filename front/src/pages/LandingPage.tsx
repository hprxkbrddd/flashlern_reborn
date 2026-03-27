import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check, Brain, Zap, Trophy, Mail, MapPin, Phone } from "lucide-react";
// @ts-ignore — модуль api.js без декларации типов
import api from "../utils/api";

interface LandingImagesResponse {
  heroImage: string | null;
  aboutImage: string | null;
  featuresImage: string | null;
  contactImage: string | null;
}

function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [landingImages, setLandingImages] = useState<LandingImagesResponse | null>(null);

  useEffect(() => {
    api
      .get<LandingImagesResponse>("/landing/images")
      .then((res: { data: LandingImagesResponse }) => setLandingImages(res.data))
      .catch(() => setLandingImages(null));
  }, []);

  const heroSrc = landingImages?.heroImage ?? null;
  const aboutSrc = landingImages?.aboutImage ?? null;
  const featuresSrc = landingImages?.featuresImage ?? null;
  const contactSrc = landingImages?.contactImage ?? null;

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "features", "pricing", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, margin: "-100px" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {},
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeSection={activeSection} />

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-24 px-6 bg-gradient-to-b from-white to-orange-50 border-b border-gray-100"
      >
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-orange-500 mb-3">
              Платформа для запоминания
            </p>
            <h1 className="text-gray-900 mb-6">
              Освой любой материал с{" "}
              <span className="text-orange-500">FlashLearn</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Умный способ учиться и запоминать надолго. Создавайте наборы карточек, следите за прогрессом и
              достигайте учебных целей быстрее и увереннее.
            </p>
            <div className="flex gap-4">
              <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-6">
                Начать бесплатно
              </Button>
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-6">
                Смотреть демо
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {heroSrc ? (
                <>
                  <ImageWithFallback
                    src={heroSrc}
                    alt="Учёба с FlashLearn"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none" />
                </>
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  Изображение загружается
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center py-24 px-6 bg-white border-y border-gray-100"
      >
        <div className="max-w-7xl w-full">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-orange-500 mb-3">
              О платформе
            </p>
            <h2 className="text-gray-900 mb-4">Что такое FlashLearn</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы меняем подход к обучению, соединяя проверенные методики запоминания и современные технологии.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              {...fadeInUp}
              className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100 min-h-[400px]"
            >
              {aboutSrc ? (
                <ImageWithFallback
                  src={aboutSrc}
                  alt="О платформе FlashLearn"
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-gray-400 text-sm">
                  Нет изображения
                </div>
              )}
            </motion.div>

            <motion.div
              {...staggerContainer}
              className="space-y-6"
            >
              <motion.div {...fadeInUp}>
                <h3 className="text-gray-900 mb-3">Наша миссия</h3>
                <p className="text-gray-600">
                  Сделать обучение доступным, эффективным и по‑настоящему увлекательным для каждого.
                  Мы уверены, что с правильными инструментами любой человек может освоить любой предмет.
                </p>
              </motion.div>

              <motion.div {...fadeInUp} className="space-y-4">
                {[
                  "Научно обоснованные методики запоминания",
                  "Персонализированные планы обучения",
                  "Наглядная аналитика и прогресс",
                  "Совместная работа и обмен наборами"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-b from-white to-orange-50 border-y border-gray-100"
      >
        <div className="max-w-7xl w-full">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-orange-500 mb-3">
              Возможности
            </p>
            <h2 className="text-gray-900 mb-4">Мощные инструменты для учёбы</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Всё, что нужно, чтобы ускорить и упростить ваш путь в обучении.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Brain,
                title: "Умные карточки",
                description: "Карточки, которые подстраиваются под ваш темп и стиль обучения"
              },
              {
                icon: Zap,
                title: "Интервальные повторения",
                description: "Максимальное запоминание благодаря алгоритмам интервального повторения"
              },
              {
                icon: Trophy,
                title: "Прогресс и достижения",
                description: "Наглядные графики и достижения, которые мотивируют продолжать"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow border-orange-100">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeInUp}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            {featuresSrc ? (
              <ImageWithFallback
                src={featuresSrc}
                alt="Возможности платформы"
                className="w-full h-[400px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-2xl">
                Нет изображения
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-transparent flex items-center">
              <div className="text-white p-12 max-w-xl">
                <h3 className="text-white mb-4">Учитесь умнее, а не дольше</h3>
                <p className="text-white/90 mb-6">
                  Платформа FlashLearn помогает учиться эффективнее и получать больше результатов за меньшее время.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500">
                  Узнать больше
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="min-h-screen flex items-center justify-center py-24 px-6 bg-white border-y border-gray-100"
      >
        <div className="max-w-7xl w-full">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-orange-500 mb-3">
              Тарифы
            </p>
            <h2 className="text-gray-900 mb-4">Простые и понятные планы</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Выберите тариф, который лучше всего подходит под ваши задачи.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Бесплатный",
                price: "$0",
                features: [
                  "До 50 карточек",
                  "Базовые интервальные повторения",
                  "Доступ с мобильных устройств",
                  "Поддержка сообщества"
                ]
              },
              {
                name: "Pro",
                price: "$9",
                popular: true,
                features: [
                  "Безлимитные наборы карточек",
                  "Продвинутые алгоритмы повторения",
                  "Расширенная аналитика прогресса",
                  "Приоритетная поддержка",
                  "Инструменты для совместной работы"
                ]
              },
              {
                name: "Команда",
                price: "$29",
                features: [
                  "Всё из тарифа Pro",
                  "Управление участниками команды",
                  "Общие наборы карточек",
                  "Админ‑панель для мониторинга",
                  "Выделенная линия поддержки"
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className={`p-8 h-full relative ${
                  plan.popular ? "border-orange-500 border-2 shadow-xl" : "border-gray-200"
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${
                    plan.popular 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                  }`}>
                    Подключиться
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-b from-white to-orange-50 border-y border-gray-100"
      >
        <div className="max-w-7xl w-full">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-orange-500 mb-3">
              Контакты
            </p>
            <h2 className="text-gray-900 mb-4">Свяжитесь с нами</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Остались вопросы или есть идеи по улучшению платформы? Напишите нам — мы всегда открыты к диалогу.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              {...fadeInUp}
              className="relative rounded-2xl overflow-hidden shadow-xl"
            >
              {contactSrc ? (
                <ImageWithFallback
                  src={contactSrc}
                  alt="Свяжитесь с нами"
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  Нет изображения
                </div>
              )}
            </motion.div>

            <motion.div
              {...staggerContainer}
              className="space-y-8"
            >
              <motion.div {...fadeInUp} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Напишите нам на почту</h3>
                  <p className="text-gray-600">support@flashlearn.com</p>
                  <p className="text-gray-600">hello@flashlearn.com</p>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Позвоните нам</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Пн–Пт, 9:00–18:00 (по местному времени)</p>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Наш офис</h3>
                  <p className="text-gray-600">123 Learning Street</p>
                  <p className="text-gray-600">San Francisco, CA 94102</p>
                </div>
              </motion.div>

              <motion.div {...fadeInUp}>
                <Button className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto px-8 py-6">
                  Отправить сообщение
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 FlashLearn. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

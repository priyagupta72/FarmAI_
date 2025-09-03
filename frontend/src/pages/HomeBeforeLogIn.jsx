import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import { FaLeaf, FaSeedling, FaHeartbeat, FaChevronDown } from "react-icons/fa";

import ChatButton from "./ChatButton";
import ChatPopup from "../components/ChatPopup";
import LearnMorePopup from "./LearnMorePopup";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: "easeOut" },
  }),
};

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // ✅ Authentication check
  const isAuthenticated = () => !!localStorage.getItem("token");

  // ✅ Navigation with auth check
  const handleNavigation = (path) => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
    } else {
      window.location.href = path;
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "24px",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2, centerMode: true } },
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: false } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  const testimonials = [
    {
      text: "FarmAI helped me pick the perfect crops for my farm. The insights were spot on.",
      author: "John Doe",
      role: "Farmer",
      avatar: "https://media.istockphoto.com/id/2212656822/vector/black-silhouette-of-a-gender-neutral-person-with-short-hair-representing-an-anonymous-user.jpg?s=612x612&w=0&k=20&c=-Lbk7ESJJQqDcXMZsIJJJPVoepWszWkG1JWLpuwYV9M="
    },
    {
      text: "The fertilizer recommendations boosted my yield by ~30% this season!",
      author: "Jane Smith",
      role: "Agri-entrepreneur",
      avatar: "https://media.istockphoto.com/id/2212656822/vector/black-silhouette-of-a-gender-neutral-person-with-short-hair-representing-an-anonymous-user.jpg?s=612x612&w=0&k=20&c=-Lbk7ESJJQqDcXMZsIJJJPVoepWszWkG1JWLpuwYV9M="
    },
    {
      text: "Disease alerts saved me from major crop loss. Super practical and fast.",
      author: "Alex Johnson",
      role: "Co-op Manager",
      avatar: "https://media.istockphoto.com/id/2212656822/vector/black-silhouette-of-a-gender-neutral-person-with-short-hair-representing-an-anonymous-user.jpg?s=612x612&w=0&k=20&c=-Lbk7ESJJQqDcXMZsIJJJPVoepWszWkG1JWLpuwYV9M="
    }
  ];

  const faqs = [
    { q: "What is FarmAI?", a: "FarmAI is an AI-powered platform that helps with crop recommendations, fertilizer guidance, and disease detection." },
    { q: "How accurate are the crop recommendations?", a: "We use ML models trained on environmental and soil data, tuned for real-world farm conditions." },
    { q: "Is FarmAI free to use?", a: "Yes. Core features are free; optional premium tools are planned for the future." },
    { q: "Do I need technical knowledge to use FarmAI?", a: "No. The interface is simple and guided — built for first-time users and pros alike." },
    { q: "Can FarmAI detect crop diseases in real time?", a: "Yes. By combining image uploads with live weather context, we surface early warnings and suggestions." },
    { q: "Which crops are supported?", a: "Wheat, rice, maize, pulses, several vegetables — with more being added continuously." },
  ];

  return (
    <div className="snap-wrapper font-sans text-gray-900 antialiased">
      {/* =================== HERO =================== */}
      <section className="relative snap-section w-full min-h-screen flex items-center">
        <div className="absolute inset-0 -z-10 animate-gradient bg-[radial-gradient(45rem_45rem_at_120%_-10%,#bbf7d0,transparent),radial-gradient(40rem_40rem_at_-10%_0%,#dcfce7,transparent)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-white/60 via-transparent to-white/60" />

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-center lg:text-left">
            <motion.p variants={fadeUp} className="inline-block rounded-full bg-white/60 backdrop-blur-md px-4 py-1 text-xs sm:text-sm font-medium text-green-700 ring-1 ring-green-200">Oxygen Plant</motion.p>
            <motion.h1 custom={1} variants={fadeUp} className="mt-4 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-green-700 via-emerald-500 to-green-400 bg-clip-text text-transparent">KEEP YOUR</span><br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">PLANTS HEALTHY</span>
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} className="mt-5 max-w-xl mx-auto lg:mx-0 text-gray-600 text-sm sm:text-base">
              Plants reduce stress levels and boost your mood — perfect for your home or workspace. A beautiful plant is like having a friend around the house.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="mt-8">
              <a href="#about" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-6 sm:px-8 py-3 text-white font-semibold shadow-lg shadow-emerald-200/40 hover:shadow-emerald-300/60 transition-transform hover:-translate-y-0.5">
                Explore More <span aria-hidden>→</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }} className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-green-200 to-emerald-200 blur-2xl opacity-60 group-hover:opacity-90 transition" />
              <img src="https://media.istockphoto.com/id/511976070/photo/green-sprouts.jpg?s=612x612&w=0&k=20&c=MzoPpySb-r5bdKui7g8tPWzaZJB6ppVJfKWwWPJIxO8=" className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 lg:w-[28rem] lg:h-[28rem] object-cover rounded-[2rem] shadow-2xl ring-1 ring-white/50 border border-white/40 bg-white/40 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1"/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =================== ABOUT =================== */}
      <section id="about" className="snap-section py-20 bg-gradient-to-b from-white to-green-50">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-green-200 to-emerald-200 blur-xl opacity-70" />
              <img src="https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif" alt="About FarmAI" className="relative w-72 sm:w-96 rounded-3xl shadow-xl ring-1 ring-white/50 border border-white/40 bg-white/40 backdrop-blur-xl"/>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center lg:text-left">
            <motion.p variants={fadeUp} className="text-green-700 font-semibold">Welcome To FarmAI</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold">
              WHERE <span className="text-green-600">INNOVATION</span> MEETS AGRICULTURE
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="mt-4 text-gray-600 max-w-xl mx-auto lg:mx-0">
              We’re revolutionizing crop health management with machine learning. Analyze local factors, predict risks, and keep crops healthy for better yields — with simple, friendly tools.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =================== SERVICES =================== */}
      <section id="ser" className="snap-section py-16 sm:py-20 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.h3 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Our Services
          </motion.h3>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <FaLeaf />, title: "Crop Recommendation", desc: "AI-powered suggestions for what to grow, tuned to your climate and soil.", href: "/crop" },
              { icon: <FaSeedling />, title: "Fertilizer Recommendation", desc: "Pick the right fertilizer for your soil. Improve productivity with less guesswork.", href: "/fertilizer" },
              { icon: <FaHeartbeat />, title: "Disease Detection", desc: "Weather-aware disease detection to catch risks early and act fast.", href: "/upload" },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 18, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.05 * i, duration: 0.55 }} viewport={{ once: true }} className="group relative rounded-3xl bg-white/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl ring-1 ring-gray-200/60 transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 text-white text-2xl sm:text-3xl shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h4 className="mt-5 sm:mt-6 text-lg sm:text-xl font-semibold">{card.title}</h4>
                  <p className="mt-2 text-gray-600 text-sm sm:text-base">{card.desc}</p>
                  <button onClick={() => handleNavigation(card.href)} className="mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-4 sm:px-5 py-2 sm:py-2.5 text-white font-medium shadow-md hover:shadow-lg transition text-sm sm:text-base">
                    Click Here <span aria-hidden>→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== TESTIMONIALS =================== */}
      <section id="reviews" className="snap-section py-16 sm:py-20 bg-green-50">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.h3 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl sm:text-4xl font-bold text-center mb-12">
            What Our Users Say
          </motion.h3>

          <div className="max-w-6xl mx-auto">
            <Slider {...sliderSettings}>
              {testimonials.map((t, i) => (
                <div key={i} className="px-2 sm:px-4">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition h-auto flex flex-col justify-between min-h-[220px] sm:min-h-[240px]">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">“{t.text}”</p>
                    <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                      <img src={t.avatar} alt={t.author} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-200"/>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base">{t.author}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section id="faq" className="snap-section py-20 bg-gradient-to-b from-white to-green-50">
        <div className="mx-auto w-full max-w-4xl px-6 lg:px-10">
          <h3 className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-10">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((item, index) => {
              const open = openIndex === index;
              return (
                <div key={index} className="rounded-2xl bg-white/80 backdrop-blur-xl border border-green-200 shadow-sm">
                  <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                    <span className="font-medium text-base sm:text-lg text-green-800">{item.q}</span>
                    <FaChevronDown className={`text-green-600 transition-transform ${open ? "rotate-180" : ""}`} size={20}/>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="px-6 overflow-hidden">
                        <p className="pb-4 text-sm sm:text-base text-gray-600">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================== Chat & Popups =================== */}
      <ChatButton setIsChatOpen={setIsChatOpen} isMobile={windowWidth < 768}/>
      {isPopupOpen && <LearnMorePopup onClose={() => setIsPopupOpen(false)} isMobile={windowWidth < 768}/>}
      {isChatOpen && <ChatPopup onClose={() => setIsChatOpen(false)} isMobile={windowWidth < 768}/>}

      <style>{`
        @keyframes floaty {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .animate-floaty {animation: floaty 4s ease-in-out infinite}

        @keyframes gradientMove {
          0% { transform: translate3d(0,0,0) }
          50% { transform: translate3d(-3%, -2%, 0) }
          100% { transform: translate3d(0,0,0) }
        }
        .animate-gradient { animation: gradientMove 16s ease-in-out infinite }

        .slick-dots li button:before { font-size: 10px; opacity: .35; }
        .slick-dots li.slick-active button:before { opacity: .9; }
      `}</style>
    </div>
  );
};

export default Home;


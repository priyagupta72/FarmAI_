import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faLeaf,
  faMobileScreen,
  faGlobe,
  faCloudArrowDown,
  faLightbulb,
  faBell,
  faDatabase
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: faBrain,
      title: "AI-Powered Precision",
      description: "97.3% accurate disease detection using deep learning models trained on millions of crop images.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: faLeaf,
      title: "Comprehensive Coverage",
      description: "Detects 58+ diseases across 12 major crops with localized treatment recommendations.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: faMobileScreen,
      title: "Field-Ready Mobile",
      description: "Optimized for low-bandwidth conditions with offline-first functionality.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: faLightbulb,
      title: "Smart Farming Insights",
      description: "Personalized AI recommendations for irrigation and fertilization schedules.",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: faGlobe,
      title: "Global Accessibility",
      description: "Available in 18 languages with regional adaptations for local practices.",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: faCloudArrowDown,
      title: "Offline Capabilities",
      description: "Critical features work without internet, syncing when back online.",
      color: "from-gray-500 to-slate-500"
    },
    {
      icon: faBell,
      title: "Predictive Alerts",
      description: "Early warnings for disease outbreaks based on weather patterns.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: faDatabase,
      title: "Farm Analytics",
      description: "Cloud-based historical data tracking with yield prediction models.",
      color: "from-sky-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-2 bg-gradient-to-b from-white to-gray-50 h-fit">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Cutting-Edge Technology
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
           Your Farming with AI
          </h2>
          <p className="text-xl text-gray-600">
            Our platform combines agricultural expertise with artificial intelligence to deliver unparalleled crop protection.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300`} />
              <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className={`p-8 bg-gradient-to-br ${feature.color} text-white`}>
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mt-6">{feature.title}</h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <div className="flex items-center text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors cursor-pointer">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
         
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
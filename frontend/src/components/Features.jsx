import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Award, Laptop, Smile, ArrowRight, Zap, Shield, Target } from 'lucide-react';

const features = [
  {
    title: "Relaxing & Learning",
    desc: "Experience a stress-free learning environment designed to help you focus and absorb information naturally.",
    icon: ThumbsUp,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50"
  },
  {
    title: "Professional Certification",
    desc: "Earn industry-recognized certificates that validate your skills and boost your professional portfolio.",
    icon: Award,
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50"
  },
  {
    title: "1-on-1 Mentorship",
    desc: "Get personalized guidance from industry experts who help you navigate challenges and career paths.",
    icon: Laptop,
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50"
  },
  {
    title: "Creative Thinking",
    desc: "Unlock your potential with modules specifically designed to enhance problem-solving and innovation.",
    icon: Smile,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Features = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-4"
          >
            Why Choose Us
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Redefining Online <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Education Excellence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            We don't just provide courses; we build careers. Explore the features that set our platform apart from the rest.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
            >
              {/* Hover Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br ${feature.color} transition-all duration-300`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-500 leading-relaxed text-sm mb-8 flex-grow">
                {feature.desc}
              </p>

              {/* Button */}
              <div className="mt-auto pt-6 border-t border-slate-50">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:text-purple-600 transition-colors"
                >
                  Learn more 
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;
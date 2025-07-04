import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Shield, Users, Award, MessageSquare, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div 
            className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:w-1/2">
              <motion.span 
                className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-300 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Mental Health Support
              </motion.span>
              
              <motion.h1 
                className="mb-6 text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your AI <span className="text-primary-500">Mental Health</span> Companion
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-700 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Dapatkan dukungan rahasia yang penuh empati untuk kecemasan, stres, dan hubungan.
                OtravoceAI selalu siap mendengarkan kapan pun dan di mana pun, tanpa menghakimi.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/chat" className="btn btn-primary">
                  Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/resources" className="btn btn-outline">
                  Crisis Resources
                </Link>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2">
              <motion.img 
                src="https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Teenage girl using MindMate AI on her phone"
                className="rounded-xl shadow-lg w-full object-cover h-[400px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-6 text-gray-900 dark:text-white">
              Pendekatan OtravoceAI dalam membantu anda
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-700 dark:text-gray-300">
              AI kami menciptakan ruang aman untukmu 
              mengekspresikan pikiran dan perasaan, dan hadir saat kamu paling membutuhkannya.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="card hover:shadow-md">
              <MessageSquare className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">24/7 Percakapan</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Kapan pun kamu merasa butuh bicara, kami siap mendengarkan. Siang atau malam, selalu ada ruang untuk perasaanmu.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="card hover:shadow-md">
              <Shield className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Aman dan Rahasia</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tak perlu akun, tak perlu khawatir. Semua obrolan dijaga kerahasiaannya.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="card hover:shadow-md">
              <Brain className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Didukung oleh AI</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Dengan teknologi AI canggih, kami hadir untuk mendukung emosimu secara personal dan membantumu menghadapi tantangan.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="card hover:shadow-md">
              <Users className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Dibuat untuk semua orang</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Dirancang untuk semua orang, dengan memahami tantangan unik yang dihadapi setiap individu.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="card hover:shadow-md">
              <Award className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Berbasis Ilmu Pengetahuan</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Pendekatan yang didasarkan pada teknik dan prinsip psikologi berbasis bukti.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="card hover:shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative z-10">
                <MessageSquare className="h-12 w-12 text-primary-500 mb-6" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Pendampingan Terarah</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Kalimat dan ide yang memudahkan kamu memulai percakapan saat bingung harus berkata apa.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-900/20 dark:to-secondary-900/20">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-gray-900 dark:text-white">Siap untuk memulai langkah baru?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Mulai berbicara dengan OtravoceAI hari ini, tanpa ribet registrasi.
            </p>
            <Link to="/chat" className="btn btn-primary text-lg px-8 py-4">
              Chat with OtravoceAI
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
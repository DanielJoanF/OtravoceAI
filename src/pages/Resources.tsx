import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, MessageSquare, Globe, Heart, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources: React.FC = () => {
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
    <div className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-error-50 to-error-100 dark:from-error-900/30 dark:to-error-800/30 rounded-xl p-6 md:p-8 border border-error-200 dark:border-error-800 mb-10">
            <div className="flex items-start space-x-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-error-500" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-error-700 dark:text-error-300">
                  Butuh bantuan segera?
                </h2>
                <p className="text-error-700 dark:text-error-300 mb-4">
                  Jika kamu sedang mengalami krisis atau berpikiran untuk menyakiti diri sendiri, segera hubungi bantuan berikut. Layanan ini tersedia 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href="tel:119" 
                    className="btn bg-error-600 hover:bg-error-700 text-white focus:ring-error-500"
                  >
                    <PhoneCall className="h-5 w-5 mr-2" /> Hubungi 119 ext. 8
                  </a>
                  <a 
                    href="https://wa.me/6282125711232" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-white dark:bg-gray-800 text-error-700 dark:text-error-300 border border-error-300 dark:border-error-700 hover:bg-error-50 dark:hover:bg-gray-700 focus:ring-error-400"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" /> Chat WA SEJIWA
                  </a>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Heart className="h-8 w-8 text-error-500 mr-3" />
            Sumber Daya Krisis
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
            Meskipun OtravoceAI dapat memberikan percakapan suportif, ini bukan layanan krisis profesional. Jika kamu mengalami gangguan emosional berat atau berpikiran bunuh diri, harap gunakan sumber daya resmi berikut.
          </p>

          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* SEJIWA */}
            <motion.div 
              className="card hover:shadow-md border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">SEJIWA – Kemenkes RI</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Layanan psikososial nasional untuk masyarakat Indonesia. Gratis dan tersedia 24 jam.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <PhoneCall className="h-5 w-5 text-primary-500 mr-2" />
                  <a href="tel:119" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Hubungi 119 ext. 8
                  </a>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
                  <a 
                    href="https://wa.me/6282125711232"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    WhatsApp SEJIWA
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-primary-500 mr-2" />
                  <a 
                    href="https://sejiwa.kemkes.go.id" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                  >
                    sejiwa.kemkes.go.id
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Into the Light Indonesia */}
            <motion.div 
              className="card hover:shadow-md border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Into The Light Indonesia</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Komunitas nirlaba untuk pencegahan bunuh diri dan edukasi kesehatan mental remaja.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-primary-500 mr-2" />
                  <a 
                    href="https://intothelightid.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                  >
                    intothelightid.org
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Mencari Bantuan Profesional</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              OtravoceAI tidak menggantikan tenaga profesional. Berikut beberapa cara mencari bantuan profesional di Indonesia:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">1</div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Puskesmas atau Dokter Umum</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Kamu bisa berkonsultasi awal dan mendapatkan rujukan ke psikiater atau psikolog.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">2</div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Gunakan BPJS Kesehatan</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Banyak layanan kesehatan jiwa di rumah sakit pemerintah yang ditanggung BPJS.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">3</div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Bimbingan Konseling Sekolah/Kampus</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Tersedia secara gratis bagi pelajar dan mahasiswa.
                  </p>
                </div>
              </li>
            </ul>

            <div className="flex justify-center mt-8">
              <Link to="/chat" className="btn btn-primary">
                Kembali ke Chat
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, AlertCircle } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <Lock className="h-6 w-6 mr-2 text-primary-500" />
              Your Privacy Matters
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Di OtravoceAI, kami sangat menjaga privasi kamu dan 
              berusaha agar kamu selalu merasa aman saat menggunakan layanan kami. Kebijakan privasi ini menjelaskan cara kami mengelola data dan informasi kamu dengan penuh tanggung jawab.
            </p>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Information We Collect</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Informasi yang Kami Kumpulkan
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>
                    <strong>Percakapan Chat</strong> -  Pesan yang kamu kirimkan dan terima dengan AI kami.
                  </li>
                  <li>
                    <strong>Data Penggunaan Anonim</strong> -  Informasi tentang cara kamu menggunakan layanan, yang kami gunakan untuk meningkatkan kemampuan AI.
                  </li>
                  <li>
                    <strong>Informasi Akun (Opsional)</strong> - Jika kamu memilih untuk membuat akun, kami akan menyimpan email dan password-mu (dalam bentuk terenkripsi).
                  </li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Cara Kami Menggunakan Informasimu</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Menyediakan dan meningkatkan layanan konseling AI kami</li>
                  <li>Meningkatkan kemampuan AI agar dapat merespon dengan tepat terkait masalah kesehatan mental</li>
                  <li>Menyimpan riwayat percakapan jika kamu membuat akun</li>
                  <li>Menjamin keamanan dan kelancaran fungsi platform kami</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary-500" />
                  Penyimpanan Data dan Keamanan
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Keamanan data kamu adalah prioritas kami:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Semua data dienkripsi saat dikirim dan disimpan</li>
                  <li>Dalam mode anonim, percakapan hanya disimpan di browser kamu dan akan otomatis dihapus saat kamu menghapus data browser</li>
                  <li>Untuk pengguna terdaftar, percakapan disimpan dengan aman dan terkait dengan akun kamu</li>
                  <li>Kami menerapkan standar keamanan industri untuk melindungi informasi kamu</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary-500" />
                  Batasan Penting
                </h3>
                <div className="bg-warm-50 dark:bg-warm-900/20 border border-warm-200 dark:border-warm-800 rounded-lg p-4 mb-4">
                  <p className="text-warm-800 dark:text-warm-300 font-medium">
                    OtravoceAI bukanlah pengganti psikolog mental health profesional :
                  </p>
                  <ul className="list-disc pl-6 text-warm-700 dark:text-warm-400 mt-2 space-y-1">
                    <li>AI kami tidak bisa memberikan diagnosis kondisi mental</li>
                    <li>Jika kamu mengalami situasi krisis, segera hubungi layanan darurat atau nomor hotline krisis</li>
                    <li>Kalau masalah kesehatan mentalmu terus berlanjut, kami sarankan untuk konsultasi dengan tenaga profesional</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Hak Anda</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Anda berhak untuk:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
              <li>Mengakses data pribadi</li>
              <li>Menghapus akun dan data terkait</li>
              <li>Menggunakan layanan kami secara anonim</li>
              <li>Mengetahui bagaimana data anda digunakan</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300">
              Dengan menggunakan OtravoceAI, Anda me--nyatakan telah membaca dan memahami Kebijakan Privasi ini.
              Jika Anda memiliki pertanyaan tentang praktik privasi kami, silakan hubungi kami di:
              nieljohn8386@gmail.com
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Last updated: June 5, 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
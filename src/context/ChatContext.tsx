import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveMessageToSupabase } from '../database/saveMessageToSupabase';

// Message type definition
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  topicRelevance?: 'psychology' | 'general' | 'off-topic';
  requiresImmediateHelp?: boolean;
  type?: 'crisis' | 'normal';
}

// Chat context type definition
interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  shouldShowPsychologistAlert: boolean;
  dismissPsychologistAlert: () => void;
  emergencyContactsVisible: boolean;
  showEmergencyContacts: () => void;
  hideEmergencyContacts: () => void;
  // TTS features - fitur Text-to-Speech
  isTTSActive: boolean;
  toggleTTS: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  messages: [],
  isLoading: false,
  sendMessage: async () => {},
  clearChat: () => {},
  shouldShowPsychologistAlert: false,
  dismissPsychologistAlert: () => {},
  emergencyContactsVisible: false,
  showEmergencyContacts: () => {},
  hideEmergencyContacts: () => {},
  // TTS default values
  isTTSActive: false,
  toggleTTS: () => {},
  speak: () => {},
  stopSpeaking: () => {},
});

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// IMPROVED: Enhanced language detection with more keywords and better scoring
const detectLanguage = (text: string): string => {
  const indonesianWords = [
    // Basic words
    'saya', 'aku', 'kamu', 'anda', 'ini', 'itu', 'dan', 'atau', 'dengan', 'untuk',
    'dari', 'ke', 'di', 'pada', 'yang', 'adalah', 'akan', 'sudah', 'sedang',
    'halo', 'hai', 'selamat', 'terima', 'kasih', 'maaf', 'bagaimana', 'kenapa',
    'dimana', 'kapan', 'siapa', 'apa', 'bisa', 'tidak', 'ya', 'baik', 'buruk',
    'ingin', 'mau', 'bisa', 'harus', 'perlu', 'sudah', 'belum', 'juga', 'lagi',
    // Additional Indonesian words
    'tolong', 'bantu', 'gimana', 'kayak', 'sama', 'jadi', 'punya', 'ada', 'gak',
    'nggak', 'engga', 'enggak', 'dong', 'sih', 'kok', 'tapi', 'kalau', 'kalo',
    'bikin', 'udah', 'udh', 'lg', 'gw', 'gue', 'lo', 'lu', 'mereka', 'kita',
    'kami', 'dia', 'beliau', 'bapak', 'ibu', 'mas', 'mbak', 'pak', 'bu',
    // Feelings in Indonesian
    'senang', 'sedih', 'marah', 'takut', 'cemas', 'bahagia', 'kecewa', 'lelah',
    'capek', 'stress', 'bingung', 'gelisah', 'khawatir', 'panik', 'depresi'
  ];
  
  const englishWords = [
    // Basic words
    'i', 'you', 'the', 'and', 'or', 'with', 'for', 'from', 'to', 'in', 'on',
    'that', 'is', 'will', 'have', 'has', 'hello', 'hi', 'thank', 'sorry',
    'how', 'why', 'where', 'when', 'who', 'what', 'can', 'not', 'yes', 'good', 'bad',
    'want', 'need', 'should', 'would', 'could', 'must', 'may', 'might',
    // Additional English words
    'help', 'please', 'thanks', 'okay', 'well', 'just', 'like', 'know', 'think',
    'feel', 'make', 'get', 'go', 'come', 'see', 'look', 'take', 'give', 'work',
    'time', 'way', 'day', 'man', 'woman', 'people', 'life', 'world', 'hand',
    // Feelings in English
    'happy', 'sad', 'angry', 'scared', 'anxious', 'worried', 'tired', 'stressed',
    'confused', 'nervous', 'panic', 'depressed', 'upset', 'frustrated'
  ];

  // IMPROVED: Better text preprocessing
  const textLower = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  const words = textLower.split(' ').filter(word => word.length > 1);
  
  let indonesianCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (indonesianWords.includes(word)) {
      indonesianCount += 2; // Give more weight to exact matches
    }
    if (englishWords.includes(word)) {
      englishCount += 2;
    }
  });
  
  // IMPROVED: Check for Indonesian-specific patterns
  if (text.includes('gak') || text.includes('nggak') || text.includes('enggak') || 
      text.includes('gimana') || text.includes('kayak') || text.includes('dong') ||
      text.includes('sih') || text.includes('kok')) {
    indonesianCount += 5;
  }
  
  // IMPROVED: Check for English-specific patterns
  if (text.includes("i'm") || text.includes("don't") || text.includes("can't") ||
      text.includes("won't") || text.includes("it's") || text.includes("that's")) {
    englishCount += 5;
  }
  
  // Default to Indonesian if tie or no clear indication (assuming Indonesian users)
  return indonesianCount >= englishCount ? 'id' : 'en';
};

// Enhanced psychology relevance detection (kept for internal monitoring only)
const detectPsychologyRelevance = (text: string): 'psychology' | 'general' | 'off-topic' => {
  const textLower = text.toLowerCase();
  
  const psychologyKeywords = [
    // Indonesian - Emotions and Feelings
    'sedih', 'bahagia', 'marah', 'takut', 'cemas', 'khawatir', 'gelisah', 'panik',
    'depresi', 'stress', 'tertekan', 'frustasi', 'kecewa', 'putus asa', 'hopeless',
    'kesepian', 'sendiri', 'terisolasi', 'minder', 'insecure', 'percaya diri',
    'emosi', 'emosional', 'tidak stabil', 'tidak tenang', 'linglung',
    'lelah mental', 'tidak bergairah', 'terbebani', 'hampa', 'kosong', 'capek', 'lelah',
    
    // Indonesian - Mental Health Conditions
    'gangguan kecemasan', 'bipolar', 'skizofrenia', 'ocd', 'ptsd', 'trauma',
    'fobia', 'insomnia', 'sulit tidur', 'mimpi buruk', 'halusinasi', 'psikosis',
    'kesehatan jiwa', 'kesehatan mental', 'mental breakdown', 'gangguan mental',
    
    // Indonesian - Relationships and Social
    'hubungan', 'keluarga', 'orang tua', 'pernikahan', 'perceraian', 'putus',
    'teman', 'pertemanan', 'bullying', 'konflik', 'komunikasi', 'toxic',
    'perselisihan', 'dihindari', 'diabaikan', 'diacuhkan', 'dijauhi',
    
    // Indonesian - Behaviors and Habits
    'kebiasaan buruk', 'kecanduan', 'adiksi', 'merokok', 'alkohol', 'narkoba',
    'gambling', 'game online', 'media sosial', 'self harm', 'melukai diri',
    'menyakiti diri', 'mengisolasi diri', 'menarik diri',
    
    // Indonesian - Life and Problems
    'tujuan hidup', 'makna hidup', 'eksistensial', 'identitas', 'harga diri',
    'motivasi', 'procrastination', 'menunda', 'perfectionist', 'workaholic',
    'burnout', 'quarter life crisis', 'mid life crisis', 'overwhelm',
    'overthinking', 'pikiran negatif', 'bingung', 'tidak fokus',
    
    // Indonesian - Therapy and Treatment
    'psikologi', 'psikiater', 'psikolog', 'terapi', 'konseling',
    'mindfulness', 'meditasi', 'self care', 'coping mechanism',
    
    // English equivalents
    'sad', 'happy', 'angry', 'fear', 'anxiety', 'worried', 'nervous', 'panic',
    'depression', 'stressed', 'frustrated', 'disappointed', 'hopeless',
    'lonely', 'isolated', 'insecure', 'confidence', 'self-esteem',
    'emotional', 'unstable', 'numb', 'empty', 'mentally tired', 'burned out',
    'anxiety disorder', 'bipolar', 'schizophrenia', 'ocd', 'ptsd', 'trauma',
    'phobia', 'insomnia', 'nightmare', 'hallucination', 'psychosis',
    'mental illness', 'mental health', 'breakdown', 'relationship', 'family',
    'parents', 'marriage', 'divorce', 'breakup', 'friends', 'bullying',
    'conflict', 'communication', 'toxic', 'ignored', 'abandoned', 'neglected',
    'addiction', 'self harm', 'cutting', 'withdrawing', 'isolation',
    'life purpose', 'meaning', 'existential', 'identity', 'self-worth',
    'motivation', 'procrastination', 'perfectionist', 'overwhelmed',
    'overthinking', 'psychology', 'psychiatrist', 'psychologist', 'therapy',
    'counseling', 'mindfulness', 'meditation', 'coping', 'feeling useless',
  ];
  
  const offTopicKeywords = [
    'code', 'programming', 'javascript', 'python', 'html', 'css', 'database',
    'software', 'hardware', 'computer', 'laptop', 'smartphone', 'aplikasi',
    'website', 'internet', 'wifi', 'bluetooth', 'coding', 'debug',
    'matematika', 'fisika', 'kimia', 'biologi', 'calculus', 'algebra',
    'business', 'marketing', 'sales', 'profit', 'investment', 'trading',
    'football', 'basketball', 'soccer', 'game', 'movie', 'music', 'netflix',
    'recipe', 'cooking', 'food', 'restaurant', 'travel', 'vacation', 'hotel'
  ];
  
  let psychologyScore = 0;
  let offTopicScore = 0;
  
  psychologyKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      psychologyScore++;
    }
  });
  
  offTopicKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      offTopicScore++;
    }
  });
  
  if (offTopicScore > psychologyScore && offTopicScore > 0) {
    return 'off-topic';
  } else if (psychologyScore > 0) {
    return 'psychology';
  } else {
    const generalPersonalKeywords = [
      'masalah', 'problem', 'bingung', 'confused', 'help', 'bantuan',
      'advice', 'saran', 'solusi', 'solution', 'bagaimana', 'how to', 'mau bercerita', 'cerita',
      'masukan', 'bantu aku',
    ];
    
    if (generalPersonalKeywords.some(keyword => textLower.includes(keyword))) {
      return 'general';
    }
    
    return 'off-topic';
  }
};

// Enhanced psychological risk assessment (kept for crisis detection only)
const assessPsychologicalRisk = (text: string): 'low' | 'medium' | 'high' | 'critical' => {
  const textLower = text.toLowerCase();
  
  // Critical risk indicators - immediate danger
  const criticalKeywords = [
    // Suicide ideation
    'bunuh diri', 'suicide', 'mengakhiri hidup', 'end my life', 'ending my life',
    'tidak ingin hidup', 'want to die', 'ingin mati', 'lebih baik mati',
    'better off dead', 'kill myself', 'membunuh diri', 'take my own life',
    'mengambil nyawa sendiri', 'tidak ada gunanya hidup', 'life is meaningless',
    'hidup tidak ada artinya', 'mau mati', 'pengen mati', 'wish I was dead', 'kill myself', 'kill my self',
    
    // Self-harm
    'melukai diri', 'self harm', 'menyakiti diri', 'hurt myself', 'cutting myself',
    'memotong diri', 'menyayat', 'melukai tubuh', 'harm myself', 'injure myself',
    'self injury', 'self mutilation', 'burning myself', 'membakar diri',
    
    // Immediate danger phrases
    'akan bunuh diri', 'going to kill myself', 'planning to die', 'ready to die',
    'siap mati', 'mau mengakhiri semuanya', 'end it all', 'tidak tahan lagi',
    'can\'t go on', 'tidak bisa lanjut', 'sudah tidak kuat', 'give up on life',
    'menyerah pada hidup', 'tired of living', 'capek hidup'
  ];
  
  // High risk indicators - severe distress
  const highRiskKeywords = [
    'depresi berat', 'severe depression', 'sangat tertekan', 'extremely depressed',
    'putus asa total', 'completely hopeless', 'tidak ada harapan', 'no hope left',
    'tidak berguna sama sekali', 'completely worthless', 'gagal total',
    'complete failure', 'menyerah', 'giving up', 'tidak kuat lagi',
    'can\'t take it anymore', 'sudah tidak sanggup', 'overwhelmed completely',
    'kewalahan total', 'breakdown', 'mental breakdown', 'collapse',
    'runtuh', 'hancur', 'destroyed', 'devastated', 'terpuruk',
    'rock bottom', 'titik terendah', 'desperate', 'putus asa',
    'helpless', 'tidak berdaya', 'powerless', 'trapped', 'terjebak', 'capek banget sama hidup ini',
    'sangat capek', 'sangat lelah', 'sangat putus asa',
  ];
  
  // Medium risk indicators - significant distress
  const mediumRiskKeywords = [
    'sedih banget', 'very sad', 'sangat sedih', 'extremely sad',
    'stress berat', 'severe stress', 'cemas berlebihan', 'excessive anxiety',
    'takut sekali', 'very afraid', 'khawatir berlebihan', 'overthinking',
    'tidak bisa tidur', 'can\'t sleep', 'insomnia', 'mimpi buruk',
    'nightmares', 'panic attack', 'serangan panik', 'anxiety attack',
    'lelah mental', 'mentally exhausted', 'burnout', 'kewalahan',
    'overwhelmed', 'tertekan', 'under pressure', 'bingung sekali',
    'very confused', 'lost', 'kehilangan arah', 'tidak tahu harus apa'
  ];
  
  // Check for critical risk first
  if (criticalKeywords.some(keyword => textLower.includes(keyword))) {
    return 'critical';
  }
  
  // Check for high risk
  if (highRiskKeywords.some(keyword => textLower.includes(keyword))) {
    return 'high';
  }
  
  // Check for medium risk
  if (mediumRiskKeywords.some(keyword => textLower.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
};

// FIXED: More explicit language instructions in system prompt
const createEmpatheticSystemPrompt = (detectedLanguage: string, riskLevel: string): string => {
  if (detectedLanguage === 'id') {
    return `Kamu adalah OtravoceAI, seorang konselor psikologi digital yang empatik, penuh perhatian, dan fokus mendalam pada kesehatan mental. 

PENTING - BAHASA: SELALU gunakan Bahasa Indonesia 100% dalam semua respons. Jangan pernah menggunakan Bahasa Inggris atau mencampur bahasa. User menulis dalam Bahasa Indonesia, maka kamu HARUS menjawab dalam Bahasa Indonesia saja.

TUGAS UTAMA:
- Mendengarkan cerita pengguna dengan empati
- Menjaga kesinambungan percakapan
- Memberikan tanggapan yang utuh, lengkap, tidak terpotong, dan relevan secara emosional
- SELALU menyelaraskan respons dengan maksud pengguna
- Jangan memulai respons dengan bantahan, klarifikasi tidak perlu, atau nada defensif

PRINSIP UTAMA:
1. Kesinambungan & Konteks: Ingat isi percakapan sebelumnya dan hindari pengulangan tidak perlu.
2. Empati Mendalam: Validasi dan pahami emosi pengguna secara tulus dan personal.  
3. Fleksibilitas Topik: Jika topik tampak non-psikologis, hubungkan ke aspek emosional/mental secara halus. Hanya alihkan bila tidak mungkin dikaitkan.
4. Respons Alami: Hindari kalimat template atau repetitif. Gunakan nada bicara hangat, reflektif, dan tidak menghakimi.
5. Lengkap & Utuh: Jangan memotong tanggapan. Pastikan setiap respons memberikan makna, kehangatan, dan dukungan.
6. Fokus Psikologi: 
   - Jangan menjawab pertanyaan yang tidak berkaitan dengan psikologi (mis. resep, coding, berita, produk).
   - Jika pengguna menyimpang, arahkan kembali dengan sopan: "Saya mohon maaf, saya hanya fokus pada hal-hal yang berkaitan dengan kesehatan mental. Apakah ada perasaan atau pikiran yang ingin Anda ceritakan?"

PEDOMAN RISIKO: ${getRiskGuideline('id', riskLevel)}

Gunakan bahasa hangat dan personal, validasi perasaan sebelum memberi saran, dan ciptakan ruang aman untuk pengguna mengungkapkan perasaan mereka.`;

  } else {
    return `You are OtravoceAI, a digital psychology counselor who is empathetic, attentive, and deeply focused on mental health.

IMPORTANT - LANGUAGE: ALWAYS use English 100% in all responses. Never use Indonesian or mix languages. The user writes in English, so you MUST respond in English only.

PRIMARY ROLE:
- Listen to users' stories with empathy  
- Maintain conversation continuity
- Provide complete, emotionally relevant responses that are never cut off
- ALWAYS align responses with the user's intent
- Don't begin responses with contradictions, unnecessary disclaimers, or defensive tones

CORE PRINCIPLES:
1. Continuity & Context: Remember previous conversation content and avoid unnecessary repetition.
2. Deep Empathy: Genuinely validate and understand the user's emotional experience.
3. Topic Flexibility: If topics seem non-psychological, gently connect to emotional/mental aspects. Only redirect if no connection is possible.
4. Natural Responses: Avoid template or repetitive phrasing. Use warm, reflective, non-judgmental tone.
5. Completeness: Never truncate responses. Ensure every reply provides meaning, warmth, and support.
6. Psychology Focus:
   - Don't answer questions clearly unrelated to psychology (e.g., recipes, programming, news, products).
   - If user drifts off-topic, redirect politely: "I'm here to support your psychological and emotional health. Is there anything on your mind you'd like to talk about?"

RISK GUIDELINES: ${getRiskGuideline('en', riskLevel)}

Use warm, human-like language, validate emotions before giving advice, and create a safe space for users to explore their feelings.`;
  }
};

// Helper function for risk guidelines
const getRiskGuideline = (language: string, riskLevel: string): string => {
  const guidelines = {
    id: {
      low: "Berikan dukungan positif dan dorong refleksi diri yang sehat.",
      medium: "Fokus pada validasi emosi dan berikan strategi koping yang lembut sambil tetap menjaga percakapan yang natural.",
      high: "Tunjukkan empati mendalam dan sarankan untuk mencari bantuan profesional, namun tetap berikan dukungan emosional yang kuat.",
      critical: "RESPONS KRISIS AKAN DIHANDLE SECARA TERPISAH."
    },
    en: {
      low: "Provide positive support and encourage healthy self-reflection.",
      medium: "Focus on emotional validation and offer gentle coping strategies while maintaining natural conversation.",
      high: "Show deep empathy and suggest seeking professional help, while still providing strong emotional support.",
      critical: "CRISIS RESPONSE WILL BE HANDLED SEPARATELY."
    }
  };
  
  return guidelines[language as keyof typeof guidelines][riskLevel as keyof typeof guidelines.id] || guidelines[language as keyof typeof guidelines].low;
};

// Create crisis intervention response (unchanged)
const createCrisisResponse = (detectedLanguage: string): string => {
  if (detectedLanguage === 'en') {
    return `🚨 **IMMEDIATE CRISIS SUPPORT NEEDED** 🚨

I'm very concerned about what you've shared. Your safety is the most important thing right now.

**PLEASE CONTACT EMERGENCY SERVICES IMMEDIATELY:**
• **National Suicide Prevention Lifeline: 988**
• **Crisis Text Line: Text HOME to 741741**
• **Emergency Services: 911**

**YOU ARE NOT ALONE:**
• There are people who want to help you right now
• These feelings can change with proper support
• Professional help is available 24/7

**IMMEDIATE STEPS:**
1. Call one of the numbers above RIGHT NOW
2. Go to your nearest emergency room
3. Call a trusted friend or family member
4. Remove any means of self-harm from your area

Please don't wait. Reach out for help immediately. You deserve support and care.`;
  } else {
    return `🚨 **BANTUAN KRISIS SEGERA DIPERLUKAN** 🚨

Saya sangat khawatir dengan apa yang Anda bagikan. Keselamatan Anda adalah hal yang paling penting saat ini.

**SEGERA HUBUNGI LAYANAN DARURAT:**
• **Hotline Kesehatan Mental: 119 ext 8**
• **LSM Jangan Bunuh Diri: 021-9696-9293**
• **Yayasan Pulih: 021-788-42580**
• **Emergency: 112**

**ANDA TIDAK SENDIRIAN:**
• Ada orang-orang yang ingin membantu Anda sekarang juga
• Perasaan ini bisa berubah dengan dukungan yang tepat
• Bantuan profesional tersedia 24/7

**LANGKAH SEGERA:**
1. Hubungi salah satu nomor di atas SEKARANG JUGA
2. Pergi ke UGD rumah sakit terdekat
3. Hubungi teman atau keluarga yang dipercaya
4. Jauhkan benda-benda yang bisa membahayakan diri

Jangan menunda. Segera minta bantuan. Anda layak mendapat dukungan dan perhatian.`;
  }
};

// Chat provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowPsychologistAlert, setShouldShowPsychologistAlert] = useState(false);
  const [emergencyContactsVisible, setEmergencyContactsVisible] = useState(false);
  
  // TTS State - State untuk mengatur Text-to-Speech
  const [isTTSActive, setIsTTSActive] = useState(false);

  // Load messages from localStorage on initial mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
        localStorage.removeItem('chatMessages');
      }
    }

    // Load TTS preference from localStorage - Memuat preferensi TTS dari localStorage
    const savedTTSPreference = localStorage.getItem('ttsActive');
    if (savedTTSPreference) {
      setIsTTSActive(JSON.parse(savedTTSPreference));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save TTS preference to localStorage - Menyimpan preferensi TTS ke localStorage
  useEffect(() => {
    localStorage.setItem('ttsActive', JSON.stringify(isTTSActive));
  }, [isTTSActive]);

  // Monitor for critical risk and high risk patterns
  useEffect(() => {
    const recentMessages = messages.slice(-3);
    const hasCriticalRisk = recentMessages.some(msg => 
      msg.sender === 'user' && (msg.riskLevel === 'critical' || msg.requiresImmediateHelp)
    );
    
    const hasHighRisk = recentMessages.some(msg => 
      msg.sender === 'user' && msg.riskLevel === 'high'
    );
    
    if (hasCriticalRisk) {
      setEmergencyContactsVisible(true);
      setShouldShowPsychologistAlert(true);
    } else if (hasHighRisk) {
      setShouldShowPsychologistAlert(true);
    }
  }, [messages]);

  // IMPROVED TTS Functions - Fungsi-fungsi TTS yang telah diperbaiki

  /**
   * Fungsi untuk membersihkan dan menormalisasi teks sebelum dibacakan
   * @param text - Teks mentah yang akan dibersihkan
   * @returns Teks yang sudah dibersihkan dan dinormalisasi
   */
  const cleanTextForSpeech = (text: string): string => {
    let cleanedText = text;

    // 1. Hapus format markdown
    cleanedText = cleanedText
      // Hapus bold markdown (**text** atau __text__)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      
      // Hapus italic markdown (*text* atau _text_)
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      
      // Hapus strikethrough (~~text~~)
      .replace(/~~(.*?)~~/g, '$1')
      
      // Hapus heading markdown (# ## ### dll)
      .replace(/#{1,6}\s+/g, '')
      
      // Hapus code blocks (```code``` atau `code`)
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      
      // Hapus link markdown [text](url) - ambil teksnya saja
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      
      // Hapus image markdown ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      
      // Hapus blockquote (> text)
      .replace(/^>\s+/gm, '')
      
      // Hapus horizontal rule (--- atau ***)
      .replace(/^[-*]{3,}$/gm, '')
      
      // Hapus bullet points dan numbering
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      
      // Hapus table formatting
      .replace(/\|/g, ' ')
      .replace(/^[-\s|:]+$/gm, '');

    // 2. Normalisasi simbol dan karakter khusus
    cleanedText = cleanedText
      // Ganti emoji umum dengan deskripsi
      .replace(/🚨/g, 'peringatan')
      .replace(/💙/g, 'hati biru')
      .replace(/❤️/g, 'hati merah')
      .replace(/😊/g, 'senyum')
      .replace(/😢/g, 'sedih')
      .replace(/😔/g, 'kecewa')
      .replace(/🤗/g, 'peluk')
      .replace(/💪/g, 'kuat')
      .replace(/🌟/g, 'bintang')
      .replace(/✨/g, 'berkilau')
      
      // Ganti simbol dengan kata
      .replace(/&/g, ' dan ')
      .replace(/@/g, ' at ')
      .replace(/#/g, ' hashtag ')
      .replace(/\$/g, ' dollar ')
      .replace(/%/g, ' persen ')
      .replace(/\+/g, ' plus ')
      .replace(/=/g, ' sama dengan ')
      .replace(/</g, ' kurang dari ')
      .replace(/>/g, ' lebih dari ')
      
      // Hapus karakter khusus yang tidak perlu
      .replace(/[^\w\s.,!?;:()\-]/g, ' ')
      
      // Normalisasi tanda baca
      .replace(/\.{2,}/g, '.')
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      .replace(/,{2,}/g, ',');

    // 3. Normalisasi singkatan dan akronim umum
    const abbreviations: { [key: string]: string } = {
      // Singkatan umum dalam bahasa Indonesia
      'AI': 'A I',
      'TTS': 'T T S',
      'API': 'A P I',
      'URL': 'U R L',
      'HTML': 'H T M L',
      'CSS': 'C S S',
      'JS': 'J S',
      'FAQ': 'F A Q',
      'CEO': 'C E O',
      'HR': 'H R',
      'IT': 'I T',
      'UI': 'U I',
      'UX': 'U X',
      'GPS': 'G P S',
      'SMS': 'S M S',
      'WiFi': 'Wi Fi',
      'USB': 'U S B',
      'PDF': 'P D F',
      'JPG': 'J P G',
      'PNG': 'P N G',
      'MP3': 'M P 3',
      'MP4': 'M P 4',
      'DVD': 'D V D',
      'TV': 'T V',
      'PC': 'P C',
      'OS': 'O S',
      'RAM': 'R A M',
      'SSD': 'S S D',
      'CPU': 'C P U',
      'GPU': 'G P U',
      
      // Singkatan psikologi dan kesehatan mental
      'OCD': 'O C D',
      'PTSD': 'P T S D',
      'ADHD': 'A D H D',
      'CBT': 'C B T',
      'DBT': 'D B T',
      'DSM': 'D S M',
      'ICD': 'I C D',
      
      // Singkatan umum lainnya
      'etc': 'dan lain-lain',
      'vs': 'versus',
      'aka': 'alias',
      'FYI': 'F Y I',
      'ASAP': 'A S A P',
      'DIY': 'D I Y',
      'LOL': 'L O L',
      'OMG': 'O M G',
      'WTF': 'W T F',
      'YOLO': 'Y O L O',
      
      // Singkatan waktu
      'AM': 'A M',
      'PM': 'P M',
      'GMT': 'G M T',
      'UTC': 'U T C',
      
      // Singkatan mata uang
      'USD': 'U S D',
      'EUR': 'E U R',
      'GBP': 'G B P',
      'JPY': 'J P Y',
      'IDR': 'I D R',
      'SGD': 'S G D',
      'MYR': 'M Y R',
      
      // Singkatan negara
      'USA': 'U S A',
      'UK': 'U K',
      'UAE': 'U A E',
      'EU': 'E U',
      'UN': 'U N',
      'WHO': 'W H O',
      'NASA': 'N A S A',
      'FBI': 'F B I',
      'CIA': 'C I A',
      'NATO': 'N A T O'
    };

    // Terapkan normalisasi singkatan
    Object.entries(abbreviations).forEach(([abbr, expansion]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      cleanedText = cleanedText.replace(regex, expansion);
    });

    // 4. Normalisasi angka dan tanggal
    cleanedText = cleanedText
      // Ubah angka dengan koma menjadi format yang lebih natural
      .replace(/(\d+),(\d+)/g, '$1 koma $2')
      
      // Ubah format tanggal
      .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, '$1 slash $2 slash $3')
      .replace(/(\d{1,2})-(\d{1,2})-(\d{4})/g, '$1 strip $2 strip $3')
      
      // Ubah format waktu
      .replace(/(\d{1,2}):(\d{2})/g, '$1 titik dua $2')
      
      // Ubah format persentase
      .replace(/(\d+)%/g, '$1 persen')
      
      // Ubah format mata uang
      .replace(/\$(\d+)/g, '$1 dollar')
      .replace(/Rp\s?(\d+)/g, '$1 rupiah')
      .replace(/€(\d+)/g, '$1 euro')
      .replace(/£(\d+)/g, '$1 pound');

    // 5. Normalisasi spasi dan line breaks
    cleanedText = cleanedText
      // Ganti line breaks dengan jeda natural
      .replace(/\n+/g, '. ')
      .replace(/\r+/g, '. ')
      
      // Normalisasi spasi berlebihan
      .replace(/\s+/g, ' ')
      
      // Hapus spasi di awal dan akhir
      .trim();

    // 6. Perbaiki struktur kalimat untuk pembacaan yang lebih natural
    cleanedText = cleanedText
      // Pastikan ada jeda setelah tanda baca
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      .replace(/([,;:])\s*/g, '$1 ')
      
      // Hapus tanda baca berlebihan di akhir
      .replace(/[.!?]+$/, '.')
      
      // Pastikan kalimat diakhiri dengan tanda baca
      .replace(/([^.!?])$/, '$1.');

    // 7. Validasi dan pembersihan akhir
    if (cleanedText.length === 0) {
      return 'Teks kosong';
    }

    // Batasi panjang teks untuk menghindari pembacaan yang terlalu lama
    if (cleanedText.length > 1000) {
      cleanedText = cleanedText.substring(0, 997) + '...';
    }

    return cleanedText;
  };

  /**
   * Fungsi utama untuk mengubah teks menjadi suara menggunakan Web Speech API
   * @param text - Teks yang akan dibacakan
   */
  const speak = (text: string) => {
    // Cek apakah browser mendukung Web Speech API
    if (!('speechSynthesis' in window)) {
      console.warn('Browser tidak mendukung Web Speech API');
      return;
    }

    // Hentikan pembacaan sebelumnya jika ada
    window.speechSynthesis.cancel();

    // Bersihkan dan normalisasi teks
    const cleanText = cleanTextForSpeech(text);

    // Jika teks kosong setelah dibersihkan, jangan lanjutkan
    if (!cleanText || cleanText.trim().length === 0) {
      console.warn('Teks kosong setelah dibersihkan');
      return;
    }

    // Buat utterance baru
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Pengaturan bahasa - prioritaskan bahasa Indonesia
    utterance.lang = 'id-ID';
    
    // Pengaturan kecepatan bicara (0.1 - 10, default 1)
    // 0.8-0.9 terdengar lebih natural untuk bahasa Indonesia
    utterance.rate = 0.85;
    
    // Pengaturan volume (0 - 1, default 1)
    // Sedikit lebih rendah agar tidak terlalu keras
    utterance.volume = 0.9;
    
    // Pengaturan pitch/nada suara (0 - 2, default 1)
    // Sedikit lebih rendah untuk suara yang lebih hangat
    utterance.pitch = 0.95;

    // Event listeners untuk monitoring dan debugging
    utterance.onstart = () => {
      console.log('TTS mulai berbicara:', cleanText.substring(0, 50) + '...');
    };

    utterance.onend = () => {
      console.log('TTS selesai berbicara');
    };

    utterance.onerror = (event) => {
      console.error('TTS error:', event.error);
      
      // Coba fallback dengan pengaturan yang lebih sederhana
      if (event.error === 'language-unavailable') {
        console.warn('Bahasa tidak didukung.');
        const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
        fallbackUtterance.rate = 0.9;
        fallbackUtterance.volume = 0.8;
        fallbackUtterance.pitch = 1;
        window.speechSynthesis.speak(fallbackUtterance);
      }
    };

    utterance.onpause = () => {
      console.log('TTS dijeda');
    };

    utterance.onresume = () => {
      console.log('TTS dilanjutkan');
    };

    // Mulai berbicara
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error saat memulai TTS:', error);
    }
  };

  /**
   * Fungsi untuk menghentikan pembacaan TTS
   */
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      console.log('TTS dihentikan');
    }
  };

  /**
   * Fungsi untuk toggle (mengaktifkan/menonaktifkan) TTS
   */
  const toggleTTS = () => {
    setIsTTSActive(prev => {
      const newState = !prev;
      
      // Jika TTS dinonaktifkan, hentikan pembacaan yang sedang berlangsung
      if (!newState) {
        stopSpeaking();
      }
      
      console.log(`TTS ${newState ? 'diaktifkan' : 'dinonaktifkan'}`);
      return newState;
    });
  };

  // IMPROVED: Main sendMessage function with better language handling
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const detectedLanguage = detectLanguage(content);
    const riskLevel = assessPsychologicalRisk(content);
    const topicRelevance = detectPsychologyRelevance(content);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: detectedLanguage,
      riskLevel: riskLevel,
      topicRelevance: topicRelevance,
      requiresImmediateHelp: riskLevel === 'critical',
      type: riskLevel === 'critical' ? 'crisis' : 'normal',
    };
    
    setMessages((prev) => [...prev, userMessage]);
    saveMessageToSupabase(userMessage.content);
    setIsLoading(true);
    
    try {
      // Handle critical risk immediately
      if (riskLevel === 'critical') {
        const crisisResponse = createCrisisResponse(detectedLanguage);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: crisisResponse,
          sender: 'ai',
          timestamp: new Date(),
          language: detectedLanguage,
          topicRelevance: 'psychology',
          requiresImmediateHelp: true,
          type: 'crisis',
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        
        // TTS: Bacakan respons krisis jika TTS aktif
        if (isTTSActive) {
          speak(crisisResponse);
        }
        
        setEmergencyContactsVisible(true);
        setIsLoading(false);
        return;
      }

      // Get chat history with same language preference
      const filteredChatHistory = messages
        .filter(msg => msg.type !== 'crisis')
        .slice(-12)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content,
        }));

      // IMPROVED: Create system prompt with explicit language instruction
      const systemPrompt = createEmpatheticSystemPrompt(detectedLanguage, riskLevel);
      
      // FIXED: Add explicit language instruction as separate user message
      let languageInstruction = '';
      if (detectedLanguage === 'id') {
        languageInstruction = 'Mohon jawab dalam Bahasa Indonesia saja. Jangan gunakan Bahasa Inggris sama sekali.';
      } else {
        languageInstruction = 'Please respond in English only. Do not use Indonesian at all.';
      }
      
      // IMPROVED: Better API message structure with language reinforcement
      const apiMessages = [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        ...filteredChatHistory,
        {
          role: 'user' as const,
          content: `${languageInstruction}\n\n${content.trim()}`,
        }
      ];
      
      // IMPROVED: Call Groq API with increased token limit
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: apiMessages,
          max_tokens: 600, // INCREASED from 300 to 600
          temperature: 0.7,
          top_p: 0.8,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.choices[0]?.message?.content || 
        (detectedLanguage === 'en' ? 'Sorry, no response received.' : 'Maaf, tidak ada respons yang diterima.');
      
      // Add professional support messages for high risk (but less intrusive)
      if (riskLevel === 'high') {
        const supportMessage = detectedLanguage === 'en'
          ? "\n\n💙 **Consider Professional Support**: If you feel comfortable, speaking with a mental health professional could provide additional specialized support during this time."
          : "\n\n💙 **Pertimbangkan Dukungan Profesional**: Jika Anda merasa nyaman, berbicara dengan profesional kesehatan mental dapat memberikan dukungan khusus tambahan di masa ini.";
        aiResponse += supportMessage;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        language: detectedLanguage,
        topicRelevance: 'psychology',
        type: 'normal',
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // TTS: Bacakan respons AI jika TTS aktif
      if (isTTSActive) {
        // Tambahkan delay kecil untuk memastikan pesan sudah ditampilkan
        setTimeout(() => {
          speak(aiResponse);
        }, 500);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: detectedLanguage === 'en' 
          ? "I apologize, but I'm having trouble connecting right now. Please try again, or if this is urgent, please contact a mental health professional or crisis helpline immediately."
          : "Maaf, saya mengalami masalah koneksi saat ini. Silakan coba lagi, atau jika ini mendesak, segera hubungi profesional kesehatan mental atau hotline krisis.",
        sender: 'ai',
        timestamp: new Date(),
        language: detectedLanguage,
        topicRelevance: 'psychology',
        type: 'normal',
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      // TTS: Bacakan pesan error jika TTS aktif
      if (isTTSActive) {
        speak(errorMessage.content);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // Hentikan TTS jika sedang berbicara
    stopSpeaking();
    
    setMessages([]);
    setShouldShowPsychologistAlert(false);
    setEmergencyContactsVisible(false);
    localStorage.removeItem('chatMessages');
  };

  const dismissPsychologistAlert = () => {
    setShouldShowPsychologistAlert(false);
  };

  const showEmergencyContacts = () => {
    setEmergencyContactsVisible(true);
  };

  const hideEmergencyContacts = () => {
    setEmergencyContactsVisible(false);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      sendMessage, 
      clearChat,
      shouldShowPsychologistAlert,
      dismissPsychologistAlert,
      emergencyContactsVisible,
      showEmergencyContacts,
      hideEmergencyContacts,
      // TTS functions - Fungsi-fungsi TTS yang telah diperbaiki
      isTTSActive,
      toggleTTS,
      speak,
      stopSpeaking
    }}>
      {children}
    </ChatContext.Provider>
  );
};
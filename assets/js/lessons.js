/* ===== Sanctum course packs =====
   Each language has a "course road": an ordered list of topical packs,
   each containing a few short lessons, each lesson a handful of words.
   Every language starts with a Foundations pack built from the same
   small hand-picked starter set (confidence varies by language — treat
   this as a starting point, not a verified course; native-speaker
   review is worth doing before relying on the less common ones).
   Where a real human-voice recording exists (sourced from Wikimedia
   Commons, see assets/audio/lessons/CREDITS.md for attribution, or
   pre-generated once via Piper — see speech.js), `audio` points to it
   and speakWord() plays that instead of live-synthesizing TTS. Entries
   without an `audio` field fall back to TTS automatically.
   More packs can be appended per language over time without touching
   any UI code — language.html and lesson.html both just read whatever
   packs/lessons exist here. */

function foundationsPack(words) {
  return [{
    id: 'foundations', name: 'Foundations', icon: 'waving_hand',
    lessons: [
      { id: 'greetings', name: 'Greetings', words: [words[0], words[1]] },
      { id: 'yes-no', name: 'Yes & No', words: [words[2], words[3]] },
      { id: 'essentials', name: 'Essentials', words: [words[4], words[5]] },
    ],
  }];
}

const LESSON_PACKS = {
  'Arabic': foundationsPack([
    { arabic: 'مرحبا', translit: 'Marhaban', meaning: 'Hello', audio: 'assets/audio/lessons/arabic-hello.wav' },
    { arabic: 'شكرا', translit: 'Shukran', meaning: 'Thank you', audio: 'assets/audio/lessons/arabic-thankyou.wav' },
    { arabic: 'نعم', translit: "Na'am", meaning: 'Yes', audio: 'assets/audio/lessons/arabic-yes.wav' },
    { arabic: 'لا', translit: 'La', meaning: 'No', audio: 'assets/audio/lessons/arabic-no.wav' },
    { arabic: 'ماء', translit: "Ma'", meaning: 'Water', audio: 'assets/audio/lessons/arabic-water.wav' },
    { arabic: 'واحد', translit: 'Wahid', meaning: 'One', audio: 'assets/audio/lessons/arabic-one.wav' },
  ]),
  'Quranic Arabic': foundationsPack([
    { arabic: 'الْحَمْدُ', translit: 'Al-Hamd', meaning: 'Praise', audio: 'assets/audio/lessons/quranic-arabic-praise.wav' },
    { arabic: 'رَبّ', translit: 'Rabb', meaning: 'Lord', audio: 'assets/audio/lessons/quranic-arabic-lord.wav' },
    { arabic: 'الرَّحْمَن', translit: 'Ar-Rahman', meaning: 'The Most Gracious', audio: 'assets/audio/lessons/quranic-arabic-the-most-gracious.wav' },
    { arabic: 'كِتَاب', translit: 'Kitab', meaning: 'Book', audio: 'assets/audio/lessons/quranic-arabic-book.wav' },
    { arabic: 'هُدًى', translit: 'Huda', meaning: 'Guidance', audio: 'assets/audio/lessons/quranic-arabic-guidance.wav' },
    { arabic: 'نُور', translit: 'Nur', meaning: 'Light', audio: 'assets/audio/lessons/quranic-arabic-light.wav' },
  ]),
  'Spanish': foundationsPack([
    { arabic: 'Hola', translit: 'OH-lah', meaning: 'Hello' },
    { arabic: 'Gracias', translit: 'GRAH-see-as', meaning: 'Thank you', audio: 'assets/audio/lessons/spanish-thankyou.oga' },
    { arabic: 'Sí', translit: 'see', meaning: 'Yes' },
    { arabic: 'No', translit: 'no', meaning: 'No' },
    { arabic: 'Agua', translit: 'AH-gwah', meaning: 'Water' },
    { arabic: 'Uno', translit: 'OO-no', meaning: 'One' },
  ]),
  'French': foundationsPack([
    { arabic: 'Bonjour', translit: 'bon-ZHOOR', meaning: 'Hello', audio: 'assets/audio/lessons/french-hello.ogg' },
    { arabic: 'Merci', translit: 'mehr-SEE', meaning: 'Thank you' },
    { arabic: 'Oui', translit: 'wee', meaning: 'Yes' },
    { arabic: 'Non', translit: 'nohn', meaning: 'No' },
    { arabic: 'Eau', translit: 'oh', meaning: 'Water' },
    { arabic: 'Un', translit: 'uhn', meaning: 'One' },
  ]),
  'German': foundationsPack([
    { arabic: 'Hallo', translit: 'HAH-lo', meaning: 'Hello' },
    { arabic: 'Danke', translit: 'DAHN-kuh', meaning: 'Thank you' },
    { arabic: 'Ja', translit: 'yah', meaning: 'Yes' },
    { arabic: 'Nein', translit: 'nine', meaning: 'No' },
    { arabic: 'Wasser', translit: 'VAH-ser', meaning: 'Water' },
    { arabic: 'Eins', translit: 'ines', meaning: 'One' },
  ]),
  'Italian': foundationsPack([
    { arabic: 'Ciao', translit: 'chow', meaning: 'Hello' },
    { arabic: 'Grazie', translit: 'GRAHT-see-eh', meaning: 'Thank you' },
    { arabic: 'Sì', translit: 'see', meaning: 'Yes' },
    { arabic: 'No', translit: 'no', meaning: 'No' },
    { arabic: 'Acqua', translit: 'AH-kwah', meaning: 'Water' },
    { arabic: 'Uno', translit: 'OO-no', meaning: 'One' },
  ]),
  'Portuguese': foundationsPack([
    { arabic: 'Olá', translit: 'oh-LAH', meaning: 'Hello' },
    { arabic: 'Obrigado', translit: 'oh-bree-GAH-doo', meaning: 'Thank you', audio: 'assets/audio/lessons/portuguese-thankyou.oga' },
    { arabic: 'Sim', translit: 'seeng', meaning: 'Yes' },
    { arabic: 'Não', translit: 'now', meaning: 'No' },
    { arabic: 'Água', translit: 'AH-gwah', meaning: 'Water' },
    { arabic: 'Um', translit: 'oong', meaning: 'One' },
  ]),
  'Russian': foundationsPack([
    { arabic: 'Привет', translit: 'Privet', meaning: 'Hello' },
    { arabic: 'Спасибо', translit: 'Spasibo', meaning: 'Thank you', audio: 'assets/audio/lessons/russian-thankyou.ogg' },
    { arabic: 'Да', translit: 'Da', meaning: 'Yes' },
    { arabic: 'Нет', translit: 'Net', meaning: 'No', audio: 'assets/audio/lessons/russian-no.ogg' },
    { arabic: 'Вода', translit: 'Voda', meaning: 'Water' },
    { arabic: 'Один', translit: 'Odin', meaning: 'One' },
  ]),
  'Mandarin': [
    ...foundationsPack([
      { arabic: '你好', translit: 'Nǐ hǎo', meaning: 'Hello', audio: 'assets/audio/lessons/mandarin-hello.wav' },
      { arabic: '谢谢', translit: 'Xièxiè', meaning: 'Thank you', audio: 'assets/audio/lessons/mandarin-thankyou.wav' },
      { arabic: '是', translit: 'Shì', meaning: 'Yes', audio: 'assets/audio/lessons/mandarin-yes.wav' },
      { arabic: '不', translit: 'Bù', meaning: 'No', audio: 'assets/audio/lessons/mandarin-no.wav' },
      { arabic: '水', translit: 'Shuǐ', meaning: 'Water', audio: 'assets/audio/lessons/mandarin-water.wav' },
      { arabic: '一', translit: 'Yī', meaning: 'One', audio: 'assets/audio/lessons/mandarin-one.wav' },
    ]),
    {
      id: 'communication', name: 'Communication', icon: 'forum',
      lessons: [
        { id: 'basics', name: 'Me & You', words: [
          { arabic: '我', translit: 'Wǒ', meaning: 'I / me' },
          { arabic: '你', translit: 'Nǐ', meaning: 'You' },
        ] },
        { id: 'questions', name: 'Asking', words: [
          { arabic: '什么', translit: 'Shénme', meaning: 'What' },
          { arabic: '谁', translit: 'Shéi', meaning: 'Who' },
        ] },
      ],
    },
    {
      id: 'numbers-family', name: 'Numbers & Family', icon: 'calculate',
      lessons: [
        { id: 'numbers', name: 'Counting On', words: [
          { arabic: '二', translit: 'Èr', meaning: 'Two' },
          { arabic: '三', translit: 'Sān', meaning: 'Three' },
        ] },
        { id: 'family', name: 'Family', words: [
          { arabic: '妈妈', translit: 'Māma', meaning: 'Mom' },
          { arabic: '爸爸', translit: 'Bàba', meaning: 'Dad' },
        ] },
      ],
    },
  ],
  'Japanese': foundationsPack([
    { arabic: 'こんにちは', translit: 'Konnichiwa', meaning: 'Hello' },
    { arabic: 'ありがとう', translit: 'Arigatou', meaning: 'Thank you' },
    { arabic: 'はい', translit: 'Hai', meaning: 'Yes' },
    { arabic: 'いいえ', translit: 'Iie', meaning: 'No', audio: 'assets/audio/lessons/japanese-no.wav' },
    { arabic: '水', translit: 'Mizu', meaning: 'Water' },
    { arabic: '一', translit: 'Ichi', meaning: 'One' },
  ]),
  'Korean': foundationsPack([
    { arabic: '안녕하세요', translit: 'Annyeonghaseyo', meaning: 'Hello', audio: 'assets/audio/lessons/korean-hello.wav' },
    { arabic: '감사합니다', translit: 'Gamsahamnida', meaning: 'Thank you', audio: 'assets/audio/lessons/korean-thankyou.oga' },
    { arabic: '네', translit: 'Ne', meaning: 'Yes', audio: 'assets/audio/lessons/korean-yes.wav' },
    { arabic: '아니요', translit: 'Aniyo', meaning: 'No', audio: 'assets/audio/lessons/korean-no.wav' },
    { arabic: '물', translit: 'Mul', meaning: 'Water', audio: 'assets/audio/lessons/korean-water.ogg' },
    { arabic: '하나', translit: 'Hana', meaning: 'One', audio: 'assets/audio/lessons/korean-one.wav' },
  ]),
  'Hindi': foundationsPack([
    { arabic: 'नमस्ते', translit: 'Namaste', meaning: 'Hello', audio: 'assets/audio/lessons/hindi-hello.wav' },
    { arabic: 'धन्यवाद', translit: 'Dhanyavaad', meaning: 'Thank you', audio: 'assets/audio/lessons/hindi-thankyou.wav' },
    { arabic: 'हाँ', translit: 'Haan', meaning: 'Yes', audio: 'assets/audio/lessons/hindi-yes.wav' },
    { arabic: 'नहीं', translit: 'Nahin', meaning: 'No', audio: 'assets/audio/lessons/hindi-no.wav' },
    { arabic: 'पानी', translit: 'Paani', meaning: 'Water' },
    { arabic: 'एक', translit: 'Ek', meaning: 'One' },
  ]),
  'Turkish': foundationsPack([
    { arabic: 'Merhaba', translit: 'mer-hah-BAH', meaning: 'Hello', audio: 'assets/audio/lessons/turkish-hello.wav' },
    { arabic: 'Teşekkürler', translit: 'teh-shek-kur-LER', meaning: 'Thank you', audio: 'assets/audio/lessons/turkish-thankyou.wav' },
    { arabic: 'Evet', translit: 'EH-vet', meaning: 'Yes' },
    { arabic: 'Hayır', translit: 'HAH-yur', meaning: 'No', audio: 'assets/audio/lessons/turkish-no.wav' },
    { arabic: 'Su', translit: 'soo', meaning: 'Water' },
    { arabic: 'Bir', translit: 'beer', meaning: 'One' },
  ]),
  'Vietnamese': foundationsPack([
    { arabic: 'Xin chào', translit: 'sin chow', meaning: 'Hello' },
    { arabic: 'Cảm ơn', translit: 'gam uhn', meaning: 'Thank you', audio: 'assets/audio/lessons/vietnamese-thankyou.wav' },
    { arabic: 'Vâng', translit: 'vung', meaning: 'Yes', audio: 'assets/audio/lessons/vietnamese-yes.wav' },
    { arabic: 'Không', translit: 'khohng', meaning: 'No', audio: 'assets/audio/lessons/vietnamese-no.oga' },
    { arabic: 'Nước', translit: 'nuhk', meaning: 'Water' },
    { arabic: 'Một', translit: 'moht', meaning: 'One', audio: 'assets/audio/lessons/vietnamese-one.wav' },
  ]),
  'Thai': foundationsPack([
    { arabic: 'สวัสดี', translit: 'Sawasdee', meaning: 'Hello' },
    { arabic: 'ขอบคุณ', translit: 'Khob khun', meaning: 'Thank you' },
    { arabic: 'ใช่', translit: 'Chai', meaning: 'Yes' },
    { arabic: 'ไม่', translit: 'Mai', meaning: 'No' },
    { arabic: 'น้ำ', translit: 'Nam', meaning: 'Water' },
    { arabic: 'หนึ่ง', translit: 'Neung', meaning: 'One' },
  ]),
  'Indonesian': foundationsPack([
    { arabic: 'Halo', translit: 'HAH-lo', meaning: 'Hello' },
    { arabic: 'Terima kasih', translit: 'te-REE-ma KAH-sih', meaning: 'Thank you' },
    { arabic: 'Ya', translit: 'yah', meaning: 'Yes' },
    { arabic: 'Tidak', translit: 'TEE-dahk', meaning: 'No', audio: 'assets/audio/lessons/indonesian-no.wav' },
    { arabic: 'Air', translit: 'AH-yeer', meaning: 'Water' },
    { arabic: 'Satu', translit: 'SAH-too', meaning: 'One' },
  ]),
  'Dutch': foundationsPack([
    { arabic: 'Hallo', translit: 'HAH-loh', meaning: 'Hello' },
    { arabic: 'Dank je', translit: 'dahnk yuh', meaning: 'Thank you', audio: 'assets/audio/lessons/dutch-thankyou.wav' },
    { arabic: 'Ja', translit: 'yah', meaning: 'Yes' },
    { arabic: 'Nee', translit: 'nay', meaning: 'No' },
    { arabic: 'Water', translit: 'VAH-ter', meaning: 'Water' },
    { arabic: 'Een', translit: 'ayn', meaning: 'One' },
  ]),
  'Swedish': foundationsPack([
    { arabic: 'Hej', translit: 'hey', meaning: 'Hello' },
    { arabic: 'Tack', translit: 'tahk', meaning: 'Thank you' },
    { arabic: 'Ja', translit: 'yah', meaning: 'Yes' },
    { arabic: 'Nej', translit: 'nay', meaning: 'No' },
    { arabic: 'Vatten', translit: 'VAH-ten', meaning: 'Water' },
    { arabic: 'Ett', translit: 'et', meaning: 'One' },
  ]),
  'Polish': foundationsPack([
    { arabic: 'Cześć', translit: 'cheshch', meaning: 'Hello', audio: 'assets/audio/lessons/polish-hello.ogg' },
    { arabic: 'Dziękuję', translit: 'jen-KOO-yeh', meaning: 'Thank you', audio: 'assets/audio/lessons/polish-thankyou.wav' },
    { arabic: 'Tak', translit: 'tahk', meaning: 'Yes' },
    { arabic: 'Nie', translit: 'nyeh', meaning: 'No', audio: 'assets/audio/lessons/polish-no.ogg' },
    { arabic: 'Woda', translit: 'VOH-dah', meaning: 'Water' },
    { arabic: 'Jeden', translit: 'YEH-den', meaning: 'One' },
  ]),
  'Greek': foundationsPack([
    { arabic: 'Γεια σου', translit: 'Yia sou', meaning: 'Hello' },
    { arabic: 'Ευχαριστώ', translit: 'Efharisto', meaning: 'Thank you', audio: 'assets/audio/lessons/greek-thankyou.ogg' },
    { arabic: 'Ναι', translit: 'Ne', meaning: 'Yes', audio: 'assets/audio/lessons/greek-yes.ogg' },
    { arabic: 'Όχι', translit: 'Ochi', meaning: 'No' },
    { arabic: 'Νερό', translit: 'Nero', meaning: 'Water' },
    { arabic: 'Ένα', translit: 'Ena', meaning: 'One', audio: 'assets/audio/lessons/greek-one.ogg' },
  ]),
  'Swahili': foundationsPack([
    { arabic: 'Habari', translit: 'hah-BAH-ree', meaning: 'Hello', audio: 'assets/audio/lessons/swahili-hello.wav' },
    { arabic: 'Asante', translit: 'ah-SAHN-teh', meaning: 'Thank you' },
    { arabic: 'Ndiyo', translit: 'n-DEE-yo', meaning: 'Yes', audio: 'assets/audio/lessons/swahili-yes.flac' },
    { arabic: 'Hapana', translit: 'hah-PAH-nah', meaning: 'No', audio: 'assets/audio/lessons/swahili-no.flac' },
    { arabic: 'Maji', translit: 'MAH-jee', meaning: 'Water' },
    { arabic: 'Moja', translit: 'MOH-jah', meaning: 'One' },
  ]),
  'Twi': foundationsPack([
    { arabic: 'Akwaaba', translit: 'ah-KWAH-bah', meaning: 'Welcome / Hello' },
    { arabic: 'Medaase', translit: 'meh-DAH-seh', meaning: 'Thank you', audio: 'assets/audio/lessons/twi-thankyou.wav' },
    { arabic: 'Aane', translit: 'AH-neh', meaning: 'Yes' },
    { arabic: 'Daabi', translit: 'DAH-bee', meaning: 'No' },
    { arabic: 'Nsuo', translit: 'n-SOO-oh', meaning: 'Water', audio: 'assets/audio/lessons/twi-water.wav' },
    { arabic: 'Baako', translit: 'BAH-koh', meaning: 'One', audio: 'assets/audio/lessons/twi-one.wav' },
  ]),
  'Urdu': foundationsPack([
    { arabic: 'السلام علیکم', translit: 'Assalamu alaikum', meaning: 'Hello', audio: 'assets/audio/lessons/urdu-hello.wav' },
    { arabic: 'شکریہ', translit: 'Shukriya', meaning: 'Thank you', audio: 'assets/audio/lessons/urdu-thankyou.wav' },
    { arabic: 'جی ہاں', translit: 'Ji haan', meaning: 'Yes' },
    { arabic: 'نہیں', translit: 'Nahin', meaning: 'No', audio: 'assets/audio/lessons/urdu-no.wav' },
    { arabic: 'پانی', translit: 'Paani', meaning: 'Water', audio: 'assets/audio/lessons/urdu-water.wav' },
    { arabic: 'ایک', translit: 'Ek', meaning: 'One', audio: 'assets/audio/lessons/urdu-one.wav' },
  ]),
  'Persian': foundationsPack([
    { arabic: 'سلام', translit: 'Salaam', meaning: 'Hello' },
    { arabic: 'متشکرم', translit: 'Motshakeram', meaning: 'Thank you' },
    { arabic: 'بله', translit: 'Bale', meaning: 'Yes', audio: 'assets/audio/lessons/persian-yes.ogg' },
    { arabic: 'نه', translit: 'Na', meaning: 'No', audio: 'assets/audio/lessons/persian-no.ogg' },
    { arabic: 'آب', translit: 'Ab', meaning: 'Water' },
    { arabic: 'یک', translit: 'Yek', meaning: 'One' },
  ]),
  'Bengali': foundationsPack([
    { arabic: 'নমস্কার', translit: 'Nomoshkar', meaning: 'Hello', audio: 'assets/audio/lessons/bengali-hello.ogg' },
    { arabic: 'ধন্যবাদ', translit: 'Dhonnobad', meaning: 'Thank you', audio: 'assets/audio/lessons/bengali-thankyou.wav' },
    { arabic: 'হ্যাঁ', translit: 'Hae', meaning: 'Yes', audio: 'assets/audio/lessons/bengali-yes.wav' },
    { arabic: 'না', translit: 'Na', meaning: 'No', audio: 'assets/audio/lessons/bengali-no.wav' },
    { arabic: 'পানি', translit: 'Pani', meaning: 'Water', audio: 'assets/audio/lessons/bengali-water.ogg' },
    { arabic: 'এক', translit: 'Ek', meaning: 'One', audio: 'assets/audio/lessons/bengali-one.wav' },
  ]),
};

function getPacks(langName) {
  return LESSON_PACKS[langName] || [];
}

function getLesson(langName, packId, lessonId) {
  const pack = getPacks(langName).find(p => p.id === packId);
  const lesson = pack && pack.lessons.find(l => l.id === lessonId);
  return lesson ? lesson.words : [];
}

// Firebase 초기화
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyBUVDId1MQDMbqZ3xpi8qGrAR7VPsTNfz4",
  authDomain: "word-quiz-fca02.firebaseapp.com",
  projectId: "word-quiz-fca02",
  storageBucket: "word-quiz-fca02.firebasestorage.app",
  messagingSenderId: "985797147166",
  appId: "1:985797147166:web:d959328a4625bc893a8c0f",
  "site": "word-quiz-fca02-a7817",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleQuizzes = [
  {
    words: [
      '나는 매일 아침 운동을 합니다',
      '우리 함께 공원에서 산책해요',
      '창 밖으로 예쁜 꽃이 피었어요'
    ],
    author: '선생님',
    tags: ['초등', '1학년', '문장'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    words: [
      '달콤한 초콜릿을 먹었어요',
      '동생과 함께 그림을 그려요',
      '강아지가 공을 가지고 놀아요'
    ],
    author: '선생님',
    tags: ['초등', '2학년', '일상'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    words: [
      '친구들과 축구를 하며 놀았어요',
      '도서관에서 책을 읽어보아요',
      '맛있는 간식을 나누어 먹어요'
    ],
    author: '선생님',
    tags: ['초등', '3학년', '활동'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

async function seedWordQuiz2() {
  try {
    const wordsCollection = collection(db, 'wordquiz2')
    
    for (const quiz of sampleQuizzes) {
      await addDoc(wordsCollection, quiz)
      console.log('Added quiz:', quiz.words[0])
    }
    
    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seedWordQuiz2() 
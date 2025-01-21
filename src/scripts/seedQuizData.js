import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const quizData = [
  {
    author: '생활선생님',
    words: ['안전벨트', '횡단보도', '신호등불', '자전거길'],
    tags: ['초등', '안전', '생활'],
  },
  {
    author: '예절선생님',
    words: ['감사인사', '공손하게', '배려하기', '양보하기'],
    tags: ['초등', '예절', '인성'],
  },
  {
    author: '시간선생님',
    words: ['아침시간', '점심시간', '저녁시간', '하루일과'],
    tags: ['초등', '시간', '생활'],
  },
  {
    author: '교실선생님',
    words: ['도서관실', '컴퓨터실', '과학실험', '음악교실'],
    tags: ['초등', '학교', '교실'],
  },
  {
    author: '급식선생님',
    words: ['식판정리', '잔반처리', '손씻기물', '급식순서'],
    tags: ['초등', '급식', '식사'],
  },
  {
    author: '과학선생님',
    words: ['지구온도', '태양에너', '달관측기', '별자리판'],
    tags: ['초등', '과학', '우주'],
  },
  {
    author: '환경선생님',
    words: ['분리수거', '재활용품', '환경보호', '지구사랑'],
    tags: ['초등', '환경', '보호'],
  },
  {
    author: '날씨선생님',
    words: ['비올예보', '기상예보', '태풍주의', '폭설주의'],
    tags: ['초등', '날씨', '예보'],
  },
  {
    author: '수학선생님',
    words: ['덧셈하기', '뺄셈하기', '곱셈하기', '나눗셈구'],
    tags: ['초등', '수학', '계산'],
  },
  {
    author: '국어선생님',
    words: ['맞춤법칙', '문장부호', '높임말로', '반대말찾'],
    tags: ['초등', '국어', '문법'],
  },
  {
    author: '사회선생님',
    words: ['우리나라', '세계지도', '지도기호', '방위표시'],
    tags: ['초등', '사회', '지리'],
  },
  {
    author: '체육선생님',
    words: ['줄넘기장', '농구공놀', '배구연습', '체조운동'],
    tags: ['초등', '체육', '운동'],
  },
  {
    author: '미술선생님',
    words: ['그림그리', '색칠하기', '종이접기', '만들기반'],
    tags: ['초등', '미술', '창작'],
  },
  {
    author: '음악선생님',
    words: ['노래부르', '악기연주', '리듬치기', '박자맞추'],
    tags: ['초등', '음악', '연주'],
  },
  {
    author: '봄선생님',
    words: ['봄나들이', '꽃구경길', '새싹보기', '봄바람맞'],
    tags: ['초등', '봄', '자연'],
  },
  {
    author: '여름선생님',
    words: ['수영하기', '물놀이장', '부채사용', '여름방학'],
    tags: ['초등', '여름', '활동'],
  },
  {
    author: '겨울선생님',
    words: ['눈사람길', '썰매타기', '겨울놀이', '동계운동'],
    tags: ['초등', '겨울', '놀이'],
  },
  {
    author: '보건선생님',
    words: ['손소독제', '마스크착', '체온측정', '건강검진'],
    tags: ['초등', '보건', '건강'],
  },
  {
    author: '보안선생님',
    words: ['비상구찾', '대피훈련', '소화기위', '안전교육'],
    tags: ['초등', '안전', '대피'],
  },
  {
    author: '영양선생님',
    words: ['골고루먹', '영양섭취', '식사예절', '건강식품'],
    tags: ['초등', '영양', '식사'],
  },
]

// Firebase에 데이터 입력하는 함수
async function seedQuizData() {
  try {
    const quizzesCollection = collection(db, 'wordquiz1')
    
    for (const quiz of quizData) {
      const quizDoc = {
        ...quiz,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await addDoc(quizzesCollection, quizDoc)
      console.log(`Added quiz by ${quiz.author}`)
    }
    
    console.log('All quiz data has been seeded successfully!')
  } catch (error) {
    console.error('Error seeding quiz data:', error)
  }
}

// 실행
seedQuizData() 
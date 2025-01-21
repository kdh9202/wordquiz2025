import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Navigation from '../components/Navigation'
import { decomposeHangulWord } from '../lib/hangul.jsx'

export default function WordQuiz3() {
  // 기본 상태 관리
  const [words, setWords] = useState('')
  const [quizWords, setQuizWords] = useState([])
  const [currentCards, setCurrentCards] = useState([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState('')
  const [savedQuizzes, setSavedQuizzes] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [originalQuizzes, setOriginalQuizzes] = useState([])
  const [showSavedList, setShowSavedList] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    showCancel: false,
    onConfirm: () => {},
    confirmText: '확인'
  })

  // 카드 색상 배열
  const cardColors = [
    'bg-red-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-indigo-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-orange-400',
    'bg-teal-400',
    'bg-cyan-400'
  ]

  // 문자 배열을 섞는 함수
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 현재 문제의 카드 생성 (자음/모음 분리 로직 적용)
  const makeCurrentQuiz = (word) => {
    const jamoArray = decomposeHangulWord(word)
    const cards = jamoArray.map((char, i) => ({
      id: i,
      char,
      color: cardColors[Math.floor(Math.random() * cardColors.length)]
    }))
    setCurrentCards(shuffleArray(cards))
    setShowAnswer(false)
  }

  // 저장된 퀴즈 목록 불러오기
  useEffect(() => {
    fetchSavedQuizzes()
  }, [])

  const fetchSavedQuizzes = async () => {
    try {
      const quizzesCollection = collection(db, 'wordquiz3')
      const q = query(quizzesCollection, orderBy('createdAt', 'desc'), limit(20))
      const quizzesSnapshot = await getDocs(q)
      const quizzesList = quizzesSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(quiz => quiz.words && Array.isArray(quiz.words) && quiz.words.length > 0)
      setSavedQuizzes(quizzesList)
      setOriginalQuizzes(quizzesList)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  // 모달 관련 함수
  const openModal = (config) => {
    setModal({ ...modal, isOpen: true, ...config })
  }

  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false,
      showCancel: false,
      onConfirm: () => {}
    })
  }

  // 단어 저장
  const saveWords = async () => {
    if (!words.trim()) {
      openModal({
        title: '알림',
        message: '저장할 단어를 입력해주세요.'
      })
      return
    }

    if (!author.trim()) {
      openModal({
        title: '알림',
        message: '작성자를 입력해주세요.'
      })
      return
    }

    const wordList = words
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0)

    if (wordList.length === 0) {
      openModal({
        title: '알림',
        message: '저장할 단어를 입력해주세요.'
      })
      return
    }

    try {
      const tagList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      await addDoc(collection(db, 'wordquiz3'), {
        words: wordList,
        author: author.trim(),
        tags: tagList,
        createdAt: new Date().toISOString()
      })

      openModal({
        title: '알림',
        message: '성공적으로 저장되었습니다.',
        onConfirm: closeModal
      })

      fetchSavedQuizzes()
    } catch (error) {
      console.error('Error saving quiz:', error)
      openModal({
        title: '오류',
        message: '저장 중 오류가 발생했습니다.'
      })
    }
  }

  // 저장된 퀴즈 선택
  const handleQuizSelect = (quiz) => {
    setWords(quiz.words.join(', '))
    setAuthor(quiz.author || '')
    setTags(quiz.tags?.join(', ') || '')
  }

  // 검색 처리
  const handleSearchKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const keyword = searchKeyword.toLowerCase().trim()
      const filtered = originalQuizzes.filter(quiz => {
        const searchTarget = [
          ...quiz.words,
          quiz.author,
          ...(quiz.tags || [])
        ].join(' ').toLowerCase()
        return searchTarget.includes(keyword)
      })
      setSavedQuizzes(filtered)
    }
  }

  // 퀴즈 생성하기
  const createQuiz = () => {
    // 문장 처리: 쉼표로 구분하고 각 문장의 앞뒤 공백 제거
    const wordList = words
      .split(',')
      .map(word => word.trim())
      .filter(word => {
        if (!word) return false
        if (word.length < 2) return false
        if (/[.,]$/.test(word)) return false
        return true
      })

    if (wordList.length === 0) {
      openModal({
        title: '입력 오류',
        message: '단어를 입력해주세요!'
      })
      return
    }

    if (wordList.length < 2) {
      openModal({
        title: '입력 오류',
        message: '최소 2개 이상의 단어를 입력해주세요!'
      })
      return
    }
    
    setQuizWords(wordList)
    setCurrentQuizIndex(0)
    makeCurrentQuiz(wordList[0])
  }

  // 정답 확인
  const checkAnswer = () => {
    setShowAnswer(true)
  }

  // 퀴즈 종료 처리
  const handleQuit = () => {
    openModal({
      title: '퀴즈 종료',
      message: '퀴즈를 종료하시겠습니까?',
      showCancel: true,
      confirmText: '종료',
      onConfirm: () => {
        setQuizWords([])
        closeModal()
      }
    })
  }

  // 다음 문제로 이동
  const handleNext = () => {
    if (currentQuizIndex < quizWords.length - 1) {
      setCurrentQuizIndex(prev => prev + 1)
      makeCurrentQuiz(quizWords[currentQuizIndex + 1])
    }
  }

  return (
    <>
      <Navigation />
      <div className="fixed inset-0 bg-white overflow-hidden pt-14">
        <div className="h-full flex flex-col p-8">
          {quizWords.length === 0 ? (
            <>
              <h1 className="text-2xl font-bold text-gray-700 mb-2 flex-none text-center">자음 모음 조합 퀴즈</h1>
              <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 flex-none">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">입력 가이드</h2>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm">자음과 모음을 조합하여 단어를 완성하는 게임입니다.</p>
                    </div>
                    <div className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm">문제에 사용될 단어를 쉼표로 구분하여 입력하세요.</p>
                    </div>
                    <div className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm">맨 끝에 쉼표(,)나 마침표(.) 찍지 않기</p>
                    </div>
                    <div className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm">입력이 완료되면 [시작] 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-6 flex-none">
                  <div className="col-span-9">
                    <textarea
                      value={words}
                      onChange={(e) => setWords(e.target.value)}
                      className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 resize-none shadow-sm"
                      placeholder="예시) 늑대, 선생님, 희망, 간식 등"
                    />
                  </div>
                  <div className="col-span-3 flex flex-col gap-4">
                    <Button
                      onClick={() => setShowSavedList(prev => !prev)}
                      variant="secondary"
                      className="w-full h-14 text-lg font-bold"
                    >
                      {showSavedList ? '닫기' : '불러오기'}
                    </Button>
                    <Button
                      onClick={createQuiz}
                      variant="primary"
                      className="w-full flex-1 text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-200"
                    >
                      시작
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-8 flex-none">
                  <div className="col-span-4">
                    <div className="h-11">
                      <Input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="이름 입력"
                        className="h-full px-4 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="h-11">
                      <Input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="예시) 초등, 국어, 3학년"
                        className="h-full px-4 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-11">
                      <Button
                        onClick={saveWords}
                        variant="secondary"
                        className="w-full h-full text-sm"
                      >
                        저장
                      </Button>
                    </div>
                  </div>
                </div>

                {showSavedList && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[600px] flex flex-col">
                      <div className="bg-blue-600 px-4 py-3 rounded-t-xl flex items-center justify-between flex-none">
                        <span className="font-medium text-white">최근 저장 목록</span>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              value={searchKeyword}
                              onChange={(e) => setSearchKeyword(e.target.value)}
                              onKeyDown={handleSearchKeyDown}
                              className="px-3 py-1 pr-8 rounded-lg text-sm bg-white/90 w-48 focus:outline-none focus:ring-2 focus:ring-white"
                              placeholder="검색어 입력 후 엔터"
                            />
                            {searchKeyword && savedQuizzes !== originalQuizzes && (
                              <Button
                                onClick={() => {
                                  setSearchKeyword('')
                                  setSavedQuizzes(originalQuizzes)
                                }}
                                variant="secondary"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 p-0 flex items-center justify-center rounded-full text-[10px] leading-none"
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                          <Button
                            onClick={() => setShowSavedList(false)}
                            variant="gray"
                            size="sm"
                            className="!px-2 !py-1"
                          >
                            닫기
                          </Button>
                        </div>
                      </div>
                      <div className="divide-y overflow-y-auto flex-1 p-2">
                        {savedQuizzes.map((quiz) => (
                          <div
                            key={quiz.id}
                            onClick={() => {
                              handleQuizSelect(quiz)
                              setShowSavedList(false)
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <div className="text-lg font-medium text-gray-900">
                                {quiz.words?.join(', ') || ''}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 gap-2">
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                  {quiz.author}
                                </span>
                                {quiz.tags && quiz.tags.length > 0 && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span>{quiz.tags.join(', ')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-700">자음 모음 조합 퀴즈</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {quizWords.map((_, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                            index === currentQuizIndex
                              ? 'bg-blue-500 text-white'
                              : index < currentQuizIndex
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < quizWords.length - 1 && (
                          <div className="w-8 h-0.5 bg-gray-200" />
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleQuit}
                    variant="secondary"
                    size="sm"
                    className="px-4"
                  >
                    종료
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-50 rounded-2xl p-12">
                  <div className="h-full grid grid-cols-6 gap-8 place-content-center">
                    {currentCards.map((card) => (
                      <div
                        key={card.id}
                        className={`w-28 h-28 ${card.color} rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-lg`}
                      >
                        {card.char}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-8">
                  <div className="flex-1 flex justify-center">
                    {showAnswer && (
                      <div className="flex gap-4">
                        {quizWords[currentQuizIndex].split('').map((char, index) => {
                          if (char === ' ') {
                            return <div key={index} className="w-8" />
                          }
                          return (
                            <div
                              key={index}
                              className={`w-16 h-16 ${cardColors[index % cardColors.length]} rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
                            >
                              {char}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex-none">
                    <Button
                      onClick={showAnswer ? (currentQuizIndex === quizWords.length - 1 ? handleQuit : handleNext) : checkAnswer}
                      variant="primary"
                      className={`px-8 py-3 text-lg font-bold bg-gradient-to-r ${
                        showAnswer 
                          ? currentQuizIndex === quizWords.length - 1
                            ? 'from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500'
                            : 'from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400'
                          : 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500'
                      }`}
                    >
                      {showAnswer 
                        ? currentQuizIndex === quizWords.length - 1
                          ? '종료'
                          : '다음 문제'
                        : '정답 확인'
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          showCancel={modal.showCancel}
          onConfirm={modal.onConfirm}
          confirmText={modal.confirmText}
        />
      </div>
    </>
  )
} 
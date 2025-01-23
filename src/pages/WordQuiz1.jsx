import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import QuizCard from '../components/quiz/QuizCard'
import ProgressSteps from '../components/quiz/ProgressSteps'
import Modal from '../components/common/Modal'
import Navigation from '../components/Navigation'

export default function WordQuiz1() {
  const [words, setWords] = useState('')
  const [quizWords, setQuizWords] = useState([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [hiddenChars, setHiddenChars] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [revealedAnswers, setRevealedAnswers] = useState([])
  const [showNext, setShowNext] = useState(false)
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState('')
  const [savedQuizzes, setSavedQuizzes] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [originalQuizzes, setOriginalQuizzes] = useState([])
  const [showSavedList, setShowSavedList] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    showCancel: false,
    onConfirm: () => {},
    confirmText: '확인'
  })

  // 저장된 퀴즈 목록 불러오기
  useEffect(() => {
    fetchSavedQuizzes()
  }, [])

  const fetchSavedQuizzes = async () => {
    try {
      const quizzesCollection = collection(db, 'wordquiz1')
      const q = query(quizzesCollection, orderBy('createdAt', 'desc'), limit(20))
      const quizzesSnapshot = await getDocs(q)
      const quizzesList = quizzesSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(quiz => quiz.words && Array.isArray(quiz.words) && quiz.words.length > 0)
      setSavedQuizzes(quizzesList)
      setOriginalQuizzes(quizzesList) // 원본 데이터 저장
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  // 검색 처리 함수
  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setSavedQuizzes(originalQuizzes)
      return
    }

    const filtered = originalQuizzes.filter(quiz => {
      const searchTarget = [
        quiz.author,
        quiz.words.join(' '),
        quiz.tags?.join(' ') || ''
      ].join(' ').toLowerCase()
      
      return searchTarget.includes(keyword.toLowerCase())
    })
    setSavedQuizzes(filtered)
  }

  // 검색어 입력 처리
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchKeyword)
    }
  }

  // 저장된 퀴즈 선택 시 데이터 로드
  const handleQuizSelect = (quiz) => {
    setWords(quiz.words?.join(', ') || '')
    setAuthor(quiz.author || '')
    setTags(quiz.tags?.join(', ') || '')
  }

  // 모달 열기 함수
  const openModal = (config) => {
    setModal({ ...modal, isOpen: true, ...config })
  }

  // 모달 닫기 함수
  const closeModal = () => {
    setModal({ ...modal, isOpen: false })
  }

  // 단어 목록 저장하기
  const saveWords = async () => {
    try {
      // 입력값 검증
      if (!words.trim()) {
        openModal({
          title: '입력 오류',
          message: '저장할 단어를 입력해주세요!'
        })
        return
      }

      if (!author.trim()) {
        openModal({
          title: '입력 오류',
          message: '작성자 이름을 입력해주세요!'
        })
        return
      }

      // 단어 목록을 배열로 변환
      const wordList = words
        .split(',')
        .map(word => word.trim())
        .filter(word => word.length > 0)

      if (wordList.length === 0) {
        openModal({
          title: '입력 오류',
          message: '저장할 단어가 없습니다!'
        })
        return
      }

      // 태그 목록을 배열로 변환
      const tagList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Firestore에 저장할 데이터 구성
      const wordsData = {
        words: wordList,
        author: author.trim(),
        tags: tagList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const wordsCollection = collection(db, 'wordquiz1')
      await addDoc(wordsCollection, wordsData)

      // 저장 성공 후 입력 필드 초기화
      setWords('')
      setAuthor('')
      setTags('')
      
      openModal({
        title: '저장 완료',
        message: '단어 목록이 저장되었습니다!'
      })
      
      // 목록 새로고침
      await fetchSavedQuizzes()
    } catch (error) {
      console.error('Error saving words:', error)
      openModal({
        title: '오류 발생',
        message: '저장 중 오류가 발생했습니다.'
      })
    }
  }

  // 퀴즈 생성하기
  const createQuiz = () => {
    const wordList = words.replace(/(\s*)/g, '').split(',').filter(word => word)
    if (wordList.length === 0) {
      openModal({
        title: '입력 오류',
        message: '단어를 입력해주세요!',
        onConfirm: closeModal
      })
      return
    }
    
    setQuizWords(wordList)
    setCurrentQuizIndex(0)
    makeCurrentQuiz(wordList[0])
  }

  // 현재 단어의 퀴즈 만들기
  const makeCurrentQuiz = (word) => {
    const chars = word.split('')
    const numHidden = chars.length <= 3 ? 1 : 2
    const hiddenIndices = []
    
    // 숨길 글자 위치 선택
    while (hiddenIndices.length < numHidden) {
      const idx = Math.floor(Math.random() * chars.length)
      if (!hiddenIndices.includes(idx)) {
        hiddenIndices.push(idx)
      }
    }

    // 선택지 카드 생성 (15개)
    const cardChars = []
    const hiddenCharsArray = hiddenIndices.map(idx => chars[idx])
    cardChars.push(...hiddenCharsArray)

    // 나머지 랜덤 글자 추가
    const randomChars = '아족요지묘도카눈감몽머종공튀묵즈치딱필진게받술분샌지감수스족민공름도치쓰위레카랑동'.split('')
    while (cardChars.length < 15) {
      const randomChar = randomChars[Math.floor(Math.random() * randomChars.length)]
      if (!cardChars.includes(randomChar) && !chars.includes(randomChar)) {
        cardChars.push(randomChar)
      }
    }

    // 카드 섞기
    const shuffledCards = cardChars.sort(() => Math.random() - 0.5)

    setHiddenChars({
      word: chars,
      hiddenIndices,
      cards: shuffledCards
    })
    setSelectedCards([])
    setRevealedAnswers([])
    setShowNext(false)
  }

  // 다음 문제로 이동
  const nextQuiz = () => {
    if (currentQuizIndex < quizWords.length - 1) {
      setCurrentQuizIndex(prev => prev + 1)
      makeCurrentQuiz(quizWords[currentQuizIndex + 1])
    } else {
      openModal({
        title: '퀴즈 완료',
        message: '모든 문제를 풀었습니다!',
        onConfirm: () => {
          setQuizWords([])
          closeModal()
        }
      })
    }
  }

  // 카드 선택 처리
  const handleCardClick = (char, index) => {
    if (selectedCards.includes(index) || isAnimating) return

    setIsAnimating(true)
    const newSelectedCards = [...selectedCards, index]
    setSelectedCards(newSelectedCards)

    const currentWord = hiddenChars.word
    const hiddenIndices = hiddenChars.hiddenIndices
    const hiddenOriginalChars = hiddenIndices.map(idx => currentWord[idx])

    if (hiddenOriginalChars.includes(char)) {
      const answerIndex = hiddenIndices[hiddenOriginalChars.indexOf(char)]
      setRevealedAnswers(prev => [...prev, answerIndex])
      
      if (newSelectedCards.length === hiddenIndices.length) {
        // 애니메이션이 끝난 후에 다음 문제 버튼 표시
        setTimeout(() => {
          setShowNext(true)
          setIsAnimating(false)
        }, 500)  // 카드 뒤집기 애니메이션 시간과 동일하게 설정
      } else {
        setTimeout(() => {
          setIsAnimating(false)
        }, 500)
      }
    } else {
      // 오답 카드 처리
      setTimeout(() => {
        setSelectedCards(prev => prev.filter(i => i !== index))
        setIsAnimating(false)
      }, 800)
    }
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
        setCurrentQuizIndex(0)
        setHiddenChars([])
        setSelectedCards([])
        setRevealedAnswers([])
        setShowNext(false)
        closeModal()
      }
    })
  }

  return (
    <>
      <Navigation />
      <div className="fixed inset-0 bg-white overflow-hidden pt-14">
        <div className="h-full flex flex-col p-8">
          {quizWords.length === 0 ? (
            <>
              <h1 className="text-2xl font-bold text-gray-700 mb-2 flex-none text-center">낱말 완성 퀴즈</h1>
              <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 flex-none">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">입력 가이드</h2>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm">문제에 사용될 글자를 쉼표로 구분하여 입력하세요.</p>
                    </div>
                    <div className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm">맨 끝에 쉼표(,)나 마침표(.) 찍지 않기. 3~5글자 낱말 권장</p>
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
                      placeholder="예시) 초등학교, 수학시간, 카멜레온, 수학여행 등"
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
                      className="w-full flex-1 text-xl font-bold transform hover:scale-105"
                    >
                      시작
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-8 flex-none">
                  <div className="col-span-4">
                    <Input
                      label="작성자"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="이름 입력"
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      label="검색어 (쉼표로 구분)"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="예시) 초등, 수학, 3학년"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col justify-end">
                    <div className="h-11">
                      <Button
                        onClick={saveWords}
                        variant="secondary"
                        className="w-full h-full"
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
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-700">낱말 완성 퀴즈</h1>
                <div className="flex items-center gap-4">
                  <ProgressSteps
                    total={quizWords.length}
                    current={currentQuizIndex}
                  />
                  <Button
                    onClick={handleQuit}
                    variant="gray"
                    size="sm"
                  >
                    나가기
                  </Button>
                </div>
              </div>

              <div className="flex flex-col justify-between h-[calc(100vh-180px)]">
                <div className="flex justify-center items-center">
                  <div className="flex gap-6">
                    {hiddenChars.word?.map((char, index) => (
                      <QuizCard
                        key={index}
                        char={char}
                        isHidden={hiddenChars.hiddenIndices.includes(index)}
                        isRevealed={revealedAnswers.includes(index)}
                        isAnswerCard={hiddenChars.hiddenIndices.includes(index)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 max-w-5xl mx-auto w-full">
                  {hiddenChars.cards?.map((char, index) => (
                    <QuizCard
                      key={index}
                      char={char}
                      isHidden={true}
                      isRevealed={selectedCards.includes(index)}
                      onClick={() => !selectedCards.includes(index) && handleCardClick(char, index)}
                      index={index}
                      isAnswerCard={false}
                    />
                  ))}
                </div>

                <div className="h-14 text-center">
                  {showNext && (
                    <Button
                      onClick={nextQuiz}
                      variant="gray"
                      size="lg"
                    >
                      {currentQuizIndex < quizWords.length - 1 ? '다음 문제' : '나가기'}
                    </Button>
                  )}
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
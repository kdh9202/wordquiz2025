import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'

export default function Home() {
  const quizzes = [
    {
      path: '/wordquiz1',
      title: '낱말 완성 퀴즈',
      description: '빈 칸에 알맞은 글자를 선택하여 낱말을 완성하는 퀴즈입니다.',
      color: 'from-blue-500 to-indigo-500',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    {
      path: '/wordquiz2',
      title: '문장 완성 퀴즈',
      description: '무작위로 섞인 글자들을 순서대로 배열하여 문장을 완성하는 퀴즈입니다.',
      color: 'from-green-500 to-teal-500',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      path: '/wordquiz3',
      title: '자음 모음 조합 퀴즈',
      description: '자음과 모음을 조합하여 단어를 완성하는 퀴즈입니다.',
      color: 'from-purple-500 to-pink-500',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    }
  ]

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-14 flex items-center">
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                한글 학습 퀴즈
              </h1>
              <p className="text-lg text-gray-600">
                다양한 방식으로 한글을 학습할 수 있는 퀴즈 모음입니다.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quizzes.map(quiz => (
                  <Link
                    key={quiz.path}
                    to={quiz.path}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-200 group-hover:scale-105">
                      <div className={`bg-gradient-to-r ${quiz.color} p-6 flex justify-center items-center text-white`}>
                        {quiz.icon}
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {quiz.title}
                        </h2>
                        <p className="text-gray-600">
                          {quiz.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  사용 방법
                </h2>
                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-blue-600 mb-4">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="font-bold mb-2">1. 문제 입력</h3>
                    <p className="text-sm text-gray-600">원하는 단어나 문장을 입력하고 시작 버튼을 클릭하세요.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-blue-600 mb-4">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold mb-2">2. 퀴즈 풀기</h3>
                    <p className="text-sm text-gray-600">제시된 카드를 보고 정답을 맞혀보세요.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-blue-600 mb-4">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold mb-2">3. 저장하기</h3>
                    <p className="text-sm text-gray-600">자주 사용하는 문제는 저장하여 다음에도 사용할 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
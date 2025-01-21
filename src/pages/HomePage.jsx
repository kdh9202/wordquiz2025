import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">단어 퀴즈</h1>
        <p className="text-lg mb-8">
          영어 단어를 학습하고 실력을 테스트해보세요!
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/wordquiz1')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium"
          >
            낱말 완성 퀴즈
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg font-medium"
          >
            단어 관리
          </button>
        </div>
      </div>
    </div>
  )
} 
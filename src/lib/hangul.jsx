// 한글 자모음 정의
const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]

const JUNGSUNG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
]

const JONGSUNG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]

// 한글 여부 확인
const isHangul = (char) => {
  const code = char.charCodeAt(0)
  return 0xAC00 <= code && code <= 0xD7A3
}

// 한글 문자를 자모음으로 분리
const decomposeHangul = (char) => {
  const code = char.charCodeAt(0)
  
  if (!isHangul(char)) {
    return [char]
  }

  const offset = code - 0xAC00
  const jong = offset % 28
  const jung = ((offset - jong) / 28) % 21
  const cho = (((offset - jong) / 28) - jung) / 21

  return [
    CHOSUNG[cho],
    JUNGSUNG[jung],
    jong !== 0 ? JONGSUNG[jong] : null
  ].filter(Boolean)
}

// 단어를 자모음으로 분리
const decomposeHangulWord = (word) => {
  return word
    .split('')
    .filter(char => char !== ' ')
    .flatMap(decomposeHangul)
}

// 자모음을 한글로 조합
const composeHangul = (cho, jung, jong = '') => {
  const choIndex = CHOSUNG.indexOf(cho)
  const jungIndex = JUNGSUNG.indexOf(jung)
  const jongIndex = jong ? JONGSUNG.indexOf(jong) : 0

  if (choIndex === -1 || jungIndex === -1 || jongIndex === -1) {
    return null
  }

  const code = 0xAC00 + (choIndex * 21 + jungIndex) * 28 + jongIndex
  return String.fromCharCode(code)
}

export { decomposeHangulWord, composeHangul } 
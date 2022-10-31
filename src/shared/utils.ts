export const normalizeText = (text: string) => {
  return text.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, '')
}

export const getBestMatchIndex = (text: string, keyword: string) => {
  const normalizedText = normalizeText(text)
  const words = normalizedText.split(' ')

  const bestMatchInText = normalizedText.indexOf(keyword)

  const bestMatchInWord = words
    .map(word => word.indexOf(keyword))
    .filter(indexOf => indexOf > -1)
    .reduce((accumulator , indexOf) => (accumulator === -1 || accumulator > indexOf ? indexOf : accumulator), -1)

  return bestMatchInText === -1
    ? bestMatchInWord
    : bestMatchInWord === -1
      ? bestMatchInText
      : Math.min(bestMatchInText, bestMatchInWord)
}

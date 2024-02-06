function fetchSynonym() {
  const cache = new Map()

  return async (word: string) => {
    const cleanWord = word.trim()
    if (cache.has(cleanWord)) {
      return cache.get(word)
    } else {
      try {
        const res = await fetch(
          `https://api.datamuse.com/words?ml=${cleanWord}`
        )
        const data = await res.json()
        cache.set(cleanWord, data)
        return data
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export const getData = fetchSynonym()

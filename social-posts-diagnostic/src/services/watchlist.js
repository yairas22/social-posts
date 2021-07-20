class Watchlist {
  constructor (watchlistWords) {
    this.watchlistWords = watchlistWords.split('|')
  }

  foundProblematicWord ({ title, summary, body }) {
    return this.watchlistWords.some(
      watchWord =>
        title.toLowerCase().includes(watchWord.toLowerCase()) ||
        summary.toLowerCase().includes(watchWord.toLowerCase()) ||
        body.toLowerCase().includes(watchWord.toLowerCase())
    )
  }
}

module.exports = Watchlist

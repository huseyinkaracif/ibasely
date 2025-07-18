import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Copy, BarChart3, Clock, BookOpen, Hash, Type } from 'lucide-react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import './TextAnalyzer.css'

const TextAnalyzer = () => {
  const [text, setText] = useState('')
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1, position: 0 })
  const textareaRef = useRef(null)

  // Cursor pozisyonunu güncelle
  const updateCursorPosition = () => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const textBeforeCursor = text.substring(0, start)
    const lines = textBeforeCursor.split('\n')
    
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
      position: start
    })
  }

  // Gelişmiş metin analizi
  const analysis = useMemo(() => {
    if (!text) return null

    // Temel sayımlar
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text.split('\n').length
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
    const bytes = new Blob([text]).size

    // Kelime analizi
    const wordList = text.toLowerCase().replace(/[^\w\sğüşıöçĞÜŞIÖÇ]/g, '').split(/\s+/).filter(w => w)
    const wordFrequency = {}
    const wordLengths = []
    
    wordList.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
      wordLengths.push(word.length)
    })

    const uniqueWords = Object.keys(wordFrequency).length
    const mostCommonWords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // Karakter analizi
    const charFrequency = {}
    const letters = text.toLowerCase().replace(/[^a-zğüşıöçA-ZĞÜŞIÖÇ]/g, '')
    
    for (let char of letters) {
      charFrequency[char] = (charFrequency[char] || 0) + 1
    }

    const mostCommonChars = Object.entries(charFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // Sesli/Sessiz harf analizi
    const vowels = 'aeiouâîûAEIOUÂÎÛaeıioöuüAEIİOÖUÜ'
    const vowelCount = text.split('').filter(char => vowels.includes(char)).length
    const consonantCount = letters.length - vowelCount

    // Kelime uzunluk istatistikleri
    const avgWordLength = wordLengths.length ? (wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length).toFixed(1) : 0
    const longestWord = wordList.reduce((longest, current) => current.length > longest.length ? current : longest, '')
    const shortestWord = wordList.reduce((shortest, current) => current.length < shortest.length ? current : shortest, wordList[0] || '')

    // Okuma süresi (ortalama 200 kelime/dakika)
    const readingTime = Math.ceil(words / 200)

    // Zorluk seviyesi (Flesch Reading Ease benzeri basitleştirilmiş)
    const avgSentenceLength = sentences ? words / sentences : 0
    const avgSyllablesPerWord = avgWordLength * 0.6 // Tahmini
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    
    let difficulty = 'Çok Kolay'
    if (fleschScore < 30) difficulty = 'Çok Zor'
    else if (fleschScore < 50) difficulty = 'Zor'
    else if (fleschScore < 60) difficulty = 'Orta'
    else if (fleschScore < 70) difficulty = 'Kolay'

    return {
      basic: {
        characters,
        charactersNoSpaces,
        words,
        lines,
        sentences,
        paragraphs,
        bytes,
        uniqueWords
      },
      wordAnalysis: {
        wordFrequency: mostCommonWords,
        avgWordLength,
        longestWord,
        shortestWord
      },
      charAnalysis: {
        charFrequency: mostCommonChars,
        vowelCount,
        consonantCount,
        vowelPercentage: letters.length ? ((vowelCount / letters.length) * 100).toFixed(1) : 0
      },
      readability: {
        readingTime,
        difficulty,
        fleschScore: Math.max(0, Math.min(100, fleschScore)).toFixed(1)
      }
    }
  }, [text])

  // Sonuçları kopyala
  const copyResults = () => {
    if (!analysis) return

    const results = `
METIN ANALİZ RAPORU
===================

TEMEL İSTATİSTİKLER:
• Karakter: ${analysis.basic.characters}
• Karakter (boşluksuz): ${analysis.basic.charactersNoSpaces}
• Kelime: ${analysis.basic.words}
• Benzersiz kelime: ${analysis.basic.uniqueWords}
• Satır: ${analysis.basic.lines}
• Cümle: ${analysis.basic.sentences}
• Paragraf: ${analysis.basic.paragraphs}
• Byte: ${analysis.basic.bytes}

OKUMA ANALİZİ:
• Tahmini okuma süresi: ${analysis.readability.readingTime} dakika
• Zorluk seviyesi: ${analysis.readability.difficulty}
• Okunabilirlik puanı: ${analysis.readability.fleschScore}/100

KELIME ANALİZİ:
• Ortalama kelime uzunluğu: ${analysis.wordAnalysis.avgWordLength} karakter
• En uzun kelime: ${analysis.wordAnalysis.longestWord}
• En kısa kelime: ${analysis.wordAnalysis.shortestWord}

EN SIK KULLANILAN KELİMELER:
${analysis.wordAnalysis.wordFrequency.map(([word, count]) => `• ${word}: ${count}`).join('\n')}

KARAKTER ANALİZİ:
• Sesli harf: ${analysis.charAnalysis.vowelCount} (%${analysis.charAnalysis.vowelPercentage})
• Sessiz harf: ${analysis.charAnalysis.consonantCount}

EN SIK KULLANILAN KARAKTERLER:
${analysis.charAnalysis.charFrequency.map(([char, count]) => `• ${char}: ${count}`).join('\n')}
    `.trim()

    navigator.clipboard.writeText(results).then(() => {
      toast.success('Analiz sonuçları kopyalandı!')
    })
  }

  // JSON olarak export
  const exportJSON = () => {
    if (!analysis) return

    const exportData = {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
      analysis
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    saveAs(blob, 'metin-analizi.json')
    toast.success('Analiz JSON olarak indirildi!')
  }

  // CSV olarak export
  const exportCSV = () => {
    if (!analysis) return

    const csvData = [
      ['Metrik', 'Değer'],
      ['Karakter Sayısı', analysis.basic.characters],
      ['Karakter (Boşluksuz)', analysis.basic.charactersNoSpaces],
      ['Kelime Sayısı', analysis.basic.words],
      ['Benzersiz Kelime', analysis.basic.uniqueWords],
      ['Satır Sayısı', analysis.basic.lines],
      ['Cümle Sayısı', analysis.basic.sentences],
      ['Paragraf Sayısı', analysis.basic.paragraphs],
      ['Byte Boyutu', analysis.basic.bytes],
      ['Okuma Süresi (dk)', analysis.readability.readingTime],
      ['Zorluk Seviyesi', analysis.readability.difficulty],
      ['Okunabilirlik Puanı', analysis.readability.fleschScore],
      ['Ortalama Kelime Uzunluğu', analysis.wordAnalysis.avgWordLength],
      ['Sesli Harf Sayısı', analysis.charAnalysis.vowelCount],
      ['Sessiz Harf Sayısı', analysis.charAnalysis.consonantCount],
      ['Sesli Harf Oranı (%)', analysis.charAnalysis.vowelPercentage]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'metin-analizi.csv')
    toast.success('Analiz CSV olarak indirildi!')
  }

  return (
    <motion.div 
      className="text-analyzer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="analyzer-header">
        <h2>📝 Gelişmiş Metin Analizcisi</h2>
        <p>Metninizi analiz edin ve detaylı istatistikler alın</p>
      </div>

      <div className="analyzer-content">
        {/* Metin Giriş Alanı */}
        <div className="text-input-section">
          <div className="input-header">
            <h3>
              <FileText />
              Metin Girişi
            </h3>
            <div className="cursor-info">
              <span>Satır: {cursorPosition.line}</span>
              <span>Sütun: {cursorPosition.column}</span>
              <span>Pozisyon: {cursorPosition.position}</span>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onSelect={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            placeholder="Analiz etmek istediğiniz metni buraya yazın veya yapıştırın..."
            rows={12}
          />
          
          {text && (
            <div className="quick-stats">
              <span>{text.length} karakter</span>
              <span>{text.trim() ? text.trim().split(/\s+/).length : 0} kelime</span>
              <span>{text.split('\n').length} satır</span>
            </div>
          )}
        </div>

        {/* Analiz Sonuçları */}
        <AnimatePresence>
          {analysis && (
            <motion.div 
              className="analysis-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Export Butonları */}
              <div className="export-buttons">
                <button onClick={copyResults} className="copy-btn">
                  <Copy />
                  Sonuçları Kopyala
                </button>
                <button onClick={exportJSON} className="export-btn">
                  <Download />
                  JSON İndir
                </button>
                <button onClick={exportCSV} className="export-btn">
                  <Download />
                  CSV İndir
                </button>
              </div>

              {/* Temel İstatistikler */}
              <div className="stats-grid">
                <div className="stats-card basic">
                  <h4>
                    <Hash />
                    Temel İstatistikler
                  </h4>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span>Toplam Karakter</span>
                      <strong>{analysis.basic.characters.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Karakter (Boşluksuz)</span>
                      <strong>{analysis.basic.charactersNoSpaces.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Kelime Sayısı</span>
                      <strong>{analysis.basic.words.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Benzersiz Kelime</span>
                      <strong>{analysis.basic.uniqueWords.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Satır Sayısı</span>
                      <strong>{analysis.basic.lines.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Cümle Sayısı</span>
                      <strong>{analysis.basic.sentences.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Paragraf Sayısı</span>
                      <strong>{analysis.basic.paragraphs.toLocaleString()}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Dosya Boyutu</span>
                      <strong>{analysis.basic.bytes.toLocaleString()} byte</strong>
                    </div>
                  </div>
                </div>

                {/* Okunabilirlik */}
                <div className="stats-card readability">
                  <h4>
                    <Clock />
                    Okunabilirlik
                  </h4>
                  <div className="stats-list">
                    <div className="stat-item highlight">
                      <span>Tahmini Okuma Süresi</span>
                      <strong>{analysis.readability.readingTime} dakika</strong>
                    </div>
                    <div className="stat-item">
                      <span>Zorluk Seviyesi</span>
                      <strong className={`difficulty-${analysis.readability.difficulty.toLowerCase().replace(/\s/g, '-')}`}>
                        {analysis.readability.difficulty}
                      </strong>
                    </div>
                    <div className="stat-item">
                      <span>Okunabilirlik Puanı</span>
                      <strong>{analysis.readability.fleschScore}/100</strong>
                    </div>
                  </div>
                </div>

                {/* Kelime Analizi */}
                <div className="stats-card words">
                  <h4>
                    <BookOpen />
                    Kelime Analizi
                  </h4>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span>Ortalama Kelime Uzunluğu</span>
                      <strong>{analysis.wordAnalysis.avgWordLength} karakter</strong>
                    </div>
                    <div className="stat-item">
                      <span>En Uzun Kelime</span>
                      <strong>"{analysis.wordAnalysis.longestWord}"</strong>
                    </div>
                    <div className="stat-item">
                      <span>En Kısa Kelime</span>
                      <strong>"{analysis.wordAnalysis.shortestWord}"</strong>
                    </div>
                  </div>
                  
                  <div className="frequency-list">
                    <h5>En Sık Kullanılan Kelimeler</h5>
                    {analysis.wordAnalysis.wordFrequency.map(([word, count], index) => (
                      <div key={word} className="frequency-item">
                        <span className="rank">#{index + 1}</span>
                        <span className="word">"{word}"</span>
                        <span className="count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Karakter Analizi */}
                <div className="stats-card characters">
                  <h4>
                    <Type />
                    Karakter Analizi
                  </h4>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span>Sesli Harf</span>
                      <strong>
                        {analysis.charAnalysis.vowelCount} 
                        <small>(%{analysis.charAnalysis.vowelPercentage})</small>
                      </strong>
                    </div>
                    <div className="stat-item">
                      <span>Sessiz Harf</span>
                      <strong>{analysis.charAnalysis.consonantCount}</strong>
                    </div>
                  </div>
                  
                  <div className="frequency-list">
                    <h5>En Sık Kullanılan Karakterler</h5>
                    {analysis.charAnalysis.charFrequency.map(([char, count], index) => (
                      <div key={char} className="frequency-item">
                        <span className="rank">#{index + 1}</span>
                        <span className="char">"{char}"</span>
                        <span className="count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Görsel Özet */}
              <div className="visual-summary">
                <h4>
                  <BarChart3 />
                  Görsel Özet
                </h4>
                <div className="summary-bars">
                  <div className="bar-item">
                    <span>Sesli Harfler</span>
                    <div className="bar">
                      <div 
                        className="bar-fill vowels" 
                        style={{ width: `${analysis.charAnalysis.vowelPercentage}%` }}
                      ></div>
                    </div>
                    <span>{analysis.charAnalysis.vowelPercentage}%</span>
                  </div>
                  <div className="bar-item">
                    <span>Sessiz Harfler</span>
                    <div className="bar">
                      <div 
                        className="bar-fill consonants" 
                        style={{ width: `${100 - analysis.charAnalysis.vowelPercentage}%` }}
                      ></div>
                    </div>
                    <span>{(100 - analysis.charAnalysis.vowelPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="bar-item">
                    <span>Kelime Çeşitliliği</span>
                    <div className="bar">
                      <div 
                        className="bar-fill diversity" 
                        style={{ width: `${Math.min(100, (analysis.basic.uniqueWords / analysis.basic.words) * 100)}%` }}
                      ></div>
                    </div>
                    <span>{((analysis.basic.uniqueWords / analysis.basic.words) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kullanım İpuçları */}
      <div className="tips-section">
        <h4>💡 İpuçları</h4>
        <ul>
          <li>Metin alanında yazarken anlık istatistikler güncellenir</li>
          <li>Cursor pozisyonunu görmek için metin alanına tıklayın</li>
          <li>Analiz sonuçlarını kopyalayabilir veya dosya olarak indirebilirsiniz</li>
          <li>Okunabilirlik puanı 70+ ise metin kolay okunur demektir</li>
          <li>Kelime çeşitliliği %50+ ise metin zengin sayılır</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default TextAnalyzer 
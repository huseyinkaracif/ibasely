import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, Download, Copy, BarChart3, Eye, List, FileText, ArrowLeftRight } from 'lucide-react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import './TextDifference.css'

const TextDifference = () => {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [viewMode, setViewMode] = useState('side-by-side') // 'side-by-side', 'unified', 'split'
  const [diffMode, setDiffMode] = useState('line') // 'line', 'word', 'char'

  // Diff hesaplama algoritması
  const calculateDiff = useMemo(() => {
    if (!oldText && !newText) return null

    // Satır bazında diff
    const calculateLineDiff = () => {
      const oldLines = oldText.split('\n')
      const newLines = newText.split('\n')
      const result = []

      let oldIndex = 0
      let newIndex = 0

      while (oldIndex < oldLines.length || newIndex < newLines.length) {
        const oldLine = oldLines[oldIndex]
        const newLine = newLines[newIndex]

        if (oldIndex >= oldLines.length) {
          // Sadece yeni satırlar kaldı
          result.push({
            type: 'added',
            content: newLine,
            oldLine: null,
            newLine: newIndex + 1
          })
          newIndex++
        } else if (newIndex >= newLines.length) {
          // Sadece eski satırlar kaldı
          result.push({
            type: 'removed',
            content: oldLine,
            oldLine: oldIndex + 1,
            newLine: null
          })
          oldIndex++
        } else if (oldLine === newLine) {
          // Aynı satırlar
          result.push({
            type: 'unchanged',
            content: oldLine,
            oldLine: oldIndex + 1,
            newLine: newIndex + 1
          })
          oldIndex++
          newIndex++
        } else {
          // Farklı satırlar - basit algoritma
          const foundInNew = newLines.slice(newIndex + 1).indexOf(oldLine)
          const foundInOld = oldLines.slice(oldIndex + 1).indexOf(newLine)

          if (foundInNew !== -1 && (foundInOld === -1 || foundInNew < foundInOld)) {
            // Yeni satır eklendi
            result.push({
              type: 'added',
              content: newLine,
              oldLine: null,
              newLine: newIndex + 1
            })
            newIndex++
          } else if (foundInOld !== -1) {
            // Eski satır silindi
            result.push({
              type: 'removed',
              content: oldLine,
              oldLine: oldIndex + 1,
              newLine: null
            })
            oldIndex++
          } else {
            // Satır değiştirildi
            result.push({
              type: 'modified',
              oldContent: oldLine,
              newContent: newLine,
              oldLine: oldIndex + 1,
              newLine: newIndex + 1
            })
            oldIndex++
            newIndex++
          }
        }
      }

      return result
    }

    // Kelime bazında diff
    const calculateWordDiff = () => {
      const oldWords = oldText.split(/(\s+)/)
      const newWords = newText.split(/(\s+)/)
      const result = []

      let oldIndex = 0
      let newIndex = 0

      while (oldIndex < oldWords.length || newIndex < newWords.length) {
        const oldWord = oldWords[oldIndex]
        const newWord = newWords[newIndex]

        if (oldIndex >= oldWords.length) {
          result.push({ type: 'added', content: newWord })
          newIndex++
        } else if (newIndex >= newWords.length) {
          result.push({ type: 'removed', content: oldWord })
          oldIndex++
        } else if (oldWord === newWord) {
          result.push({ type: 'unchanged', content: oldWord })
          oldIndex++
          newIndex++
        } else {
          result.push({ type: 'removed', content: oldWord })
          result.push({ type: 'added', content: newWord })
          oldIndex++
          newIndex++
        }
      }

      return result
    }

    // Karakter bazında diff (basitleştirilmiş)
    const calculateCharDiff = () => {
      const result = []
      const maxLength = Math.max(oldText.length, newText.length)

      for (let i = 0; i < maxLength; i++) {
        const oldChar = oldText[i]
        const newChar = newText[i]

        if (oldChar === newChar) {
          result.push({ type: 'unchanged', content: oldChar || '' })
        } else if (!oldChar) {
          result.push({ type: 'added', content: newChar })
        } else if (!newChar) {
          result.push({ type: 'removed', content: oldChar })
        } else {
          result.push({ type: 'modified', oldContent: oldChar, newContent: newChar })
        }
      }

      return result
    }

    const diffResult = diffMode === 'line' ? calculateLineDiff() : 
                     diffMode === 'word' ? calculateWordDiff() : 
                     calculateCharDiff()

    // İstatistikleri hesapla
    const stats = {
      added: diffResult.filter(item => item.type === 'added').length,
      removed: diffResult.filter(item => item.type === 'removed').length,
      modified: diffResult.filter(item => item.type === 'modified').length,
      unchanged: diffResult.filter(item => item.type === 'unchanged').length,
      total: diffResult.length
    }

    return { diff: diffResult, stats }
  }, [oldText, newText, diffMode])

  // Diff export
  const exportDiff = (format) => {
    if (!calculateDiff) return

    let content = ''
    const timestamp = new Date().toISOString()

    if (format === 'unified') {
      content = `--- Eski Metin\t${timestamp}\n`
      content += `+++ Yeni Metin\t${timestamp}\n`
      
      calculateDiff.diff.forEach(item => {
        if (item.type === 'removed') {
          content += `- ${item.content}\n`
        } else if (item.type === 'added') {
          content += `+ ${item.content}\n`
        } else if (item.type === 'modified') {
          content += `- ${item.oldContent}\n`
          content += `+ ${item.newContent}\n`
        } else {
          content += `  ${item.content}\n`
        }
      })
    } else if (format === 'json') {
      content = JSON.stringify({
        timestamp,
        mode: diffMode,
        stats: calculateDiff.stats,
        diff: calculateDiff.diff
      }, null, 2)
    } else if (format === 'html') {
      content = generateHtmlReport()
    }

    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 
           format === 'html' ? 'text/html' : 'text/plain'
    })
    saveAs(blob, `metin-farki-${Date.now()}.${format === 'json' ? 'json' : format === 'html' ? 'html' : 'txt'}`)
    toast.success(`Diff ${format.toUpperCase()} olarak indirildi!`)
  }

  // HTML raporu oluştur
  const generateHtmlReport = () => {
    if (!calculateDiff) return ''

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Metin Farkı Raporu</title>
    <style>
        body { font-family: monospace; margin: 20px; }
        .added { background: #d4edda; color: #155724; }
        .removed { background: #f8d7da; color: #721c24; }
        .modified { background: #fff3cd; color: #856404; }
        .stats { margin-bottom: 20px; padding: 10px; background: #f8f9fa; }
    </style>
</head>
<body>
    <h1>Metin Farkı Raporu</h1>
    <div class="stats">
        <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        <p><strong>Mod:</strong> ${diffMode === 'line' ? 'Satır' : diffMode === 'word' ? 'Kelime' : 'Karakter'}</p>
        <p><strong>Eklenen:</strong> ${calculateDiff.stats.added}</p>
        <p><strong>Silinen:</strong> ${calculateDiff.stats.removed}</p>
        <p><strong>Değiştirilen:</strong> ${calculateDiff.stats.modified}</p>
    </div>
    <div class="diff">
        ${calculateDiff.diff.map(item => {
          if (item.type === 'added') return `<div class="added">+ ${item.content}</div>`
          if (item.type === 'removed') return `<div class="removed">- ${item.content}</div>`
          if (item.type === 'modified') return `<div class="modified">~ ${item.oldContent} → ${item.newContent}</div>`
          return `<div>${item.content}</div>`
        }).join('')}
    </div>
</body>
</html>`
  }

  // Diff sonuçlarını kopyala
  const copyDiff = () => {
    if (!calculateDiff) return

    const content = calculateDiff.diff.map(item => {
      if (item.type === 'removed') return `- ${item.content}`
      if (item.type === 'added') return `+ ${item.content}`
      if (item.type === 'modified') return `~ ${item.oldContent} → ${item.newContent}`
      return `  ${item.content}`
    }).join('\n')

    navigator.clipboard.writeText(content).then(() => {
      toast.success('Diff sonuçları kopyalandı!')
    })
  }

  return (
    <motion.div 
      className="text-difference"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* Kontroller */}
      <div className="controls-section">
        <div className="view-controls">
          <label>Görünüm Modu:</label>
          <div className="control-buttons">
            <button 
              className={viewMode === 'side-by-side' ? 'active' : ''}
              onClick={() => setViewMode('side-by-side')}
            >
              <ArrowLeftRight />
              Yan Yana
            </button>
            <button 
              className={viewMode === 'unified' ? 'active' : ''}
              onClick={() => setViewMode('unified')}
            >
              <List />
              Birleşik
            </button>
          </div>
        </div>

        <div className="diff-controls">
          <label>Karşılaştırma Modu:</label>
          <div className="control-buttons">
            <button 
              className={diffMode === 'line' ? 'active' : ''}
              onClick={() => setDiffMode('line')}
            >
              <FileText />
              Satır
            </button>
            <button 
              className={diffMode === 'word' ? 'active' : ''}
              onClick={() => setDiffMode('word')}
            >
              <Eye />
              Kelime
            </button>
            <button 
              className={diffMode === 'char' ? 'active' : ''}
              onClick={() => setDiffMode('char')}
            >
              Karakter
            </button>
          </div>
        </div>

        {calculateDiff && (
          <div className="export-controls">
            <button onClick={copyDiff} className="copy-btn">
              <Copy />
              Kopyala
            </button>
            <button onClick={() => exportDiff('unified')} className="export-btn">
              <Download />
              Unified
            </button>
            <button onClick={() => exportDiff('json')} className="export-btn">
              <Download />
              JSON
            </button>
            <button onClick={() => exportDiff('html')} className="export-btn">
              <Download />
              HTML
            </button>
          </div>
        )}
      </div>

      {/* Metin Giriş Alanları */}
      <div className={`input-section ${viewMode}`}>
        <div className="text-input-container">
          <div className="input-header">
            <h3>Eski Metin</h3>
            <span className="text-stats">
              {oldText.length} karakter, {oldText.split('\n').length} satır
            </span>
          </div>
          <textarea
            className="text-input old-text"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Eski metni buraya yazın..."
            rows={12}
          />
        </div>

        <div className="text-input-container">
          <div className="input-header">
            <h3>Yeni Metin</h3>
            <span className="text-stats">
              {newText.length} karakter, {newText.split('\n').length} satır
            </span>
          </div>
          <textarea
            className="text-input new-text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Yeni metni buraya yazın..."
            rows={12}
          />
        </div>
      </div>

      {/* Sonuçlar */}
      <AnimatePresence>
        {calculateDiff && (
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* İstatistikler */}
            <div className="stats-section">
              <h3>
                <BarChart3 />
                Fark İstatistikleri
              </h3>
              <div className="stats-grid">
                <div className="stat-item added">
                  <span className="stat-number">{calculateDiff.stats.added}</span>
                  <span className="stat-label">Eklenen</span>
                </div>
                <div className="stat-item removed">
                  <span className="stat-number">{calculateDiff.stats.removed}</span>
                  <span className="stat-label">Silinen</span>
                </div>
                <div className="stat-item modified">
                  <span className="stat-number">{calculateDiff.stats.modified}</span>
                  <span className="stat-label">Değiştirilen</span>
                </div>
                <div className="stat-item unchanged">
                  <span className="stat-number">{calculateDiff.stats.unchanged}</span>
                  <span className="stat-label">Değişmeyen</span>
                </div>
              </div>
              
              <div className="change-percentage">
                <div className="percentage-bar">
                  <div 
                    className="percentage-fill added" 
                    style={{ width: `${(calculateDiff.stats.added / calculateDiff.stats.total) * 100}%` }}
                  ></div>
                  <div 
                    className="percentage-fill removed" 
                    style={{ width: `${(calculateDiff.stats.removed / calculateDiff.stats.total) * 100}%` }}
                  ></div>
                  <div 
                    className="percentage-fill modified" 
                    style={{ width: `${(calculateDiff.stats.modified / calculateDiff.stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="percentage-text">
                  %{(((calculateDiff.stats.added + calculateDiff.stats.removed + calculateDiff.stats.modified) / calculateDiff.stats.total) * 100).toFixed(1)} değişiklik
                </span>
              </div>
            </div>

            {/* Diff Görünümü */}
            <div className="diff-section">
              <h3>
                <GitCompare />
                Fark Analizi ({diffMode === 'line' ? 'Satır' : diffMode === 'word' ? 'Kelime' : 'Karakter'} Bazında)
              </h3>
              
              {viewMode === 'side-by-side' ? (
                <div className="diff-side-by-side">
                  <div className="diff-column old-column">
                    <h4>Eski Metin</h4>
                    <div className="diff-content">
                      {calculateDiff.diff.map((item, index) => (
                        <div key={index} className={`diff-line ${item.type}`}>
                          {item.type === 'modified' ? (
                            <span className="line-content">{item.oldContent}</span>
                          ) : item.type !== 'added' ? (
                            <span className="line-content">{item.content}</span>
                          ) : (
                            <span className="line-placeholder"></span>
                          )}
                          {diffMode === 'line' && item.oldLine && (
                            <span className="line-number">{item.oldLine}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="diff-column new-column">
                    <h4>Yeni Metin</h4>
                    <div className="diff-content">
                      {calculateDiff.diff.map((item, index) => (
                        <div key={index} className={`diff-line ${item.type}`}>
                          {item.type === 'modified' ? (
                            <span className="line-content">{item.newContent}</span>
                          ) : item.type !== 'removed' ? (
                            <span className="line-content">{item.content}</span>
                          ) : (
                            <span className="line-placeholder"></span>
                          )}
                          {diffMode === 'line' && item.newLine && (
                            <span className="line-number">{item.newLine}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="diff-unified">
                  {calculateDiff.diff.map((item, index) => (
                    <div key={index} className={`diff-line ${item.type}`}>
                      <span className="diff-marker">
                        {item.type === 'added' ? '+' : 
                         item.type === 'removed' ? '-' : 
                         item.type === 'modified' ? '~' : ' '}
                      </span>
                      <span className="line-content">
                        {item.type === 'modified' 
                          ? `${item.oldContent} → ${item.newContent}`
                          : item.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default TextDifference 
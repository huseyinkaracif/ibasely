import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Copy, RefreshCw, Wand2, Download, CheckCircle } from 'lucide-react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import './TextTransformer.css'

const TextTransformer = () => {
  const [inputText, setInputText] = useState('')
  const [copiedStates, setCopiedStates] = useState({})

  // Dönüşüm fonksiyonları
  const transformations = useMemo(() => {
    if (!inputText.trim()) return []

    return [
      {
        id: 'original',
        name: 'Orijinal Metin',
        icon: '📝',
        description: 'Değiştirilmemiş orijinal metin',
        transform: (text) => text,
        category: 'basic'
      },
      {
        id: 'lowercase',
        name: 'küçük harf',
        icon: '🔽',
        description: 'Tüm harfleri küçük harfe dönüştürür',
        transform: (text) => text.toLowerCase(),
        category: 'basic'
      },
      {
        id: 'uppercase',
        name: 'BÜYÜK HARF',
        icon: '🔼',
        description: 'Tüm harfleri büyük harfe dönüştürür',
        transform: (text) => text.toUpperCase(),
        category: 'basic'
      },
      {
        id: 'sentence',
        name: 'Cümle formatı',
        icon: '📖',
        description: 'Her cümlenin ilk harfini büyük yapar',
        transform: (text) => {
          return text.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, (match) => match.toUpperCase())
        },
        category: 'basic'
      },
      {
        id: 'title',
        name: 'Title Case',
        icon: '📰',
        description: 'Her kelimenin ilk harfini büyük yapar',
        transform: (text) => {
          return text.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase())
        },
        category: 'basic'
      },
      {
        id: 'camel',
        name: 'camelCase',
        icon: '🐪',
        description: 'İlk kelime küçük, diğer kelimeler büyük harfle başlar',
        transform: (text) => {
          const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
          return words[0] + words.slice(1).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('')
        },
        category: 'programming'
      },
      {
        id: 'pascal',
        name: 'PascalCase',
        icon: '🏛️',
        description: 'Her kelimenin ilk harfi büyük, boşluk yok',
        transform: (text) => {
          return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
        },
        category: 'programming'
      },
      {
        id: 'snake',
        name: 'snake_case',
        icon: '🐍',
        description: 'Kelimeler alt çizgi ile ayrılır, küçük harf',
        transform: (text) => {
          return text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_')
        },
        category: 'programming'
      },
      {
        id: 'constant',
        name: 'CONSTANT_CASE',
        icon: '🏔️',
        description: 'Sabit değişken formatı: büyük harf + alt çizgi',
        transform: (text) => {
          return text.toUpperCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_')
        },
        category: 'programming'
      },
      {
        id: 'kebab',
        name: 'kebab-case',
        icon: '🍢',
        description: 'Kelimeler tire ile ayrılır, küçük harf',
        transform: (text) => {
          return text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
        },
        category: 'programming'
      },
      {
        id: 'cobol',
        name: 'COBOL-CASE',
        icon: '💼',
        description: 'COBOL stili: büyük harf + tire',
        transform: (text) => {
          return text.toUpperCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
        },
        category: 'programming'
      },
      {
        id: 'train',
        name: 'Train-Case',
        icon: '🚂',
        description: 'Her kelime büyük harfle başlar, tire ile ayrılır',
        transform: (text) => {
          return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')
        },
        category: 'programming'
      },
      {
        id: 'alternating',
        name: 'aLtErNaTiNg CaSe',
        icon: '🎭',
        description: 'Harfler dönüşümlü büyük-küçük',
        transform: (text) => {
          return text.split('').map((char, index) => 
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          ).join('')
        },
        category: 'fun'
      },
      {
        id: 'reverse',
        name: 'ɘɔɒɔ ɘƨɿɘvɘЯ',
        icon: '🔄',
        description: 'Metni tersine çevirir',
        transform: (text) => text.split('').reverse().join(''),
        category: 'fun'
      },
      {
        id: 'upside',
        name: 'uʍop ǝpᴉsdn',
        icon: '🙃',
        description: 'Metni baş aşağı çevirir',
        transform: (text) => {
          const upsideMap = {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
            'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
            'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
            'y': 'ʎ', 'z': 'z', ' ': ' ', '.': '˙', ',': "'", '!': '¡', '?': '¿'
          }
          return text.toLowerCase().split('').map(char => upsideMap[char] || char).reverse().join('')
        },
        category: 'fun'
      },
      {
        id: 'morse',
        name: '-- --- .-. ... .',
        icon: '📡',
        description: 'Morse koduna dönüştürür',
        transform: (text) => {
          const morseMap = {
            'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
            'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
            'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
            's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
            'y': '-.--', 'z': '--..', ' ': '/', '0': '-----', '1': '.----',
            '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....',
            '7': '--...', '8': '---..', '9': '----.'
          }
          return text.toLowerCase().split('').map(char => morseMap[char] || char).join(' ')
        },
        category: 'fun'
      },
      {
        id: 'leet',
        name: '1337 5p34k',
        icon: '💻',
        description: 'Leet speak formatına dönüştürür',
        transform: (text) => {
          const leetMap = {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1', 'g': '9'
          }
          return text.toLowerCase().split('').map(char => leetMap[char] || char).join('')
        },
        category: 'fun'
      },
      {
        id: 'remove-spaces',
        name: 'Boşluksuz',
        icon: '🚫',
        description: 'Tüm boşlukları kaldırır',
        transform: (text) => text.replace(/\s+/g, ''),
        category: 'clean'
      },
      {
        id: 'remove-punctuation',
        name: 'Noktalama İşaretleri Temizlenmiş',
        icon: '🧹',
        description: 'Noktalama işaretlerini kaldırır',
        transform: (text) => text.replace(/[^\w\s]/g, ''),
        category: 'clean'
      },
      {
        id: 'remove-numbers',
        name: 'Sayılar Temizlenmiş',
        icon: '🔢',
        description: 'Tüm sayıları kaldırır',
        transform: (text) => text.replace(/\d/g, ''),
        category: 'clean'
      },
      {
        id: 'only-letters',
        name: 'Sadece Harfler',
        icon: '🔤',
        description: 'Sadece harfleri bırakır',
        transform: (text) => text.replace(/[^a-zA-ZğüşıöçĞÜŞIÖÇ\s]/g, ''),
        category: 'clean'
      }
    ]
  }, [inputText])

  // Kategori grupları
  const categories = [
    { id: 'basic', name: 'Temel Dönüşümler', icon: '📝', color: '#3b82f6' },
    { id: 'programming', name: 'Programlama', icon: '💻', color: '#8b5cf6' },
    { id: 'fun', name: 'Eğlenceli', icon: '🎉', color: '#f59e0b' },
    { id: 'clean', name: 'Temizleme', icon: '🧹', color: '#10b981' }
  ]

  // Kopyalama fonksiyonu
  const copyToClipboard = async (text, transformId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [transformId]: true }))
      toast.success('Kopyalandı!')
      
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [transformId]: false }))
      }, 2000)
    } catch (err) {
      toast.error('Kopyalama başarısız!')
    }
  }

  // Tüm sonuçları export et
  const exportAllResults = () => {
    if (!inputText.trim()) return

    const results = transformations.map(t => `${t.name}:\n${t.transform(inputText)}`).join('\n\n')
    const blob = new Blob([results], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'metin-donusumleri.txt')
    toast.success('Tüm dönüşümler indirildi!')
  }

  // Temizle
  const clearAll = () => {
    setInputText('')
    setCopiedStates({})
  }

  return (
    <motion.div 
      className="text-transformer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="transformer-header">
        <h2>🔄 Gelişmiş Metin Dönüştürücü</h2>
        <p>Metninizi 20+ farklı formata dönüştürün</p>
      </div>

      {/* Metin Giriş Alanı */}
      <div className="input-section">
        <div className="input-header">
          <h3>
            <Type />
            Metin Girişi
          </h3>
          <div className="input-actions">
            <button onClick={clearAll} className="clear-btn" disabled={!inputText}>
              <RefreshCw />
              Temizle
            </button>
            <button onClick={exportAllResults} className="export-all-btn" disabled={!inputText}>
              <Download />
              Tümünü İndir
            </button>
          </div>
        </div>
        
        <textarea
          className="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Dönüştürmek istediğiniz metni buraya yazın..."
          rows={6}
        />
        
        {inputText && (
          <div className="input-stats">
            <span>{inputText.length} karakter</span>
            <span>{inputText.trim().split(/\s+/).length} kelime</span>
            <span>{transformations.length} dönüşüm mevcut</span>
          </div>
        )}
      </div>

      {/* Dönüşüm Sonuçları */}
      <AnimatePresence>
        {inputText.trim() && (
          <motion.div 
            className="transformations-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {categories.map(category => {
              const categoryTransforms = transformations.filter(t => t.category === category.id)
              if (categoryTransforms.length === 0) return null

              return (
                <motion.div 
                  key={category.id} 
                  className="category-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="category-header">
                    <h3 style={{ color: category.color }}>
                      <span className="category-icon">{category.icon}</span>
                      {category.name}
                    </h3>
                    <span className="category-count">{categoryTransforms.length} dönüşüm</span>
                  </div>
                  
                  <div className="transforms-grid">
                    {categoryTransforms.map((transform, index) => {
                      const result = transform.transform(inputText)
                      const isCopied = copiedStates[transform.id]
                      
                      return (
                        <motion.div 
                          key={transform.id}
                          className="transform-card"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                        >
                          <div className="transform-header">
                            <div className="transform-info">
                              <span className="transform-icon">{transform.icon}</span>
                              <div>
                                <h4>{transform.name}</h4>
                                <p>{transform.description}</p>
                              </div>
                            </div>
                            <button 
                              className={`copy-btn ${isCopied ? 'copied' : ''}`}
                              onClick={() => copyToClipboard(result, transform.id)}
                            >
                              {isCopied ? <CheckCircle /> : <Copy />}
                            </button>
                          </div>
                          
                          <div className="transform-result">
                            <div className="result-text">
                              {result || '(boş)'}
                            </div>
                            <div className="result-length">
                              {result.length} karakter
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boş durum */}
      {!inputText.trim() && (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Wand2 className="empty-icon" />
          <h3>Dönüşüm Sihiri Başlasın!</h3>
          <p>Yukarıdaki alana metin girin ve 20+ farklı formatı görün</p>
          <div className="feature-highlights">
            <div className="feature">
              <span className="feature-icon">💻</span>
              <span>Programlama formatları</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎭</span>
              <span>Eğlenceli dönüşümler</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🧹</span>
              <span>Metin temizleme</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📋</span>
              <span>Tek tıkla kopyalama</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Kullanım İpuçları */}
      <div className="tips-section">
        <h4>💡 İpuçları</h4>
        <ul>
          <li>Programlama için camelCase, snake_case, kebab-case kullanın</li>
          <li>Tüm dönüşümleri tek seferde indirmek için "Tümünü İndir" butonunu kullanın</li>
          <li>Eğlenceli formatlar sosyal medya için harika</li>
          <li>Temizleme seçenekleri veri işleme için kullanışlı</li>
          <li>Morse kodu ve Leet speak retro tarzı için mükemmel</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default TextTransformer 
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Plus, Trash2, Settings, FileText, Link, Package } from 'lucide-react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import './BatchQRGenerator.css'

const BatchQRGenerator = () => {
  const [inputList, setInputList] = useState([''])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [qrOptions, setQrOptions] = useState({
    size: 512,
    errorCorrectionLevel: 'M',
    margin: 4,
    darkColor: '#1E293B',
    lightColor: '#FFFFFF',
    format: 'png' // png, jpg, svg, webp
  })
  
  const fileInputRef = useRef(null)

  // Input listesine yeni satır ekle
  const addNewInput = () => {
    setInputList([...inputList, ''])
  }

  // Input silme
  const removeInput = (index) => {
    if (inputList.length > 1) {
      const newList = inputList.filter((_, i) => i !== index)
      setInputList(newList)
    }
  }

  // Input değişiklik handler
  const handleInputChange = (index, value) => {
    const newList = [...inputList]
    newList[index] = value
    setInputList(newList)
  }

  // Dosyadan içe aktarma
  const handleFileImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const lines = content.split('\n').filter(line => line.trim())
      setInputList(lines.length > 0 ? lines : [''])
      toast.success(`${lines.length} satır içe aktarıldı!`)
    }
    reader.readAsText(file)
  }

  // URL/Metin auto-detection
  const detectType = (text) => {
    if (text.startsWith('http://') || text.startsWith('https://') || text.includes('.')) {
      return 'url'
    }
    return 'text'
  }

  // QR kod oluşturma fonksiyonu
  const generateQRCode = async (text, filename) => {
    const options = {
      width: qrOptions.size,
      margin: qrOptions.margin,
      errorCorrectionLevel: qrOptions.errorCorrectionLevel,
      color: {
        dark: qrOptions.darkColor,
        light: qrOptions.lightColor
      }
    }

    switch (qrOptions.format) {
      case 'svg':
        const svgString = await QRCode.toString(text, {
          ...options,
          type: 'svg'
        })
        return {
          filename: `${filename}.svg`,
          content: svgString,
          type: 'text'
        }

      case 'png':
      case 'jpg':
      case 'webp':
        const dataURL = await QRCode.toDataURL(text, options)
        const response = await fetch(dataURL)
        const blob = await response.blob()
        
        if (qrOptions.format === 'jpg') {
          // JPG için canvas ile white background
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          
          return new Promise((resolve) => {
            img.onload = () => {
              canvas.width = img.width
              canvas.height = img.height
              ctx.fillStyle = '#FFFFFF'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              ctx.drawImage(img, 0, 0)
              
              canvas.toBlob((jpgBlob) => {
                resolve({
                  filename: `${filename}.jpg`,
                  content: jpgBlob,
                  type: 'blob'
                })
              }, 'image/jpeg', 0.9)
            }
            img.src = dataURL
          })
        } else if (qrOptions.format === 'webp') {
          // WebP için canvas dönüşümü
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          
          return new Promise((resolve) => {
            img.onload = () => {
              canvas.width = img.width
              canvas.height = img.height
              ctx.drawImage(img, 0, 0)
              
              canvas.toBlob((webpBlob) => {
                resolve({
                  filename: `${filename}.webp`,
                  content: webpBlob,
                  type: 'blob'
                })
              }, 'image/webp', 0.9)
            }
            img.src = dataURL
          })
        } else {
          return {
            filename: `${filename}.png`,
            content: blob,
            type: 'blob'
          }
        }

      default:
        throw new Error('Desteklenmeyen format')
    }
  }

  // Toplu QR kod oluşturma ve ZIP indirme
  const generateBatchQR = async () => {
    const validInputs = inputList.filter(text => text.trim())
    
    if (validInputs.length === 0) {
      toast.error('En az bir geçerli metin girin')
      return
    }

    setIsGenerating(true)
    setProgress(0)

    try {
      const zip = new JSZip()
      const total = validInputs.length

      for (let i = 0; i < validInputs.length; i++) {
        const text = validInputs[i].trim()
        const filename = `qr-${i + 1}`
        
        try {
          const qrFile = await generateQRCode(text, filename)
          
          if (qrFile.type === 'text') {
            zip.file(qrFile.filename, qrFile.content)
          } else {
            zip.file(qrFile.filename, qrFile.content)
          }
          
          setProgress(Math.round(((i + 1) / total) * 100))
        } catch (error) {
          console.error(`QR ${i + 1} oluşturma hatası:`, error)
          toast.error(`QR ${i + 1} oluşturulamadı`)
        }
      }

      // ZIP dosyası oluştur ve indir
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      saveAs(zipBlob, `qr-codes-${timestamp}.zip`)
      
      toast.success(`${validInputs.length} QR kod başarıyla oluşturuldu!`)
    } catch (error) {
      console.error('Toplu QR oluşturma hatası:', error)
      toast.error('QR kodları oluşturulurken hata oluştu')
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  return (
    <motion.div 
      className="batch-qr-generator"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="batch-container">
        {/* Input Section */}
        <motion.div 
          className="batch-input-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="input-header">
            <div className="input-header-title">
              <FileText size={20} />
              <span>Toplu Metin/URL Girişi</span>
            </div>
            
            <div className="input-actions">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Package size={16} />
                Dosyadan İçe Aktar
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={addNewInput}
              >
                <Plus size={16} />
                Yeni Satır
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".txt,.csv"
            style={{ display: 'none' }}
          />

          <div className="input-list">
            {inputList.map((input, index) => (
              <motion.div 
                key={index}
                className="input-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="input-number">{index + 1}</div>
                <div className="input-type-indicator">
                  {detectType(input) === 'url' ? <Link size={16} /> : <FileText size={16} />}
                </div>
                <input
                  type="text"
                  className="batch-input"
                  placeholder={`Metin veya URL girin... (örn: https://example.com)`}
                  value={input}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                {inputList.length > 1 && (
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeInput(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Preview & Settings Section */}
        <motion.div 
          className="batch-preview-section"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="preview-header">
            <div className="preview-title">
              <Settings size={20} />
              <span>Toplu İşlem Ayarları</span>
            </div>
          </div>

          <div className="batch-settings">
            <div className="settings-grid">
              <div className="setting-item">
                <label>Dosya Formatı</label>
                <select 
                  value={qrOptions.format}
                  onChange={(e) => setQrOptions(prev => ({ ...prev, format: e.target.value }))}
                >
                  <option value="png">PNG (Yüksek Kalite)</option>
                  <option value="jpg">JPG (Optimize)</option>
                  <option value="webp">WebP (Modern)</option>
                  <option value="svg">SVG (Vektörel)</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>QR Kod Rengi</label>
                <div className="color-picker-container">
                  <input 
                    type="color"
                    value={qrOptions.darkColor}
                    onChange={(e) => setQrOptions(prev => ({ ...prev, darkColor: e.target.value }))}
                    className="color-picker"
                  />
                  <span className="color-label">{qrOptions.darkColor}</span>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Arka Plan Rengi</label>
                <div className="color-picker-container">
                  <input 
                    type="color"
                    value={qrOptions.lightColor}
                    onChange={(e) => setQrOptions(prev => ({ ...prev, lightColor: e.target.value }))}
                    className="color-picker"
                  />
                  <span className="color-label">{qrOptions.lightColor}</span>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Hata Düzeltme</label>
                <select 
                  value={qrOptions.errorCorrectionLevel}
                  onChange={(e) => setQrOptions(prev => ({ ...prev, errorCorrectionLevel: e.target.value }))}
                >
                  <option value="L">Düşük (%7)</option>
                  <option value="M">Orta (%15)</option>
                  <option value="Q">Yüksek (%25)</option>
                  <option value="H">Çok Yüksek (%30)</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Kenar Boşluğu</label>
                <select 
                  value={qrOptions.margin}
                  onChange={(e) => setQrOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                >
                  <option value={0}>Yok (0)</option>
                  <option value={2}>Az (2)</option>
                  <option value={4}>Normal (4)</option>
                  <option value={6}>Fazla (6)</option>
                  <option value={8}>Çok Fazla (8)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Batch Info */}
          <div className="batch-info">
            <div className="info-item">
              <span className="info-label">Toplam QR:</span>
              <span className="info-value">{inputList.filter(text => text.trim()).length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Format:</span>
              <span className="info-value">{qrOptions.format.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Boyut:</span>
              <span className="info-value">{qrOptions.size}px</span>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <motion.div 
              className="progress-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="progress-label">QR kodları oluşturuluyor... {progress}%</div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Generate Button */}
          <motion.button
            className="btn btn-primary btn-large generate-btn"
            onClick={generateBatchQR}
            disabled={isGenerating || inputList.filter(text => text.trim()).length === 0}
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          >
            {isGenerating ? (
              <>
                <div className="spinner" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Download size={20} />
                ZIP Olarak İndir ({inputList.filter(text => text.trim()).length} QR)
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BatchQRGenerator 
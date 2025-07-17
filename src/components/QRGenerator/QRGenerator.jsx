import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Link, Type, Settings } from 'lucide-react'
import QRCode from 'qrcode'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import './QRGenerator.css'

const QRGenerator = () => {
  const [inputText, setInputText] = useState('')
  const [inputType, setInputType] = useState('text') // 'text' or 'url'
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrOptions, setQrOptions] = useState({
    size: 512, // Standart yüksek kalite
    errorCorrectionLevel: 'M',
    margin: 4,
    darkColor: '#1E293B',
    lightColor: '#FFFFFF'
  })
  
  const canvasRef = useRef(null)

  // QR Code oluşturma fonksiyonu
  const generateQR = async (text) => {
    if (!text.trim()) {
      setQrCodeDataURL('')
      return
    }

    setIsGenerating(true)
    try {
      const dataURL = await QRCode.toDataURL(text, {
        width: qrOptions.size,
        margin: qrOptions.margin,
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        color: {
          dark: qrOptions.darkColor,
          light: qrOptions.lightColor
        }
      })
      setQrCodeDataURL(dataURL)
    } catch (error) {
      console.error('QR Code generation error:', error)
      toast.error('QR kod oluşturulurken hata oluştu')
    } finally {
      setIsGenerating(false)
    }
  }

  // Input değişikliklerinde QR kod güncelle
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR(inputText)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [inputText, qrOptions])

  // URL validation
  const validateURL = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Input değişiklik handler
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputText(value)
    
    // Auto-detect URL
    if (value.startsWith('http://') || value.startsWith('https://') || value.includes('.')) {
      setInputType('url')
    } else {
      setInputType('text')
    }
  }

  // PNG olarak indir
  const downloadAsPNG = async () => {
    if (!qrCodeDataURL) {
      toast.error('Önce bir QR kod oluşturun')
      return
    }

    try {
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      saveAs(blob, `qr-code-${Date.now()}.png`)
      toast.success('PNG olarak indirildi!')
    } catch (error) {
      toast.error('İndirme hatası')
    }
  }

  // JPG olarak indir
  const downloadAsJPG = async () => {
    if (!qrCodeDataURL) {
      toast.error('Önce bir QR kod oluşturun')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // White background for JPG
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          saveAs(blob, `qr-code-${Date.now()}.jpg`)
          toast.success('JPG olarak indirildi!')
        }, 'image/jpeg', 0.9)
      }
      
      img.src = qrCodeDataURL
    } catch (error) {
      toast.error('İndirme hatası')
    }
  }

  // SVG olarak indir
  const downloadAsSVG = async () => {
    if (!inputText.trim()) {
      toast.error('Önce bir QR kod oluşturun')
      return
    }

    try {
      const svgString = await QRCode.toString(inputText, {
        type: 'svg',
        width: qrOptions.size,
        margin: qrOptions.margin,
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        color: {
          dark: qrOptions.darkColor,
          light: qrOptions.lightColor
        }
      })
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      saveAs(blob, `qr-code-${Date.now()}.svg`)
      toast.success('SVG olarak indirildi!')
    } catch (error) {
      toast.error('İndirme hatası')
    }
  }

  // WebP olarak indir
  const downloadAsWebP = async () => {
    if (!qrCodeDataURL) {
      toast.error('Önce bir QR kod oluşturun')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          saveAs(blob, `qr-code-${Date.now()}.webp`)
          toast.success('WebP olarak indirildi!')
        }, 'image/webp', 0.9)
      }
      
      img.src = qrCodeDataURL
    } catch (error) {
      toast.error('İndirme hatası')
    }
  }

  // QR kodu kopyala
  const copyToClipboard = async () => {
    if (!qrCodeDataURL) {
      toast.error('Önce bir QR kod oluşturun')
      return
    }

    try {
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      toast.success('QR kod panoya kopyalandı!')
    } catch (error) {
      // Fallback: Copy as text
      try {
        await navigator.clipboard.writeText(inputText)
        toast.success('Metin panoya kopyalandı!')
      } catch {
        toast.error('Kopyalama başarısız')
      }
    }
  }

  return (
    <motion.div 
      className="qr-generator"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="qr-container">
        {/* Input Section */}
        <motion.div 
          className="qr-input-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="input-header">
            <div className="input-type-indicator">
              {inputType === 'url' ? <Link size={20} /> : <Type size={20} />}
              <span>{inputType === 'url' ? 'URL' : 'Metin'}</span>
            </div>
          </div>
          
          <div className="input-container">
            <textarea
              className="qr-input"
              placeholder={inputType === 'url' ? 
                'https://www.instagram.com/hesabiniz\nhttps://www.youtube.com/watch?v=abc123\nhttps://wa.me/905551234567\nhttps://maps.app.goo.gl/xyz123' : 
                'Merhaba! Bu bir QR kod oluşturucu.\n\nWi-Fi Şifresi: 12345678\nTelefon: +90 555 123 45 67\nE-posta: info@sirket.com\n\nİstediğiniz herhangi bir metni yazabilirsiniz...'
              }
              value={inputText}
              onChange={handleInputChange}
              rows={8}
            />
          </div>

          {inputType === 'url' && inputText && !validateURL(inputText) && (
            <div className="input-warning">
              ⚠️ Geçerli bir URL formatı değil
            </div>
          )}
        </motion.div>

        {/* QR Code Preview */}
        <motion.div 
          className="qr-preview-section"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="qr-preview-container">
            {isGenerating ? (
              <div className="qr-loading">
                <div className="spinner"></div>
                <p>QR kod oluşturuluyor...</p>
              </div>
            ) : qrCodeDataURL ? (
              <motion.div 
                className="qr-preview"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code"
                  className="qr-image"
                />
              </motion.div>
            ) : (
              <div className="qr-placeholder">
                <div className="placeholder-icon">📱</div>
                <p>QR kodunuz burada görünecek</p>
                <span>Öncelikle Metin veya URL giriniz</span>
              </div>
            )}
          </div>

          {/* Download Buttons */}
          {qrCodeDataURL && (
            <motion.div 
              className="qr-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <motion.button
                className="btn btn-primary download-btn"
                onClick={downloadAsPNG}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                PNG İndir
              </motion.button>
              
              <motion.button
                className="btn btn-secondary download-btn"
                onClick={downloadAsJPG}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                JPG İndir
              </motion.button>
              
              <motion.button
                className="btn btn-secondary download-btn"
                onClick={downloadAsSVG}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                SVG İndir
              </motion.button>
              
              <motion.button
                className="btn btn-secondary download-btn"
                onClick={downloadAsWebP}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                WebP İndir
              </motion.button>
              
              <motion.button
                className="btn btn-primary copy-btn"
                onClick={copyToClipboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy size={16} />
                Kopyala
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Settings Panel */}
      <motion.div 
        className="qr-settings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="settings-header">
          <Settings size={20} />
          <span>Ayarlar</span>
        </div>
        
        <div className="settings-grid">
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
      </motion.div>
    </motion.div>
  )
}

export default QRGenerator 
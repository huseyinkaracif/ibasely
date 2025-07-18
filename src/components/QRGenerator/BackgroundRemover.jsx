import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Download, Trash2, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import './BackgroundRemover.css'

const BackgroundRemover = () => {
  const [image, setImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [loadingModel, setLoadingModel] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const selfieSegmentation = useRef(null)

  // Model yükleme
  const loadModel = async () => {
    if (selfieSegmentation.current || loadingModel) return
    
    setLoadingModel(true)
    try {
      const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation')
      
      selfieSegmentation.current = new SelfieSegmentation({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        }
      })

      selfieSegmentation.current.setOptions({
        modelSelection: 1, // 0 veya 1 (1 daha yüksek kalite)
        selfieMode: false,
      })

      await new Promise((resolve) => {
        selfieSegmentation.current.onResults((results) => {
          if (results.segmentationMask) {
            processSegmentation(results)
          }
        })
        selfieSegmentation.current.initialize().then(resolve)
      })

      setModelLoaded(true)
      toast.success('AI model yüklendi!')
    } catch (error) {
      console.error('Model yüklenirken hata:', error)
      toast.error('Model yüklenemedi. Lütfen sayfayı yenileyin.')
    } finally {
      setLoadingModel(false)
    }
  }

  // Segmentasyon işlemi
  const processSegmentation = (results) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = results.image.width
    canvas.height = results.image.height

    // Orijinal resmi çiz
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(results.image, 0, 0)

    // Segmentasyon maskesini uygula
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(results.segmentationMask, 0, 0)

    // Canvas'ı blob'a çevir
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      setProcessedImage(url)
      setIsLoading(false)
    }, 'image/png')
  }

  // Dosya seçimi
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Dosya boyutu kontrolü (3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Dosya boyutu 3MB\'dan büyük olamaz!')
      return
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin!')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
  }

  // Arka plan silme işlemi
  const removeBackground = async () => {
    if (!image || !modelLoaded) {
      if (!modelLoaded) {
        toast.error('Lütfen önce AI modelini yükleyin!')
      }
      return
    }

    setIsLoading(true)
    
    try {
      const img = new Image()
      img.onload = async () => {
        await selfieSegmentation.current.send({ image: img })
      }
      img.src = image
    } catch (error) {
      console.error('İşlem hatası:', error)
      toast.error('Arka plan silinirken hata oluştu!')
      setIsLoading(false)
    }
  }

  // İndirme
  const downloadImage = () => {
    if (!processedImage) return
    
    fetch(processedImage)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, 'background-removed.png')
        toast.success('Resim indirildi!')
      })
  }

  // Reset
  const resetAll = () => {
    setImage(null)
    setProcessedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <motion.div 
      className="background-remover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-remover-header">
        <h2>🎨 Arka Plan Silici</h2>
        <p>AI ile resimlerinizden arka planı otomatik olarak silin</p>
      </div>

      {/* Model Yükleme */}
      {!modelLoaded && (
        <motion.div 
          className="model-loading-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="model-info">
            <AlertCircle className="info-icon" />
            <div>
              <h3>AI Model Hazırlığı</h3>
              <p>Arka plan silme için AI modelini yüklemek gerekiyor (~15MB)</p>
            </div>
          </div>
          <button 
            className="load-model-btn"
            onClick={loadModel}
            disabled={loadingModel}
          >
            {loadingModel ? (
              <>
                <Loader2 className="spin" />
                Model Yükleniyor...
              </>
            ) : (
              <>
                <Download />
                AI Modelini Yükle
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Ana İçerik */}
      <AnimatePresence>
        {modelLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-remover-content"
          >
            {/* Dosya Yükleme */}
            <div className="upload-section">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              {!image ? (
                <motion.div 
                  className="upload-area"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="upload-icon" />
                  <h3>Resim Yükleyin</h3>
                  <p>PNG, JPG veya JPEG formatında, max 3MB</p>
                  <button className="upload-btn">
                    <ImageIcon />
                    Dosya Seç
                  </button>
                </motion.div>
              ) : (
                <div className="image-preview">
                  <img src={image} alt="Yüklenen resim" />
                  <div className="image-overlay">
                    <button 
                      className="change-image-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload />
                      Resmi Değiştir
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* İşlem Butonları */}
            {image && (
              <motion.div 
                className="action-buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button 
                  className="process-btn"
                  onClick={removeBackground}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <ImageIcon />
                      Arka Planı Sil
                    </>
                  )}
                </button>

                <button 
                  className="reset-btn"
                  onClick={resetAll}
                  disabled={isLoading}
                >
                  <Trash2 />
                  Temizle
                </button>
              </motion.div>
            )}

            {/* Sonuç */}
            <AnimatePresence>
              {processedImage && (
                <motion.div 
                  className="result-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3>✨ Sonuç</h3>
                  <div className="result-preview">
                    <img src={processedImage} alt="İşlenmiş resim" />
                    <div className="result-overlay">
                      <button 
                        className="download-btn"
                        onClick={downloadImage}
                      >
                        <Download />
                        PNG İndir
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gizli canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Kullanım İpuçları */}
      <div className="tips-section">
        <h4>💡 İpuçları</h4>
        <ul>
          <li>En iyi sonuç için kişinin net bir şekilde göründüğü resimler kullanın</li>
          <li>Arka plan ile kişi arasında kontrast olması sonucu iyileştirir</li>
          <li>Model ilk kez yüklendiğinde internet bağlantısı gerekir</li>
          <li>İşlem tamamen tarayıcınızda yapılır, resimleriniz hiçbir sunucuya gönderilmez</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default BackgroundRemover 
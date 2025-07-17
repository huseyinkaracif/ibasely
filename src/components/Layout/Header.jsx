import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import './Header.css'

const Header = () => {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="header-content">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="logo-icon">
              <Sparkles size={28} />
            </div>
            <h1 className="logo-text">IBASELY</h1>
          </motion.div>
          
          <div className="header-tagline">
            <p>Oyun Alanında İhtiyacınız Olan Her Şey</p>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 
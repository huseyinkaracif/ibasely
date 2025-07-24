import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Sun, Moon } from 'lucide-react'
import './Header.css'
import { useTheme } from '../../theme/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="header-content">
          <Link to="/">
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
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="header-tagline">
              <p>Oyun Alanında İhtiyacınız Olan Her Şey</p>
            </div>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Tema Değiştir"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.5rem',
                color: 'var(--text-primary)'
              }}
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 
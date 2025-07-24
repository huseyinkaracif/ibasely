import { motion } from 'framer-motion'
import { Search, Star, ExternalLink } from 'lucide-react'
import './ToolGrid.css'

const ToolGrid = ({ category, tools, searchTerm, onSearchChange, onToolSelect, favorites, onToggleFavorite, isFavorite }) => {
  return (
    <div className="tool-grid-container">
      <motion.div 
        className="tool-grid-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="category-info">
          <span className="category-icon-large">{category?.icon}</span>
          <h2>{category?.label}</h2>
        </div>
        
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Araç ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </motion.div>

      <motion.div 
        className="tools-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {tools.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>Bu kategoride henüz araç bulunmuyor.</p>
          </motion.div>
        ) : (
          tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="tool-card"
              whileHover={{ scale: 1.02, y: -8 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1 + 0.3,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              onClick={() => onToolSelect(tool.id)}
            >
              <div className="tool-icon">
                {tool.icon}
              </div>
              <div className="tool-info">
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
              </div>
              <div className="tool-actions tool-actions-inside">
                <button 
                  className={`tool-action-btn ${isFavorite(tool.id) ? 'favorite-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(tool.id);
                  }}
                  title={isFavorite(tool.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                >
                  <motion.span
                    animate={{
                      scale: isFavorite(tool.id) ? 1.2 : 1,
                      color: isFavorite(tool.id) ? '#FFC107' : '#fff',
                      transition: { type: 'spring', stiffness: 400, damping: 15 }
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <Star size={18} fill={isFavorite(tool.id) ? "currentColor" : "none"} />
                  </motion.span>
                </button>
                <button 
                  className="tool-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Yeni sekmede aç
                    window.open(`#${tool.id}`, '_blank');
                  }}
                  title="Yeni Sekmede Aç"
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {searchTerm && tools.length === 0 && (
        <motion.div 
          className="no-results"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>"{searchTerm}" için sonuç bulunamadı.</p>
        </motion.div>
      )}
    </div>
  )
}

export default ToolGrid 
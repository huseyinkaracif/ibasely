import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import './FavoritesSection.css'

const FavoritesSection = ({ favoriteTools, onToolSelect, onToggleFavorite, isFavorite }) => {
  return (
    <motion.div 
      className="favorites-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="favorites-header">
        <div className="favorites-title">
          <Star size={24} className="favorites-icon" />
          <h2>Favorilerim</h2>
        </div>
        <span className="favorites-count">{favoriteTools.length}</span>
      </div>

      <div className="favorites-grid">
        {favoriteTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            className="favorite-card"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1 + 0.7
            }}
            onClick={() => onToolSelect(tool.id)}
          >
            <div className="favorite-icon">
              {tool.icon}
            </div>
            <div className="favorite-info">
              <h3 className="favorite-title">{tool.title}</h3>
            </div>
            <div className="favorite-actions">
              <button 
                className="favorite-action-btn favorite-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(tool.id);
                }}
                title="Favorilerden Çıkar"
              >
                <Star size={16} fill="currentColor" />
              </button>
              <button 
                className="favorite-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`#${tool.id}`, '_blank');
                }}
                title="Yeni Sekmede Aç"
              >
                <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default FavoritesSection 
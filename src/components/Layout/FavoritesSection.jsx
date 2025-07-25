import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import './FavoritesSection.css'

const FavoritesSection = ({ favoriteTools, onToggleFavorite, isFavorite }) => {
  return (
    <>
      <div className="favorites-header">
        <div className="favorites-title">
          <Star size={24} className="favorites-icon" />
          <h2>Favorilerim</h2>
        </div>
        <span className="favorites-count">{favoriteTools.length}</span>
      </div>

      <motion.div
        className="favorites-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
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
          >
            <Link to={`/${tool.category}/${tool.id}`} className="favorite-link">
              <div className="favorite-icon">
                {tool.icon}
              </div>
              <div className="favorite-info">
                <h3 className="favorite-title">{tool.title}</h3>
              </div>
            </Link>
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
              <Link 
                to={`/${tool.category}/${tool.id}`}
                target="_blank"
                className="favorite-action-btn"
                title="Yeni Sekmede Aç"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

export default FavoritesSection 
import './PromoTiles.css';

interface PromoTile {
  id: string;
  title: string;
  description?: string;
  color: string;
  menLink: string;
  womenLink: string;
}

interface PromoTilesProps {
  tiles: PromoTile[];
}

const PromoTiles = ({ tiles }: PromoTilesProps) => {
  return (
    <section className="promo-tiles-section">
      <div className="promo-tiles-container">
        {tiles.map((tile) => (
          <div key={tile.id} className="promo-tile">
            <div className="promo-tile-image" style={{ backgroundColor: tile.color }}>
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
                <rect width="400" height="500" fill={tile.color} />
                <circle cx="200" cy="250" r="80" fill="rgba(255,255,255,0.08)" />
              </svg>
            </div>
            <div className="promo-tile-content">
              <h3 className="promo-tile-title">{tile.title}</h3>
              {tile.description && <p className="promo-tile-desc">{tile.description}</p>}
              <div className="promo-tile-buttons">
                <a href={tile.menLink} className="btn btn-secondary promo-btn">
                  Shop Men
                </a>
                <a href={tile.womenLink} className="btn btn-secondary promo-btn">
                  Shop Women
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoTiles;

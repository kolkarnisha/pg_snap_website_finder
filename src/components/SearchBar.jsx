export default function SearchBar({ searchQuery, onSearch, onSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <div className="search-input-group">
          <span className="search-icon">📍</span>
          <input
            id="search-input"
            className="search-input"
            type="text"
            placeholder="Search by location, PG name..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="search-btn" id="search-btn" onClick={onSubmit}>
          🔍 Search PGs
        </button>
      </div>
    </div>
  );
}

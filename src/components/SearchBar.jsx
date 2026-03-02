function SearchBar({ search, setSearch }) {
  return (
    <div style={{ marginBottom: "20px" }}>
    <input
      type="text"
      placeholder="Search prompts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
    );
}

export default SearchBar;
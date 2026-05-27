const searchExamples = ['04465-33450', 'D1212', 'RLL10902'];

export default function StorefrontPage() {
  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Storefront</p>
        <h1>Auto parts search and ordering</h1>
        <p>
          First rebuild surface for customer article search, stock visibility,
          cart, and checkout.
        </p>
      </div>

      <form className="search-panel">
        <label htmlFor="article">Article or part number</label>
        <div className="search-row">
          <input id="article" name="article" placeholder="Enter article number" />
          <button type="submit">Search</button>
        </div>
      </form>

      <div className="content-grid">
        {searchExamples.map((article) => (
          <article className="summary-card" key={article}>
            <span>Example query</span>
            <strong>{article}</strong>
            <p>Reserved for real catalog search results once the API is wired.</p>
          </article>
        ))}
      </div>
    </section>
  );
}


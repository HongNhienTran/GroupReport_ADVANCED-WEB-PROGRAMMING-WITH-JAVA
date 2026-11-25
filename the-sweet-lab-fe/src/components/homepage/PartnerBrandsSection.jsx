function PartnerBrandsSection({ brands = [] }) {
  if (!brands.length) return null;

  // Duplicate list so the CSS marquee loops seamlessly without gaps
  const marqueeItems = [...brands, ...brands];

  return (
    <section id="brands" className="section-block" style={{ padding: '64px 0 96px' }}>
      <div className="container">
        <h2 className="section-heading">Thương Hiệu Đối Tác</h2>
      </div>
      <div className="brands-marquee-wrap">
        <div className="brands-marquee-track">
          {marqueeItems.map((brand, index) => (
            <div key={`${brand.id}-${index}`} className="brand-card" title={brand.name}>
              <img src={brand.logoUrl} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnerBrandsSection;

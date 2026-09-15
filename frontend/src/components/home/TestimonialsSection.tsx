export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: '"aiDEAS is where I wrote my first real ML model. The workshops actually get hands-on, fast."',
      name: '[Member Name]',
      role: '2nd Year, AI & DS',
      gradient: 'linear-gradient(135deg,#38d1ff,#22b8f0)',
    },
    {
      quote: '"I joined for the hackathons and stayed for the people. Best decision of my college life."',
      name: '[Member Name]',
      role: '3rd Year, AI & DS',
      gradient: 'linear-gradient(135deg,#b06bff,#9b5cff)',
    },
    {
      quote: '"Nowhere else on campus will you find seniors this willing to actually teach you something."',
      name: '[Member Name]',
      role: '1st Year, AI & DS',
      gradient: 'linear-gradient(135deg,#38d1ff,#b06bff)',
    },
  ];

  return (
    <section className="section-pad ambient-panel">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">What members say</div>
          <h2>
            Straight from the <span className="grad-text">community.</span>
          </h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p>{t.quote}</p>
              <div className="testimonial-author">
                <span
                  className="testimonial-avatar"
                  style={{ background: t.gradient }}
                ></span>
                <div>
                  <div className="name">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

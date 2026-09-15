'use client';

import Link from 'next/link';

export default function ZigzagSection() {
  return (
    <section className="zigzag-section section-pad ambient-panel">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Why join</div>
          <h2>
            Everything you need to <span className="grad-text">start building.</span>
          </h2>
          <p>A community, a curriculum, and a reason to ship something real before you graduate.</p>
        </div>

        {/* Block 1 */}
        <div className="zigzag-block">
          <div className="zigzag-copy">
            <h3>Learn by building</h3>
            <p>
              Workshops and reading groups are just the start — every track ends with a real project, reviewed by peers and mentors, not a quiz.
            </p>
            <Link href="/about" className="zigzag-link">
              Read our story →
            </Link>
          </div>
          <div className="zigzag-visual">
            <div className="mockup-frame">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mockup-body mockup-video-single">
                <video className="mockup-video" autoPlay muted loop playsInline>
                  <source src="/assets/video/Book_Loader.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2 (Reverse) */}
        <div className="zigzag-block reverse">
          <div className="zigzag-copy">
            <h3>Workshops & hackathons</h3>
            <p>
              From weekend build nights to a full 24-hour hack day — hands-on sessions run through the semester, open to every year and branch.
            </p>
            <Link href="/events" className="zigzag-link">
              See events →
            </Link>
          </div>
          <div className="zigzag-visual">
            <div className="mockup-frame">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mockup-body mockup-events">
                <div className="mockup-event-card cyan">
                  <video className="mockup-video" autoPlay muted loop playsInline>
                    <source src="/assets/video/Successful_target.webm" type="video/webm" />
                  </video>
                </div>
                <div className="mockup-event-card purple">
                  <video className="mockup-video" autoPlay muted loop playsInline>
                    <source src="/assets/video/Employee_content.webm" type="video/webm" />
                  </video>
                </div>
                <div className="mockup-event-card cyan">
                  <video className="mockup-video" autoPlay muted loop playsInline>
                    <source src="/assets/video/Business_plan.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block 3 */}
        <div className="zigzag-block">
          <div className="zigzag-copy">
            <h3>A growing community</h3>
            <p>
              A cross-year network of students who share resources, opportunities, and momentum — meet the core team running it.
            </p>
            <Link href="/members" className="zigzag-link">
              Meet the team →
            </Link>
          </div>
          <div className="zigzag-visual">
            <div className="mockup-frame">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mockup-body mockup-avatars">
                <span className="mockup-avatar" style={{ background: 'linear-gradient(135deg,#38d1ff,#22b8f0)' }}></span>
                <span className="mockup-avatar" style={{ background: 'linear-gradient(135deg,#b06bff,#9b5cff)' }}></span>
                <span className="mockup-avatar" style={{ background: 'linear-gradient(135deg,#38d1ff,#b06bff)' }}></span>
                <span className="mockup-avatar" style={{ background: 'linear-gradient(135deg,#9b5cff,#38d1ff)' }}></span>
                <span className="mockup-avatar more">+6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ImageResponse } from 'next/og';

export const alt = 'SETTech — B.Tech Engineering Cockpit for SETGOI';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F7F8FA',
          padding: '56px 64px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle decorative background border frame */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            border: '1px solid #E4E4E7',
            borderRadius: '24px',
            pointerEvents: 'none',
          }}
        />

        {/* Top Header Row: Logo Tile + Wordmark + Institutional Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Logo Tile + Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* White Rounded Tile with Exact SETTech Mark */}
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E4E4E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              <svg
                viewBox="270 185 460 445"
                width="42"
                height="42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="settech-mark">
                  <path
                    d="M 358 206 L 564 206 L 500 271 L 357 271 L 357 375 L 500 375 L 500 440 L 358 440 L 293 375 L 293 271 Z"
                    fill="#000000"
                  />
                  <path
                    d="M 293 464 L 357 464 L 357 541 L 500 541 L 500 606 L 358 606 L 293 541 Z"
                    fill="#000000"
                  />
                  <path
                    d="M 564 375 L 583 375 L 647 439 L 647 542 L 583 606 L 583 440 L 564 440 Z"
                    fill="#000000"
                  />
                  <path
                    d="M 564 206 L 708 206 L 708 356 L 644 356 L 644 271 L 564 271 L 564 606 L 500 606 L 500 356 L 376 356 L 376 290 L 500 290 L 500 271 Z"
                    fill="#383838"
                  />
                  <rect x="583" y="290" width="42" height="66" fill="#383838" />
                  <rect x="357" y="464" width="124" height="58" fill="#383838" />
                </g>
              </svg>
            </div>

            {/* Wordmark Typography */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0px' }}>
              <span
                style={{
                  fontSize: '38px',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: '#09090B',
                }}
              >
                SET
              </span>
              <span
                style={{
                  fontSize: '38px',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: '#2563EB',
                }}
              >
                Tech
              </span>
            </div>

            {/* Mono Scope Pill */}
            <div
              style={{
                marginLeft: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: '#F4F4F5',
                border: '1px solid #E4E4E7',
                fontSize: '13px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#52525B',
                letterSpacing: '0.04em',
              }}
            >
              SETGOI • B.TECH PORTAL
            </div>
          </div>

          {/* Right Institutional Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '100px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: '#09090B',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
              }}
            />
            <span>MAKAUT AFFILIATED • DURGAPUR</span>
          </div>
        </div>

        {/* Middle Body: Display Headline + Explanatory Subtext */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '62px',
              fontWeight: 800,
              color: '#09090B',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              maxWidth: '980px',
            }}
          >
            Your B.Tech Engineering Cockpit.
          </div>

          <div
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: '#52525B',
              lineHeight: 1.45,
              maxWidth: '860px',
            }}
          >
            AI Viva Studio with Groq Whisper &amp; Neural Voice • Solved MAKAUT PYQ Vault • 10-Point SGPA &amp; Safe Bunk Calculator • Campus Q&amp;A Forum
          </div>
        </div>

        {/* Feature Cards Row (4 Swiss Grid Tiles) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#2563EB',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              VOICE EXAM COACH
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090B' }}>
              AI Viva Studio
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#10B981',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ALL 8 SEMESTERS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090B' }}>
              MAKAUT Notes &amp; PYQs
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#8B5CF6',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ENGINEERING UTILITY
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090B' }}>
              SGPA &amp; 75% Tracker
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#F59E0B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              100% FREE ACCESS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090B' }}>
              For SETGOI Students
            </div>
          </div>
        </div>

        {/* Bottom Metadata Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #E4E4E7',
            width: '100%',
            position: 'relative',
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#71717A',
          }}
        >
          <div>
            Sanaka Educational Trust&apos;s Group of Institutions • School of Engineering
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#09090B', fontWeight: 700 }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#2563EB',
              }}
            />
            <span>settech.dev</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

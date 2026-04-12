export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          background: #0c0c0c;
          color: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .page {
          height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          padding: clamp(28px, 5vw, 64px);
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: fadeDown 0.7s ease both;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-box {
          width: 34px;
          height: 34px;
          border: 1.5px solid #f7f6f3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #f7f6f3;
        }

        .logo-name {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(247, 246, 243, 0.6);
        }

        .status {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(247, 246, 243, 0.35);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status::before {
          content: '';
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f7f6f3;
          opacity: 0.5;
          animation: blink 2.5s ease infinite;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .label {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(247, 246, 243, 0.4);
          margin-bottom: 28px;
          animation: fadeUp 0.7s 0.15s ease both;
        }

        .headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(68px, 11vw, 148px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: #f7f6f3;
          animation: fadeUp 0.7s 0.25s ease both;
        }

        .headline .invert {
          display: block;
          color: #0c0c0c;
          background: #f7f6f3;
          padding: 0 12px;
          width: fit-content;
          margin-top: 8px;
        }

        .rule {
          width: 48px;
          height: 1px;
          background: rgba(247, 246, 243, 0.3);
          margin: 40px 0;
          animation: grow 0.7s 0.4s ease both;
          transform-origin: left;
        }

        .body {
          font-size: clamp(15px, 1.8vw, 18px);
          line-height: 1.75;
          color: rgba(247, 246, 243, 0.45);
          max-width: 460px;
          font-weight: 300;
          animation: fadeUp 0.7s 0.45s ease both;
        }

        .body strong {
          color: #f7f6f3;
          font-weight: 500;
        }

        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(247, 246, 243, 0.07);
          padding-top: 20px;
          animation: fadeUp 0.7s 0.6s ease both;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-l {
          font-size: 12px;
          color: rgba(247, 246, 243, 0.25);
          letter-spacing: 0.04em;
        }

        .footer-r {
          font-size: 11px;
          color: rgba(247, 246, 243, 0.2);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Large ghost text */
        .ghost {
          position: fixed;
          bottom: -60px;
          right: -30px;
          font-family: 'Syne', sans-serif;
          font-size: clamp(100px, 18vw, 240px);
          font-weight: 800;
          color: rgba(247, 246, 243, 0.03);
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.03em;
          z-index: 0;
          animation: fadeUp 1.2s 0.2s ease both;
        }

        /* Thin vertical rule right side */
        .vert {
          position: fixed;
          top: 0;
          right: clamp(28px, 5vw, 64px);
          width: 1px;
          height: 100vh;
          background: linear-gradient(to bottom, transparent 0%, rgba(247,246,243,0.08) 40%, rgba(247,246,243,0.08) 60%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @keyframes blink {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.15; }
        }

        @media (max-width: 600px) {
          html, body { overflow-y: auto; }
          .ghost, .vert { display: none; }
          .status { display: none; }
        }
      `}</style>

      <div className="vert" />
      <div className="ghost">WF</div>

      <div className="page">
        <header>
          <div className="logo">
            <div className="logo-box">W</div>
            <span className="logo-name">Wolf Flow LLC</span>
          </div>
          <span className="status">Store closed — rebuilding</span>
        </header>

        <main>
          <p className="label">Temporarily Unavailable</p>
          <h1 className="headline">
            Back<br />
            <span className="invert">Stronger.</span>
          </h1>
          <div className="rule" />
          <p className="body">
            We're rebuilding our store to make sure every product
            is properly described, positioned, and ready to deliver real value.<br /><br />
            <strong>Wolf Flow LLC</strong> — AI workflow consulting and tools
            for U.S. small businesses, nonprofits, and service firms.
            Back shortly.
          </p>
        </main>

        <footer>
          <span className="footer-l">© 2026 Wolf Flow LLC · Athens, Michigan</span>
          <span className="footer-r">Upgrades in progress</span>
        </footer>
      </div>
    </>
  );
}

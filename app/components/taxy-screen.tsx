import { css } from "styled-system/css";

export function TaxyScreen() {
  return (
    <div className={screen}>
      <header className={status}>
        <span>9:41</span>
        <span className={statusIcons} aria-hidden="true">
          <span className={iconWeak} />
          <span className={iconMid} />
          <span className={iconStrong} />
        </span>
      </header>

      <main className={body}>
        <p className={eyebrow}>モックアップ</p>
        <h1 className={logo}>TAXY</h1>
        <p className={tagline}>ここにアプリ画面を組み立てていきます</p>
      </main>
    </div>
  );
}

const screen = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background:
    "linear-gradient(180deg, #fff9ef 0%, {colors.taxy.cream} 40%, #efe8dc 100%)",
});

const status = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 28px 0",
  fontSize: "0.8rem",
  fontWeight: "600",
});

const statusIcons = css({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const iconWeak = css({
  display: "block",
  height: "8px",
  borderRadius: "2px",
  background: "currentColor",
  width: "14px",
  opacity: 0.55,
});

const iconMid = css({
  display: "block",
  height: "8px",
  borderRadius: "2px",
  background: "currentColor",
  width: "10px",
  opacity: 0.75,
});

const iconStrong = css({
  display: "block",
  height: "8px",
  borderRadius: "2px",
  background: "currentColor",
  width: "18px",
});

const body = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  padding: "2rem 1.5rem 3rem",
  textAlign: "center",
});

const eyebrow = css({
  margin: 0,
  fontSize: "0.7rem",
  fontWeight: "600",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "taxy.muted",
});

const logo = css({
  margin: 0,
  fontFamily: "display",
  fontSize: "clamp(3rem, 14vw, 4.5rem)",
  fontWeight: "800",
  letterSpacing: "0.12em",
  lineHeight: 1,
  color: "taxy.ink",
});

const tagline = css({
  margin: "0.25rem 0 0",
  maxWidth: "16rem",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  color: "taxy.body",
});

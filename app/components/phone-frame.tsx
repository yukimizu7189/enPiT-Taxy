import { css } from "styled-system/css";

type PhoneFrameProps = {
  children: React.ReactNode;
};

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className={stage}>
      <div className={device} aria-label="スマートフォンモック">
        <div className={bezel}>
          <div className={screen}>{children}</div>
          <div className={homeIndicator} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

const stage = css({
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.5rem",
  padding: "2rem 1rem",
  background: "#000",
  _phone: {
    padding: 0,
    gap: 0,
    background: "taxy.cream",
  },
});

const device = css({
  width: "min(100%, 390px)",
  filter: "drop-shadow(0 28px 48px rgb(0 0 0 / 0.55))",
  _phone: {
    width: "100%",
    filter: "none",
  },
});

const bezel = css({
  position: "relative",
  borderRadius: "44px",
  padding: "12px",
  background: "linear-gradient(160deg, #3a3f4d 0%, #0e1016 45%, #1c202b 100%)",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgb(255 255 255 / 0.08)",
  _phone: {
    borderRadius: 0,
    padding: 0,
    background: "none",
    border: "none",
  },
});

const island = css({
  position: "absolute",
  top: "22px",
  left: "50%",
  zIndex: 2,
  width: "96px",
  height: "28px",
  transform: "translateX(-50%)",
  borderRadius: "999px",
  background: "#050608",
  boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.06)",
  _phone: {
    display: "none",
  },
});

const screen = css({
  position: "relative",
  height: "min(78dvh, 780px)",
  overflow: "hidden",
  borderRadius: "34px",
  background: "taxy.cream",
  color: "taxy.ink",
  _phone: {
    height: "100dvh",
    borderRadius: 0,
  },
});

const homeIndicator = css({
  position: "absolute",
  bottom: "20px",
  left: "50%",
  zIndex: 2,
  width: "108px",
  height: "4px",
  transform: "translateX(-50%)",
  borderRadius: "999px",
  background: "rgb(255 255 255 / 0.35)",
  pointerEvents: "none",
  _phone: {
    display: "none",
  },
});

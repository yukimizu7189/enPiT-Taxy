import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { css } from "styled-system/css";

import { taxQuestions, type TaxAnswer } from "./questions";

type Interaction = "flick" | "steer" | "sort";

const interactions: { id: Interaction; number: number; label: string }[] = [
  { id: "flick", number: 1, label: "フリック" },
  { id: "steer", number: 2, label: "ステア" },
  { id: "sort", number: 3, label: "仕分け" },
];

export function TaxCheckInteractions() {
  const [interaction, setInteraction] = useState<Interaction>("flick");

  return (
    <div className={shell}>
      <header className={header}>
        <span className={brand}>TAXY</span>
        <nav className={modeNav} aria-label="操作方法を切り替える">
          {interactions.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={interaction === item.id}
              aria-pressed={interaction === item.id}
              onClick={() => setInteraction(item.id)}
            >
              <b>{item.number}</b>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {interaction === "flick" && <FlickView key="flick" />}
      {interaction === "steer" && <SteeringView key="steer" />}
      {interaction === "sort" && <SortingView key="sort" />}
    </div>
  );
}

function useBinaryFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<TaxAnswer[]>([]);

  function answer(value: TaxAnswer) {
    setAnswers((current) => [...current.slice(0, step), value]);
    setStep((current) => current + 1);
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  return {
    step,
    answers,
    answer,
    back,
    reset,
    complete: step >= taxQuestions.length,
  };
}

function FlickView() {
  const flow = useBinaryFlow();
  const start = useRef<{ x: number; y: number } | null>(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);

  if (flow.complete) {
    return <Result answers={flow.answers} method="全画面フリック" onReset={flow.reset} />;
  }

  const question = taxQuestions[flow.step];

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    start.current = { x: event.clientX, y: event.clientY };
    capturePointer(event.currentTarget, event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const nextOffset = Math.max(-150, Math.min(150, dx));
      offsetRef.current = nextOffset;
      setOffset(nextOffset);
    }
  }

  function finishGesture() {
    if (!start.current) return;
    if (Math.abs(offsetRef.current) >= 64) {
      flow.answer(offsetRef.current > 0 ? "yes" : "no");
    }
    start.current = null;
    offsetRef.current = 0;
    setOffset(0);
  }

  return (
    <main
      className={gestureView}
      aria-label="左右フリックで回答"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishGesture}
      onPointerCancel={finishGesture}
      onKeyDown={(event) => handleArrowKeys(event, flow.answer)}
    >
      <Progress step={flow.step} />
      <div className={gestureIntro}>
        <span>操作 1 · 全画面フリック</span>
        <p>画面のどこからでも、答えの方向へ払う</p>
      </div>

      <div className={directionLabels} aria-hidden="true">
        <span data-active={offset < -20}>← いいえ</span>
        <span data-active={offset > 20}>はい →</span>
      </div>

      <article
        className={questionCard}
        style={{
          transform: `translateX(${offset}px) rotate(${offset / 35}deg)`,
          opacity: 1 - Math.min(Math.abs(offset) / 500, 0.18),
        }}
      >
        <p>{question.eyebrow}</p>
        <h1>{question.prompt}</h1>
        <small>{question.detail}</small>
      </article>

      <GestureMeter value={offset / 64} />
      <FooterHint step={flow.step} onBack={flow.back}>
        64px動かして指を離すと確定
      </FooterHint>
    </main>
  );
}

function SteeringView() {
  const flow = useBinaryFlow();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const positionRef = useRef(0);
  const [position, setPosition] = useState(0);

  if (flow.complete) {
    return <Result answers={flow.answers} method="親指ステアリング" onReset={flow.reset} />;
  }

  const question = taxQuestions[flow.step];

  function updatePosition(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const limit = rect.width / 2 - 34;
    const nextPosition = Math.max(-limit, Math.min(limit, event.clientX - center));
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    capturePointer(event.currentTarget, event.pointerId);
    updatePosition(event);
  }

  function finishSteering() {
    if (!dragging.current) return;
    if (Math.abs(positionRef.current) >= 62) {
      flow.answer(positionRef.current > 0 ? "yes" : "no");
    }
    dragging.current = false;
    positionRef.current = 0;
    setPosition(0);
  }

  return (
    <main
      className={steeringView}
      aria-label="レバーを左右へ動かして回答"
      tabIndex={0}
      onKeyDown={(event) => handleArrowKeys(event, flow.answer)}
    >
      <Progress step={flow.step} />
      <div className={gestureIntro}>
        <span>操作 2 · 親指ステアリング</span>
        <p>親指を置いたまま、答えの方向へレバーを倒す</p>
      </div>

      <div className={steeringQuestion}>
        <p>{question.eyebrow}</p>
        <h1>{question.prompt}</h1>
        <small>{question.detail}</small>
      </div>

      <div className={steeringPanel}>
        <div className={steeringLabels} aria-hidden="true">
          <span data-active={position < -35}>いいえ</span>
          <span data-active={position > 35}>はい</span>
        </div>
        <div
          ref={trackRef}
          className={steeringTrack}
        >
          <div className={trackCenter} aria-hidden="true" />
          <div
            className={steeringKnob}
            style={{ transform: `translateX(${position}px)` }}
            aria-hidden="true"
            onPointerDown={onPointerDown}
            onPointerMove={updatePosition}
            onPointerUp={finishSteering}
            onPointerCancel={finishSteering}
          >
            <span>↔</span>
          </div>
        </div>
        <p>レバーを端へ運び、指を離すと確定</p>
      </div>

      <FooterHint step={flow.step} onBack={flow.back}>
        画面を押すのではなく、方向を操作します
      </FooterHint>
    </main>
  );
}

function SortingView() {
  const flow = useBinaryFlow();
  const start = useRef<{ x: number; y: number } | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (flow.complete) {
    return <Result answers={flow.answers} method="ドラッグ仕分け" onReset={flow.reset} />;
  }

  const question = taxQuestions[flow.step];
  const remaining = taxQuestions.length - flow.step;

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    start.current = { x: event.clientX, y: event.clientY };
    capturePointer(event.currentTarget, event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!start.current) return;
    const nextOffset = {
      x: Math.max(-145, Math.min(145, event.clientX - start.current.x)),
      y: Math.max(0, Math.min(145, event.clientY - start.current.y)),
    };
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  }

  function finishSorting() {
    if (!start.current) return;
    if (offsetRef.current.y >= 58 && Math.abs(offsetRef.current.x) >= 45) {
      flow.answer(offsetRef.current.x > 0 ? "yes" : "no");
    }
    start.current = null;
    offsetRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
  }

  return (
    <main
      className={sortingView}
      aria-label="カードを左右の領域へ仕分けて回答"
      tabIndex={0}
      onKeyDown={(event) => handleArrowKeys(event, flow.answer)}
    >
      <Progress step={flow.step} />
      <div className={gestureIntro}>
        <span>操作 3 · ドラッグ仕分け</span>
        <p>出来事カードを持って、当てはまる箱へ入れる</p>
      </div>

      <div className={cardTray}>
        <div className={stackCount} aria-hidden="true">
          {Array.from({ length: remaining }).map((_, index) => (
            <i key={index} style={{ transform: `translateY(${index * 4}px)` }} />
          ))}
        </div>
        <article
          className={sortingCard}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x / 38}deg)`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishSorting}
          onPointerCancel={finishSorting}
        >
          <p>{question.eyebrow}</p>
          <h1>{question.prompt}</h1>
          <small>つかんで下の箱へ</small>
        </article>
      </div>

      <div className={dropZones} aria-hidden="true">
        <div data-active={offset.y >= 40 && offset.x < -35}>
          <span>←</span>
          <strong>当てはまらない</strong>
        </div>
        <div data-active={offset.y >= 40 && offset.x > 35}>
          <span>→</span>
          <strong>当てはまる</strong>
        </div>
      </div>

      <FooterHint step={flow.step} onBack={flow.back}>
        未仕分け {remaining}枚
      </FooterHint>
    </main>
  );
}

function handleArrowKeys(
  event: KeyboardEvent<HTMLElement>,
  answer: (value: TaxAnswer) => void,
) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    answer("no");
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    answer("yes");
  }
}

function capturePointer(element: HTMLElement, pointerId: number) {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Synthetic events and older browsers can continue without pointer capture.
  }
}

function Progress({ step }: { step: number }) {
  return (
    <div className={progress}>
      <span>
        {step + 1} / {taxQuestions.length}
      </span>
      <div aria-label={`全${taxQuestions.length}問中${step + 1}問目`}>
        {taxQuestions.map((question, index) => (
          <i
            key={question.id}
            data-state={index < step ? "done" : index === step ? "current" : "next"}
          />
        ))}
      </div>
    </div>
  );
}

function GestureMeter({ value }: { value: number }) {
  return (
    <div className={gestureMeter} aria-hidden="true">
      <span style={{ width: `${Math.min(Math.abs(value), 1) * 50}%` }} data-side={value < 0 ? "left" : "right"} />
      <i />
    </div>
  );
}

function FooterHint({
  step,
  onBack,
  children,
}: {
  step: number;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <footer className={footerHint}>
      {step > 0 ? (
        <button type="button" onClick={onBack}>
          ← ひとつ戻る
        </button>
      ) : (
        <span />
      )}
      <p>{children}</p>
    </footer>
  );
}

function Result({
  answers,
  method,
  onReset,
}: {
  answers: TaxAnswer[];
  method: string;
  onReset: () => void;
}) {
  const needsCheck = answers.filter((answer) => answer === "yes").length >= 2;

  return (
    <main className={result}>
      <p>{method}で完了</p>
      <div aria-hidden="true">{needsCheck ? "!" : "✓"}</div>
      <h1>{needsCheck ? "確定申告が必要かも" : "申告は不要そうです"}</h1>
      <span>
        {needsCheck
          ? "回答内容について、もう少し詳しい確認が必要です。"
          : "現在の回答では、申告が必要になる可能性は低そうです。"}
      </span>
      <small>比較用の仮判定です。実際の税務判断には使用できません。</small>
      <button type="button" onClick={onReset}>
        同じ操作でもう一度
      </button>
    </main>
  );
}

const shell = css({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  color: "taxy.ink",
  background: "taxy.cream",
});

const header = css({
  flexShrink: 0,
  minHeight: "68px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",
  borderBottom: "1px solid rgb(18 20 26 / 0.09)",
});

const brand = css({
  fontFamily: "display",
  fontWeight: "800",
  fontSize: "1rem",
  letterSpacing: "0.13em",
});

const modeNav = css({
  display: "flex",
  gap: "3px",
  padding: "3px",
  borderRadius: "13px",
  background: "rgb(18 20 26 / 0.06)",
  "& button": {
    minHeight: "36px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "5px 7px",
    border: 0,
    borderRadius: "10px",
    color: "taxy.body",
    background: "transparent",
    fontSize: "0.61rem",
    fontWeight: "700",
    cursor: "pointer",
  },
  "& b": {
    display: "grid",
    placeItems: "center",
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    background: "rgb(18 20 26 / 0.08)",
    fontFamily: "display",
    fontSize: "0.56rem",
  },
  "& button[data-active=true]": {
    color: "taxy.ink",
    background: "#fff",
    boxShadow: "0 2px 8px rgb(18 20 26 / 0.09)",
  },
  "& button[data-active=true] b": { background: "taxy.amber" },
  "& button:focus-visible": { outline: "3px solid", outlineColor: "taxy.amber" },
});

const gestureView = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  padding: "22px 20px 24px",
  overflow: "hidden",
  touchAction: "none",
  userSelect: "none",
  cursor: "grab",
  _active: { cursor: "grabbing" },
  _focusVisible: { outline: "3px solid", outlineColor: "taxy.amber", outlineOffset: "-3px" },
});

const steeringView = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  padding: "22px 20px 24px",
  overflowY: "auto",
  _focusVisible: { outline: "3px solid", outlineColor: "taxy.amber", outlineOffset: "-3px" },
});

const sortingView = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  padding: "22px 20px 18px",
  overflow: "hidden",
  touchAction: "none",
  userSelect: "none",
  _focusVisible: { outline: "3px solid", outlineColor: "taxy.amber", outlineOffset: "-3px" },
});

const progress = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "& > span": {
    fontFamily: "display",
    fontSize: "0.72rem",
    fontWeight: "800",
  },
  "& > div": { display: "flex", gap: "5px" },
  "& i": {
    width: "25px",
    height: "5px",
    borderRadius: "99px",
    background: "rgb(18 20 26 / 0.13)",
  },
  "& i[data-state=done]": { background: "taxy.ink" },
  "& i[data-state=current]": { background: "taxy.amber" },
});

const gestureIntro = css({
  marginTop: "25px",
  textAlign: "center",
  "& span": {
    color: "taxy.body",
    fontSize: "0.62rem",
    fontWeight: "700",
    letterSpacing: "0.07em",
  },
  "& p": {
    margin: "6px 0 0",
    color: "taxy.body",
    fontSize: "0.69rem",
  },
});

const directionLabels = css({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "42px",
  color: "taxy.body",
  fontSize: "0.73rem",
  fontWeight: "700",
  "& span": {
    padding: "7px 10px",
    borderRadius: "99px",
    background: "rgb(18 20 26 / 0.06)",
  },
  "& span[data-active=true]": { color: "taxy.ink", background: "taxy.amber" },
});

const questionCard = css({
  minHeight: "230px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "14px",
  padding: "28px 24px",
  border: "1px solid rgb(18 20 26 / 0.1)",
  borderRadius: "25px",
  textAlign: "center",
  background: "#fff",
  boxShadow: "0 16px 34px rgb(18 20 26 / 0.08)",
  willChange: "transform",
  "& p": {
    margin: "0 0 13px",
    color: "taxy.body",
    fontSize: "0.65rem",
    fontWeight: "700",
  },
  "& h1": { margin: 0, fontSize: "1.42rem", lineHeight: 1.5 },
  "& small": {
    marginTop: "15px",
    color: "taxy.body",
    fontSize: "0.67rem",
    lineHeight: 1.6,
  },
});

const gestureMeter = css({
  position: "relative",
  width: "72%",
  height: "5px",
  margin: "22px auto 0",
  borderRadius: "99px",
  background: "rgb(18 20 26 / 0.1)",
  "& span": {
    position: "absolute",
    top: 0,
    height: "100%",
    borderRadius: "99px",
    background: "taxy.amber",
  },
  "& span[data-side=left]": { right: "50%" },
  "& span[data-side=right]": { left: "50%" },
  "& i": {
    position: "absolute",
    top: "-3px",
    left: "calc(50% - 5px)",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "taxy.ink",
  },
});

const steeringQuestion = css({
  flex: 1,
  minHeight: "190px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "28px 18px",
  textAlign: "center",
  "& p": {
    margin: "0 0 12px",
    color: "taxy.body",
    fontSize: "0.65rem",
    fontWeight: "700",
  },
  "& h1": { margin: 0, fontSize: "1.42rem", lineHeight: 1.5 },
  "& small": {
    marginTop: "14px",
    color: "taxy.body",
    fontSize: "0.67rem",
    lineHeight: 1.6,
  },
});

const steeringPanel = css({
  padding: "18px 17px 14px",
  borderRadius: "22px",
  background: "#fff",
  boxShadow: "0 12px 30px rgb(18 20 26 / 0.08)",
  "& > p": {
    margin: "13px 0 0",
    color: "taxy.body",
    fontSize: "0.6rem",
    textAlign: "center",
  },
});

const steeringLabels = css({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 5px 10px",
  color: "taxy.body",
  fontSize: "0.68rem",
  fontWeight: "700",
  "& span[data-active=true]": { color: "taxy.ink" },
});

const steeringTrack = css({
  position: "relative",
  height: "64px",
  borderRadius: "99px",
  background:
    "linear-gradient(90deg, #dedad2 0%, #efebe5 40%, #efebe5 60%, token(colors.taxy.amber) 100%)",
  touchAction: "none",
  cursor: "ew-resize",
});

const trackCenter = css({
  position: "absolute",
  top: "11px",
  bottom: "11px",
  left: "50%",
  width: "2px",
  background: "rgb(18 20 26 / 0.15)",
});

const steeringKnob = css({
  position: "absolute",
  top: "7px",
  left: "calc(50% - 25px)",
  width: "50px",
  height: "50px",
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  color: "#fff",
  background: "taxy.ink",
  boxShadow: "0 5px 13px rgb(18 20 26 / 0.24)",
  willChange: "transform",
  "& span": { fontSize: "1rem", fontWeight: "700" },
});

const cardTray = css({
  position: "relative",
  flex: 1,
  minHeight: "225px",
  display: "grid",
  placeItems: "center",
  marginTop: "8px",
});

const stackCount = css({
  position: "absolute",
  width: "78%",
  height: "170px",
  "& i": {
    position: "absolute",
    inset: 0,
    border: "1px solid rgb(18 20 26 / 0.1)",
    borderRadius: "20px",
    background: "#e8e3db",
  },
});

const sortingCard = css({
  position: "relative",
  zIndex: 2,
  width: "82%",
  minHeight: "180px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "22px 20px",
  border: "1px solid rgb(18 20 26 / 0.1)",
  borderRadius: "20px",
  textAlign: "center",
  background: "#fff",
  boxShadow: "0 13px 28px rgb(18 20 26 / 0.1)",
  cursor: "grab",
  willChange: "transform",
  _active: { cursor: "grabbing" },
  "& p": {
    margin: "0 0 10px",
    color: "taxy.body",
    fontSize: "0.62rem",
    fontWeight: "700",
  },
  "& h1": { margin: 0, fontSize: "1.12rem", lineHeight: 1.5 },
  "& small": {
    marginTop: "14px",
    color: "taxy.body",
    fontSize: "0.61rem",
  },
});

const dropZones = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  height: "102px",
  "& div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "2px dashed rgb(18 20 26 / 0.18)",
    borderRadius: "17px",
    color: "taxy.body",
    background: "rgb(18 20 26 / 0.03)",
  },
  "& div[data-active=true]": {
    borderColor: "taxy.amber",
    color: "taxy.ink",
    background: "#fff4d5",
  },
  "& span": { fontSize: "1.1rem" },
  "& strong": { fontSize: "0.67rem" },
});

const footerHint = css({
  minHeight: "45px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "12px",
  marginTop: "auto",
  paddingTop: "12px",
  "& button": {
    padding: "7px 0",
    border: 0,
    color: "taxy.body",
    background: "transparent",
    fontSize: "0.62rem",
    cursor: "pointer",
  },
  "& p": {
    margin: 0,
    color: "taxy.body",
    fontSize: "0.59rem",
    textAlign: "right",
  },
});

const result = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px 27px 40px",
  overflowY: "auto",
  textAlign: "center",
  "& > p": {
    margin: "0 0 20px",
    color: "taxy.body",
    fontSize: "0.66rem",
    fontWeight: "700",
  },
  "& > div": {
    width: "64px",
    height: "64px",
    display: "grid",
    placeItems: "center",
    borderRadius: "22px",
    background: "taxy.amber",
    fontFamily: "display",
    fontSize: "1.9rem",
    fontWeight: "800",
  },
  "& h1": { margin: "18px 0 0", fontSize: "1.62rem", lineHeight: 1.4 },
  "& > span": {
    marginTop: "12px",
    color: "taxy.body",
    fontSize: "0.76rem",
    lineHeight: 1.7,
  },
  "& > small": {
    width: "100%",
    marginTop: "23px",
    padding: "11px 13px",
    borderRadius: "11px",
    color: "taxy.body",
    background: "rgb(18 20 26 / 0.05)",
    fontSize: "0.6rem",
  },
  "& > button": {
    width: "100%",
    minHeight: "52px",
    marginTop: "28px",
    border: 0,
    borderRadius: "15px",
    color: "#fff",
    background: "taxy.ink",
    fontWeight: "700",
    cursor: "pointer",
  },
  "& > button:focus-visible": {
    outline: "3px solid",
    outlineColor: "taxy.amber",
    outlineOffset: "2px",
  },
});

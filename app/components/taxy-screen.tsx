import { css } from "styled-system/css";
import { useState } from "react";

type Answer = boolean;

export function TaxyScreen() {
  const [income, setIncome] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [questionNumber, setQuestionNumber] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  let question = "";

  if (questionNumber === 0) {
    question = "昨年の年収（給与収入）を入力してください";
  } else if (questionNumber === 1) {
    question = "昨年働いたことのあるバイト先は1か所ですか？";
  } else if (questionNumber === 2 && answers[1] === true) {
    question = "バイト先で年末調整をしましたか？（扶養控除等（異動）申告書を出しましたか？）";
  } else if (questionNumber === 2 && answers[1] === false) {
    question = "どこかのバイト先で年末調整をしましたか？（扶養控除等（異動）申告書を出しましたか？）";
  } else if (questionNumber === 3 && answers[1] === true) {
    question = "バイト先以外で稼いだ所得は20万円以下ですか？";
  } else if (questionNumber === 3 && answers[1] === false) {
    question = "年末調整をしていない全てのバイト先の収入と、バイト先以外で稼いだお金の合計は20万円以下ですか？";
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (income.trim() === "") return;
    setQuestionNumber(1);
  };

  const answerQuestion = (answer: Answer) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionNumber]: answer,
    }));

    if (questionNumber === 1) {
      setQuestionNumber(2);
      return;
    }

    if (questionNumber === 2) {
      if (answer === false) {
        setResult("確定申告必要");
      } else {
        setQuestionNumber(3);
      }
      return;
    }

    if (answers[1] === true) {
      setResult(answer ? "確定申告必要" : "確定申告不要");
    } else {
      setResult(answer ? "確定申告不要" : "確定申告必要");
    }
  };

  const resetAll = () => {
    setIncome("");
    setAnswers({});
    setQuestionNumber(0);
    setResult(null);
  };

  return (
    <div className={screen}>
      <header className={status}>
        
      </header>

      <main className={body}>
        
        <h1 className={logo}>TAXY</h1>
        <p className={tagline}>税金って、​意外と​知らない​ことだらけ。<br/>​「自分には​何が​必要？」<br/>が​サクッと​分かる​サービスです。​</p>

        <div className={questionaire}>
          {result ? (
            <div className={result_container}>
              <h2>{result}</h2>
              <button onClick={resetAll} className={button}>
                もう一度診断する
              </button>
            </div>
          ) : questionNumber === 0 ? (
            <form onSubmit={handleIncomeSubmit} className={form_wrapper}>
              <h2>{question}</h2>
              <div className={input_wrapper}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="例: 1030000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className={input_field}
                  autoFocus
                  required
                />
                <span className={input_unit}>円</span>
              </div>
              <button
                type="submit"
                disabled={income.trim() === ""}
                className={button}
              >
                次へ
              </button>
            </form>
          ) : (
            <>
              <h2>{question}</h2>
              <div className={button_wrapper}>
                <button onClick={() => answerQuestion(true)} className={button}>はい</button>
                <button onClick={() => answerQuestion(false)} className={button}>いいえ</button>
              </div>
            </>
          )}
        </div>

      </main>
      

    </div>
  );
}

const screen = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background:
    "linear-gradient(180deg, #ffffff)",
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

const button_wrapper = css({
  display: "flex",
  gap: "1.2rem",
})

const eyebrow = css({
  margin: 0,
  fontSize: "0.7rem",
  fontWeight: "600",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "taxy.muted",
});


const questionaire = css({
  margin: 2,
  flex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  textAlign: "center",
})

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
  maxWidth: "18rem",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  color: "taxy.body",
});

const form_wrapper = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.2rem",
  width: "100%",
});

const input_wrapper = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.6rem",
  margin: "0.5rem 0",
});

const input_field = css({
  padding: "0.8rem 1.2rem",
  fontSize: "1.2rem",
  fontWeight: "600",
  borderRadius: "14px",
  border: "2px solid",
  borderColor: "taxy.muted",
  background: "#fff",
  color: "taxy.ink",
  width: "180px",
  textAlign: "right",
  outline: "none",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  transition: "all 0.2s ease",
  _focus: {
    borderColor: "taxy.amber",
    boxShadow: "0 0 0 3px rgba(240, 180, 41, 0.35)",
  },
});

const input_unit = css({
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "taxy.ink",
});

const button = css({
  padding: "0.7rem 2.2rem",
  fontSize: "1.1rem",
  fontWeight: "700",
  borderRadius: "9999px",
  background: "taxy.ink",
  color: "taxy.cream",
  border: "none",
  cursor: "pointer",
  transition: "all 0.15s ease",
  _hover: {
    opacity: 0.85,
    transform: "scale(1.02)",
  },
  _active: {
    transform: "scale(0.98)",
  },
  _disabled: {
    opacity: 0.35,
    cursor: "not-allowed",
    transform: "none",
  },
});

const result_container = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.2rem",
});


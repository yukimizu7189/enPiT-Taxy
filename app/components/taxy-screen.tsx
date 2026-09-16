import { css } from "styled-system/css";
import { useState } from "react";

type Answer = boolean;

export function TaxyScreen() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [questionNumber, setQuestionNumber] = useState(1);
  const [result, setResult] = useState<string | null>(null);

  let question = "";

  if (questionNumber === 1) {
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

  return (
    <div className={screen}>
      <header className={status}>
        
      </header>

      <main className={body}>
        
        <h1 className={logo}>TAXY</h1>
        <p className={tagline}>税金って、​意外と​知らない​ことだらけ。<br/>​「自分には​何が​必要？」<br/>が​サクッと​分かる​サービスです。​</p>

        <div className={questionaire}>
          {result ? (
            <h2>{result}</h2>
          ) : (
            <>
              <h2>{question}</h2>
              <div className={button_wrapper}>
                <button onClick={() => answerQuestion(true)}>はい</button>
                <button onClick={() => answerQuestion(false)}>いいえ</button>
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

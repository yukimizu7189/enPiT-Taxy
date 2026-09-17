import { css } from "styled-system/css";
import { useState } from "react";

export interface TaxyAnswers {
  // 金額 (円)
  partTimeIncome: string; // Q1: アルバイト給料
  otherIncomeProfit: string; // Q2-1: アルバイト以外の利益
  unadjustedIncome: string; // Q4-2: 年末調整していないバイト先からの給料合計
  allowanceAmount: string; // Q6-2: 年間仕送り額

  // フラグ (YES / NO)
  hasOtherIncome: boolean | null; // Q2: アルバイト以外でお金を稼いだか
  isAge19to22: boolean | null; // Q3: 今年の12月31日時点で19歳以上23歳未満か
  hasMultipleJobs: boolean | null; // Q4: アルバイト先は2か所以上あるか
  didYearEndAdjustment: boolean | null; // Q4-1: 年末調整をしたか
  isCoveredByInsurance: boolean | null; // Q5: 保護者の健康保険の扶養に入っているか
  isLivingWithParents: boolean | null; // Q6: 保護者と一緒に暮らしているか
  isIncomeLessThanHalfParent: boolean | null; // Q6-1: 保護者の年収の半分を下回っているか
}

type StepKey =
  | "1"
  | "2"
  | "2-1"
  | "3"
  | "4"
  | "4-1"
  | "4-2"
  | "5"
  | "6"
  | "6-1"
  | "6-2"
  | "result";

type QuestionConfig = {
  stepNumber: string;
  text: string;
  type: "amount" | "boolean";
  amountField?: keyof Pick<
    TaxyAnswers,
    "partTimeIncome" | "otherIncomeProfit" | "unadjustedIncome" | "allowanceAmount"
  >;
  placeholder?: string;
};

const QUESTIONS: Record<Exclude<StepKey, "result">, QuestionConfig> = {
  "1": {
    stepNumber: "1",
    text: "今年、アルバイトでもらう給料は全部でいくらくらいになりそうですか？",
    type: "amount",
    amountField: "partTimeIncome",
    placeholder: "例: 1030000",
  },
  "2": {
    stepNumber: "2",
    text: "アルバイト以外でお金を稼ぎましたか？",
    type: "boolean",
  },
  "2-1": {
    stepNumber: "2-1",
    text: "そこから得た利益はいくらですか？",
    type: "amount",
    amountField: "otherIncomeProfit",
    placeholder: "例: 200000",
  },
  "3": {
    stepNumber: "3",
    text: "今年の12月31日時点で19歳以上23歳未満ですか？",
    type: "boolean",
  },
  "4": {
    stepNumber: "4",
    text: "アルバイト先は2か所以上ありますか？",
    type: "boolean",
  },
  "4-1": {
    stepNumber: "4-1",
    text: "年末調整をしましたか？",
    type: "boolean",
  },
  "4-2": {
    stepNumber: "4-2",
    text: "年末調整していないバイト先からもらった給料の合計はいくらですか？",
    type: "amount",
    amountField: "unadjustedIncome",
    placeholder: "例: 150000",
  },
  "5": {
    stepNumber: "5",
    text: "今、保護者の健康保険の扶養に入っていますか？",
    type: "boolean",
  },
  "6": {
    stepNumber: "6",
    text: "保護者と一緒に暮らしていますか？",
    type: "boolean",
  },
  "6-1": {
    stepNumber: "6-1",
    text: "今年稼いだ金額は、保護者の年収の半分を下回っていますか？",
    type: "boolean",
  },
  "6-2": {
    stepNumber: "6-2",
    text: "保護者から年間いくらくらい仕送りを受けていますか？",
    type: "amount",
    amountField: "allowanceAmount",
    placeholder: "例: 600000",
  },
};

const initialAnswers: TaxyAnswers = {
  partTimeIncome: "",
  otherIncomeProfit: "",
  unadjustedIncome: "",
  allowanceAmount: "",
  hasOtherIncome: null,
  isAge19to22: null,
  hasMultipleJobs: null,
  didYearEndAdjustment: null,
  isCoveredByInsurance: null,
  isLivingWithParents: null,
  isIncomeLessThanHalfParent: null,
};

export function TaxyScreen() {
  const [answers, setAnswers] = useState<TaxyAnswers>(initialAnswers);
  const [step, setStep] = useState<StepKey>("1");
  const [amountInput, setAmountInput] = useState<string>("");

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountInput.trim() === "") return;

    const currentConfig = QUESTIONS[step as Exclude<StepKey, "result">];
    const field = currentConfig.amountField;
    const value = amountInput.trim();

    if (field) {
      setAnswers((prev) => ({ ...prev, [field]: value }));
    }
    setAmountInput("");

    if (step === "1") {
      setStep("2");
    } else if (step === "2-1") {
      setStep("3");
    } else if (step === "4-2") {
      setStep("5");
    } else if (step === "6-2") {
      setStep("result");
    }
  };

  const handleBooleanAnswer = (value: boolean) => {
    if (step === "2") {
      setAnswers((prev) => ({ ...prev, hasOtherIncome: value }));
      if (value) {
        setStep("2-1");
      } else {
        setStep("3");
      }
    } else if (step === "3") {
      setAnswers((prev) => ({ ...prev, isAge19to22: value }));
      setStep("4");
    } else if (step === "4") {
      setAnswers((prev) => ({ ...prev, hasMultipleJobs: value }));
      setStep("4-1");
    } else if (step === "4-1") {
      setAnswers((prev) => ({ ...prev, didYearEndAdjustment: value }));
      if (answers.hasMultipleJobs === true) {
        setStep("4-2");
      } else {
        setStep("5");
      }
    } else if (step === "5") {
      setAnswers((prev) => ({ ...prev, isCoveredByInsurance: value }));
      setStep("6");
    } else if (step === "6") {
      setAnswers((prev) => ({ ...prev, isLivingWithParents: value }));
      if (value) {
        setStep("6-1");
      } else {
        setStep("6-2");
      }
    } else if (step === "6-1") {
      setAnswers((prev) => ({ ...prev, isIncomeLessThanHalfParent: value }));
      setStep("result");
    }
  };

  const resetAll = () => {
    setAnswers(initialAnswers);
    setAmountInput("");
    setStep("1");
  };

  const currentQuestion = step !== "result" ? QUESTIONS[step] : null;

  return (
    <div className={screen}>
      <header className={status}>
        
      </header>

      <main className={body}>
        <h1 className={logo}>TAXY</h1>
        <p className={tagline}>
          税金って、​意外と​知らない​ことだらけ。<br />
          ​「自分には​何が​必要？」<br />
          が​サクッと​分かる​サービスです。​
        </p>

        <div className={questionaire}>
          {step === "result" ? (
            <div className={result_container}>
              <h2>診断完了</h2>
              <p className={tagline}>回答が完了しました。（判定ロジック準備中）</p>
              <button onClick={resetAll}>もう一度診断する</button>
            </div>
          ) : currentQuestion ? (
            currentQuestion.type === "amount" ? (
              <form onSubmit={handleAmountSubmit} className={form_wrapper}>
                <h2>{currentQuestion.text}</h2>
                <div className={input_wrapper}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder={currentQuestion.placeholder ?? "例: 100"}
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className={input_field}
                    autoFocus
                    required
                  />
                  <span className={input_unit}>円</span>
                </div>
                <button type="submit" disabled={amountInput.trim() === ""}>
                  次へ
                </button>
              </form>
            ) : (
              <>
                <h2>{currentQuestion.text}</h2>
                <div className={button_wrapper}>
                  <button onClick={() => handleBooleanAnswer(true)}>はい</button>
                  <button onClick={() => handleBooleanAnswer(false)}>いいえ</button>
                </div>
              </>
            )
          ) : null}
        </div>
      </main>
    </div>
  );
}

const screen = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: "#ffffff",
});

const status = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 28px 0",
  fontSize: "0.8rem",
  fontWeight: "600",
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
  maxWidth: "18rem",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  color: "taxy.body",
});

const form_wrapper = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.9rem",
  width: "100%",
});

const input_wrapper = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.6rem",
  margin: "0.2rem 0",
});

const input_field = css({
  padding: "0.7rem 1.1rem",
  fontSize: "1.2rem",
  fontWeight: "600",
  borderRadius: "12px",
  border: "2px solid",
  borderColor: "taxy.muted",
  background: "#fff",
  color: "taxy.ink",
  width: "240px",
  textAlign: "right",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
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

const result_container = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.75rem",
});

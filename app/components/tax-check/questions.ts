export type TaxAnswer = "yes" | "no";

export type TaxQuestion = {
  id: string;
  eyebrow: string;
  prompt: string;
  detail: string;
  choices: Record<TaxAnswer, { label: string; shortLabel: string }>;
};

export const taxQuestions: TaxQuestion[] = [
  {
    id: "side-income",
    eyebrow: "収入について",
    prompt: "アルバイト以外にも、収入がありましたか？",
    detail: "フリマ、動画配信、業務委託なども含みます。",
    choices: {
      yes: { label: "ほかの収入もあった", shortLabel: "あった" },
      no: { label: "アルバイトだけだった", shortLabel: "なかった" },
    },
  },
  {
    id: "multiple-jobs",
    eyebrow: "働き方について",
    prompt: "同じ年に、2か所以上でアルバイトをしましたか？",
    detail: "途中でバイト先を変えた場合も含みます。",
    choices: {
      yes: { label: "2か所以上で働いた", shortLabel: "はい" },
      no: { label: "1か所だけで働いた", shortLabel: "いいえ" },
    },
  },
  {
    id: "year-end-adjustment",
    eyebrow: "年末調整について",
    prompt: "勤務先で年末調整をしてもらいましたか？",
    detail: "分からない場合は、源泉徴収票を確認してみましょう。",
    choices: {
      yes: { label: "年末調整をした", shortLabel: "した" },
      no: { label: "していない・分からない", shortLabel: "していない" },
    },
  },
  {
    id: "income-tax",
    eyebrow: "源泉徴収について",
    prompt: "給与から所得税が引かれていましたか？",
    detail: "給与明細の「所得税」欄で確認できます。",
    choices: {
      yes: { label: "所得税が引かれていた", shortLabel: "引かれていた" },
      no: { label: "引かれていなかった", shortLabel: "引かれていない" },
    },
  },
  {
    id: "deductions",
    eyebrow: "控除について",
    prompt: "医療費や寄付金など、申告したい支出がありますか？",
    detail: "この質問は還付を受けられる可能性の確認です。",
    choices: {
      yes: { label: "申告したい支出がある", shortLabel: "ある" },
      no: { label: "特にない", shortLabel: "ない" },
    },
  },
];

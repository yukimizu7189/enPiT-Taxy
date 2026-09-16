import type { Route } from "./+types/home";
import { PhoneFrame } from "../components/phone-frame";
import { TaxyScreen } from "../components/taxy-screen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TAXY — 確定申告チェック" },
    {
      name: "description",
      content: "大学生のアルバイター向け確定申告チェックのUX比較モック",
    },
  ];
}

export default function Home() {
  return (
    <PhoneFrame>
      <TaxyScreen />
    </PhoneFrame>
  );
}

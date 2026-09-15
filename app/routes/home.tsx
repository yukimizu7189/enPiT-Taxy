import type { Route } from "./+types/home";
import { PhoneFrame } from "../components/phone-frame";
import { TaxyScreen } from "../components/taxy-screen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TAXY — モックアップ" },
    { name: "description", content: "TAXY スマホアプリのモックアップサイト" },
  ];
}

export default function Home() {
  return (
    <PhoneFrame>
      <TaxyScreen />
    </PhoneFrame>
  );
}

import type { Route } from "./+types/home";
import { PhoneFrame } from "../components/phone-frame";
import { TaxyScreen } from "../components/taxy-screen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TAXY" },
    { name: "description", content: "TAXY 確定申告って必要なの？" },
  ];
}

export default function Home() {
  return (
    <PhoneFrame>
      <TaxyScreen />
    </PhoneFrame>
  );
}

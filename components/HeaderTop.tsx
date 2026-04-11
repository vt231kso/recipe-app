import { auth } from "@/auth";
import HeaderTopClient from "./HeaderTopClient";

export default async function HeaderTop() {
  const session = await auth();

  return <HeaderTopClient session={session} />;
}

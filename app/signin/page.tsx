import { redirect } from "next/navigation";

export default function SigningRedirectPage() {
  redirect("/login");
}
import Providers from "@/components/Providers";
import Dashboard from "./dashboard/Dashboard";
import LoginPage from "./login/Login";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Providers>
        {session && <Dashboard />}
        <LoginPage />
      </Providers>
    </>
  );
}

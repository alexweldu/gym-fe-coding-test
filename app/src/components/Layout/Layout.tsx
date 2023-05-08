import { useSession } from "next-auth/react";
import Head from "next/head";
import SideMenu from "../SideMenu/SideMenu";
import style from "./Layout.module.scss";
const Layout = (props: any) => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Byte Kitchen</title>
      </Head>
      <main className={style.layout}>
        {session && <SideMenu />}
        {props.children}
      </main>
    </>
  );
};

export default Layout;

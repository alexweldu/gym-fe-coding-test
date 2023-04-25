import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <h1>Byte Kitchen FE coding test (Gym admin page)</h1>
      <p>
        The front-end developers should use the Nextjs application inside the
        app. They should then use MUI-5 for the UI components and SWR for
        communicating with the API data.
      </p>
      <li>
        The front-end should allow users to:
        <ul>Log in to a gym and get a JWT token</ul>
        <ul>Create a new member for the authenticated gym</ul>
        <ul>Get all members of the authenticated gym</ul>
        <ul>Get a specific member of the authenticated gym by ID</ul>
        <ul>
          There is not specific requirement for the UI but please make it
          pleasant for the eye🤩
        </ul>
      </li>
      <h3>Good luck!💫</h3>
    </>
  );
}

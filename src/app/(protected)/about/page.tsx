import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto shadow-xl">
      <h1 className="text-4xl">About</h1>
      <p className="text-xl">
        <strong className="text-3xl">typeshi</strong> - WPM (words per minute)
        test counter that is built on
        <em> Next js, MongoDB, Tailwind, Zustand</em>. The app provides 3 modes:{" "}
        <strong>
          &apos;sentence&apos;, &apos;quote&apos;, &apos;words&apos;
        </strong>{" "}
        with different amount of time - 15, 30, 60, 120 seconds. At the profile
        page user can see the best score, average score and recent tests. As
        inspiration I stole{" "}
        <Link href="https://monkeytype.com/" className="underline">
          monkeytype
        </Link>{" "}
        design and{" "}
        <Link href="https://play.typeracer.com/" className="underline">
          typeracer
        </Link>{" "}
        game functionality.
      </p>
      <h1 className="text-4xl">Experience & thoughts</h1>
      <p className="text-xl">
        This is actually my first Next js app, so I didn&apos;t really dive into
        rendering strategies, but enjoyed the rest features. Spent the most of
        time building my first custom authentication with JWTs - access and
        refresh tokens. Used axios interceptor to catch expired access tokens
        and refresh them. Probably should have used NextAuth, because axios is
        not really compatible option for Next js. Nowadays fetch API is more
        useful due to its recent extenstions implemented by Next js team, for
        example cache feature, revalidation.
      </p>
      <p className="text-xl">
        I definitely improved my fullstack skills while developing this project.
        I also learned how to use state managers like Zustand for global state,
        and useReducer for local state. To enhance this app I should probably
        make profile, dashboard pages to be server components because there are
        a fewer DOM interactions. And maybe use URL as a state manager.
      </p>
      <h1 className="text-4xl">Challenges</h1>
      <p className="text-xl">
        The cursor thing and fixed size of the window at the game page
        wasn&apos;t easy. Spend good amount of time to figure out how I can
        stick that cursor to charIndex. Struggled a little bit with backspaces
        in a game itself because there can be different cases. Now I am trying
        to extend axios instance in order to take requests from both client and
        server side.
      </p>
    </div>
  );
}

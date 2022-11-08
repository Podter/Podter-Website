import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { useWindowSize } from "react-use";
import { Menu } from "lucide-react";
import Link from "next/link";

import ThemeButton from "./ThemeButton";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function Navbar() {
  const ref = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [mousePosX, setMousePosX] = useState(0);
  const [mousePosY, setMousePosY] = useState(0);
  const { width, height } = useWindowSize();

  return (
    <div className="navbar fixed bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/#home">Home</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/#skills">Skills</Link>
            </li>
            <li>
              <Link href="/#projects">Projects</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link
          href="/#home"
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
          onMouseMove={(e) => {
            setMousePosX(e.clientX);
            setMousePosY(e.clientY);
          }}
          className="btn btn-ghost normal-case text-xl text-ctp-red"
        >
          Podter
        </Link>
      </div>
      <div className="navbar-end">
        <ThemeButton />
      </div>
      <Confetti
        style={{ pointerEvents: "none" }}
        numberOfPieces={mouseDown ? 200 : 0}
        initialVelocityX={50}
        initialVelocityY={-50}
        ref={ref}
        gravity={0.05}
        width={width}
        height={height}
        confettiSource={{
          w: 0,
          h: 0,
          x: mousePosX,
          y: mousePosY,
        }}
        recycle={mouseDown ? true : false}
        tweenDuration={10}
      />
    </div>
  );
}
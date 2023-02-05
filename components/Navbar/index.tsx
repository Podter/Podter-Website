import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";
import menus from "@/lib/menus";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState, MouseEvent } from "react";
import { useWindowSize } from "react-use";
import { useRouter } from "next/router";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function Navbar() {
  const confettiRef = useRef(null);

  const { width, height } = useWindowSize();
  const router = useRouter();

  const [confetti, setConfetti] = useState(false);
  const [mousePosX, setMousePosX] = useState(0);
  const [mousePosY, setMousePosY] = useState(0);

  function navClick(event: MouseEvent) {
    if (window.scrollY <= 90 && router.route == "/") {
      setMousePosX(event.clientX);
      setMousePosY(event.clientY);

      setConfetti(true);
      setTimeout(() => setConfetti(false), 100);
    }
  }

  return (
    <nav className="navbar bg-base-100 z-50 mx-auto max-w-4xl px-8 my-20">
      <div className="flex-none">
        <label
          htmlFor="menu-drawer"
          className="btn btn-ghost btn-circle drawer-button md:hidden"
        >
          <Menu className="h-6 w-6" size={24} />
        </label>
      </div>
      <div className="flex-1">
        <Link
          onClick={navClick}
          href="/"
          className="btn btn-ghost normal-case text-xl font-bold bg-gradient-to-r hover:text-transparent from-ctp-red to-ctp-blue bg-clip-text transition-colors duration-75 hover:duration-300"
        >
          Podter
        </Link>
        <ul className="menu menu-horizontal px-1 md:inline-flex hidden">
          {menus.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="duration-75">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-none">
        <ThemeSwitch />
      </div>
      <Confetti
        style={{ pointerEvents: "none" }}
        numberOfPieces={confetti ? 200 : 0}
        initialVelocityX={50}
        initialVelocityY={-50}
        ref={confettiRef}
        gravity={0.05}
        width={width}
        height={height}
        confettiSource={{
          w: 0,
          h: 0,
          x: mousePosX,
          y: mousePosY,
        }}
        recycle={confetti ? true : false}
        tweenDuration={10}
      />
    </nav>
  );
}
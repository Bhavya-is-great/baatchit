"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🔹 global toggle (false = bottom, true = top)
let lastDirectionTop = false;

const PageTransition = ({ children, setMenu, href, pageName, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = async (e) => {
    e.preventDefault();
    if (setMenu) setMenu(false);
    if (pathname === href) return;

    const element = document.getElementById("transition");
    const textElement = document.getElementById("transition-text");
    if (!element) return;

    if (textElement) {
      textElement.innerText = pageName || "";
    }

    // 🔹 Remove old classes
    element.classList.remove("transition-in", "transition-out", "enter-bottom", "enter-top");

    // 🔹 Decide direction alternately
    const direction = lastDirectionTop ? "enter-bottom" : "enter-top";
    element.classList.add(direction);

    // Flip for next time
    lastDirectionTop = !lastDirectionTop;

    // Step 1: bring overlay into view
    element.classList.add("transition-in");

    await sleep(500);
    router.push(href);

    element.classList.remove("transition-out");

    // Step 2: exit in opposite direction
    await sleep(500);
    element.classList.remove("transition-in");
    element.classList.add("transition-out");
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default PageTransition;
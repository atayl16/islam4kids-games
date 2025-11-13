import { useEffect } from "react";

export const IslamicTheme = () => {
  useEffect(() => {
    // Load Arabic font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Amiri&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return null;
};

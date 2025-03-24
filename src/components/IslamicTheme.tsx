import { useEffect } from "react";

export const IslamicTheme = () => {
  useEffect(() => {
    // Load Arabic font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Amiri&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Set viewport meta tag for mobile
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.prepend(meta);
  }, []);

  return null;
};

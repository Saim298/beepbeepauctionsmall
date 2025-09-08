import { useEffect } from "react";

const RedirectToComingSoon = () => {
  useEffect(() => {
    window.location.href = "/coming-soon";
  }, []);

  return null;
};

export default RedirectToComingSoon;

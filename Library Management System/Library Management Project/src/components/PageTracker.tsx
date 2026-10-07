import { useUIStore } from "@/store/uiStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTracker = () => {
  const location = useLocation();
  const setLastVisitedPage = useUIStore((state) => state.setLastVisitedPage);

  // console.log(location);

  useEffect(() => {
    setLastVisitedPage(location.pathname);
  }, [location.pathname, setLastVisitedPage]);

  return null;
};

export default PageTracker;

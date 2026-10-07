import { useEffect, useState } from "react"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  
    //  if we don't have cleanup then for every previous searchText searching will happen
    return () => {
      clearTimeout(timer);
    }
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce

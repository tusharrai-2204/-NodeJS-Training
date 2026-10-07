import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {

  // read value from localStorage. The function is for lazy initialization  
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  // whenever the parent will call setter => value will change => localStorage will be updated
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  // just like useState(val, setVal) => to set the val to the localStorage
  const setter = (newValue: T) => {
    setValue(newValue);
  }

  return [value, setter];
}

export default useLocalStorage
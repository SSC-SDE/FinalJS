export function useLocalStorageState(initialState, key) {
  let value = loadFromLocalStorage();
  
  function loadFromLocalStorage() {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  }

  function saveToLocalStorage(newValue) {
    value = newValue; // Update the internal value
    localStorage.setItem(key, JSON.stringify(value));
  }

  return [() => value, saveToLocalStorage];
}

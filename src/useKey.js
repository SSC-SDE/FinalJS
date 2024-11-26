export function useKey(key, action) {
  // Add event listener on document for the specified key
  function callback(e) {
    if (e.code.toLowerCase() === key.toLowerCase()) {
      action();
    }
  }

  // Initialize the listener
  document.addEventListener("keydown", callback);

  // Return a cleanup function to remove the event listener
  return function cleanup() {
    document.removeEventListener("keydown", callback);
  };
}

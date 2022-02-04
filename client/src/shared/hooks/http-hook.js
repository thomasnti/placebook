import React, {useState, useEffect, useCallback, useRef} from 'react';

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]); //* σε περίπτωση που πριν ολοκληρωθεί ένα request στείλω άλλο

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
    debugger
    setIsLoading(true);
    const httpAbortController = new AbortController();
    activeHttpRequests.current.push(httpAbortController);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortController.signal
      });
  
      const responseData = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController);
  
      //* If HTTP code is 4** or 5**
      if (!response.ok) {
        throw new Error(responseData.message);
      }
  
      setIsLoading(false);

      return responseData;
    } catch (error) {
      setError(error.message || 'Something went wrong :( , please try again.');
      setIsLoading(false);
      throw error; // me to throw Error paei kai ektelei to catch block tou component pou kalei thn sendRequest
    }
  }, []); //* with useCallback this func never gets recreated when the comp that uses it re-renders, so we avoid infinite loops

  const clearError = () => {
    setError(null);
  };

 // (Clenup logic) runs when the component that uses the useHttp hook unmounts
 useEffect(() => {
  return () => {
    activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
  };
}, []);

  return {isLoading, error, sendRequest, clearError};
}

export default useHttp;

import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('shopsmart_compare');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopsmart_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length >= 4) {
      alert('You can compare a maximum of 4 products at a time.');
      return false;
    }
    const productId = product._id || product;
    if (!compareList.some((p) => (p._id || p) === productId)) {
      setCompareList([...compareList, product]);
      return true;
    }
    return false;
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter((p) => (p._id || p) !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some((p) => (p._id || p) === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        compareCount: compareList.length,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

import React, { useContext, useEffect } from 'react';
import MainPage from '@/components/MainPage/MainPage';
import { CurrencyContext } from './_app';

const demo = () => {
  const { setCurrency } = useContext(CurrencyContext);

  useEffect(() => {
    // set currency manually for demo account
    setCurrency('USD');
  }, []);

  return <MainPage demo={true} />;
};

export default demo;

import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import BigNumber from "bignumber.js";
import PageState from "../../components/PageState";
import {useContext} from "../../context";
import LedgerLogin from "../../components/Login/Ledger";
import WalletLogin from "../../components/Login/Wallet";
import {addresses, Crowdfund} from '../../contracts';

const Home = () => {
  const {loading, error, loggedIn, dapp} = useContext();
  const [, setRaised] = useState(new BigNumber(0));
  const [, setValueLoading] = useState(true);
  const ref = React.useRef(null);

  useEffect(() => {
    const crowdfundContract = new Crowdfund(addresses["delegation_smart_contract"], dapp.proxy);
    crowdfundContract.currentFunds().then((value: BigNumber) => {
      setRaised(value);
    }).catch(err => console.warn(err))
      .finally(() => setValueLoading(false));
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <div ref={ref} className="d-flex flex-fill align-items-center container">
      {
        error ?
          <PageState
            svgComponent={<FontAwesomeIcon icon={faBan} className="text-secondary fa-3x" />}
            title="Unavailable"
            className="dapp-icon icon-medium"
          /> :
        loggedIn ?
          <Redirect to="/dashboard" /> :
        loading ?
          <PageState svgComponent={<></>} spin /> :

          <div className="row w-100 d-flex flex-column login__container">
            <h1 className="text-center">Welcome to our Delegation Dashboard App</h1>
            <LedgerLogin />
            <WalletLogin />
          </div>
      }
    </div>
  )
};

export default Home;

import React, { Suspense } from 'react';
import { baseTheme } from 'themes';
import { GlobalStyle } from './GlobalStyle';
import { Providers } from './Providers';
import { Redirect, Route, Switch } from 'react-router';
import { ActionModals } from './components/ActionModals';
import { EthBridge } from './pages/EthBridge';
import { SwapPageWrapper } from './pages/Swap';
import { SwapPagePool } from './pages/Pool';
import { InfoModal } from './components/InfoModal';
import { SeFiPage } from './pages/SeFi';
import { Cashback } from './pages/Cashback'
import { Governance } from 'pages/Governance';
import CreateProposal from 'pages/CreateProposal';
import { DetailProposal } from 'pages/DetailProposal';
import SefiStaking from 'pages/SefiStaking';
import { Migration } from 'pages/Migration';
import BuyCrypto  from 'pages/BuyCrypto';
import './notifications.css'
export const App: React.FC = () => (
  <Providers>
    <Suspense fallback={<div />}>
      <Switch>
        <Route exact path="/swap" component={SwapPageWrapper} />
        <Route exact path="/pool" component={SwapPagePool} />
        <Route exact path="/earn" component={SeFiPage} />
        <Route exact path="/cashback" component={Cashback} />
        <Route exact path="/governance" component={Governance} />
        <Route exact path="/proposal" component={CreateProposal} />
        <Route exact path="/proposal/:id" component={DetailProposal} />
        <Route exact path="/sefistaking" component={SefiStaking} />
        <Route exact path="/migration" component={Migration} />
        <Route exact path="/buy" component={BuyCrypto} />
        <Route exact path="/:token/operations/:operationId" component={EthBridge} />
        <Redirect to="/swap" />
      </Switch>
    </Suspense>
    <ActionModals />
    <InfoModal />
    <GlobalStyle theme={...baseTheme as any} />
  </Providers>
);

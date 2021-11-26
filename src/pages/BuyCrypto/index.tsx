import React, { useState } from 'react';
import { BaseContainer, PageContainer } from 'components';
import { ConvertCoin } from './components';
import { observer } from 'mobx-react';
import { useStores } from 'stores';
import { unlockToken, valueToDecimals } from 'utils';
import { unlockJsx } from 'components/Header/utils';
import { notify } from '../../blockchain-bridge/scrt/utils';
import './style.scss';

const BuyCrypto = observer(() => {
  const { theme, user } = useStores();
  const [amountSCRT, setAmountSCRT] = useState<string>('');
  const [amountSSCRT, setAmountSSCRT] = useState<string>('');
  const [sscrtLoading, setSSCRTLoading] = useState<boolean>(false);
  const [scrtLoading, setSCRTLoading] = useState<boolean>(false);

  async function wrapSCRT() {
    try {
      setSCRTLoading(true);
      const amount_convert = valueToDecimals(amountSCRT, '6');
      const res = await user.secretjsSend.execute(process.env.SSCRT_CONTRACT, { deposit: {} }, '', [
        { denom: 'uscrt', amount: amount_convert },
      ]);
      // TODO: update balances after transaction completed
      // await user.getBalances();
      notify('success', 'converted ');
    } catch (error) {
      notify('error', error);
    } finally {
      setAmountSCRT('');
      setSCRTLoading(false);
    }
  };

  async function unwrapSCRT() {
    try {
      setSSCRTLoading(true);
      const amount_convert = valueToDecimals(amountSSCRT, '6');
      const res = await user.secretjsSend.execute(process.env.SSCRT_CONTRACT, { redeem: { amount: amount_convert } });
      // TODO: update balances after transaction completed
      await user.updateSScrtBalance();
      await user.updateScrtBalance();
      notify('success', 'converted ');
    } catch (error) {
      notify('error', error);
    } finally {
      setAmountSSCRT('');
      setSSCRTLoading(false);
    }
  };

  const createSSCRTViewingKey = async () => {
    try {
      await user.keplrWallet.suggestToken(user.chainId, process.env.SSCRT_CONTRACT);
      await user.updateSScrtBalance();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BaseContainer>
      <PageContainer>
        <main className={`${theme.currentTheme} buy-base-container`}>
          <section className="balances-container">
            <div>
              <p>SCRT Balance</p>
              <p>
                <strong>{user.balanceSCRT}</strong>
              </p>
            </div>
            <div>
              <p>sSCRT Balance</p>
              <p>
                {unlockToken === user.balanceToken[process.env.SSCRT_CONTRACT] ? (
                  unlockJsx({ onClick: createSSCRTViewingKey })
                ) : (
                  <strong>{user.balanceToken[process.env.SSCRT_CONTRACT]}</strong>
                )}
              </p>
            </div>
          </section>
          <section className="buy-convert-grid">
            <div className="transak-container">
              <h1>Buy</h1>
              <div>
                <iframe
                  height="650"
                  width="450"
                  title="Transak On/Off Ramp Widget (Website)"
                  src={process.env.TRANSAK_URL}
                  frameBorder="no"
                  allowTransparency={true}
                  allowFullScreen={false}
                />
              </div>
            </div>
            <div className="convert-container">
              <h1>Convert</h1>
              <ConvertCoin
                title="Wrap"
                description="Convert SCRT to sSCRT, the privacy preserving version of SCRT."
                theme={theme.currentTheme}
                learn_link=""
                // decimals 0 because it's already converted
                token={{ balance: user.balanceSCRT, symbol: 'SCRT', decimals: 0 }}
                onSubmit={wrapSCRT}
                amount={amountSCRT}
                loading={scrtLoading}
                setAmount={setAmountSCRT}
              />
              <ConvertCoin
                createVK={createSSCRTViewingKey}
                style={{ marginTop: '30px' }}
                title="Unwrap"
                description="Convert sSCRT to SCRT, Secret Network's native public token."
                theme={theme.currentTheme}
                learn_link=""
                token={{ balance: user.balanceToken[process.env.SSCRT_CONTRACT], symbol: 'sSCRT', decimals: 6 }}
                onSubmit={unwrapSCRT}
                amount={amountSSCRT}
                loading={sscrtLoading}
                setAmount={setAmountSSCRT}
              />
            </div>
          </section>
        </main>
      </PageContainer>
    </BaseContainer>
  );
});

export default BuyCrypto;

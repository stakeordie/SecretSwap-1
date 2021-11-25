import React, { useState } from 'react';
import { BaseContainer, PageContainer } from 'components';
import { ConvertCoin } from './components';
import { observer } from 'mobx-react';
import { useStores } from 'stores';
import './style.scss';

const BuyCrypto = observer(() => {
  const { theme } = useStores();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const onConvert = () => {
    alert('Transaction made')
    setAmount(0)
  };

  return (
    <BaseContainer>
      <PageContainer>
        <main className={`${theme.currentTheme} buy-base-container`}>
          <section>balances here</section>
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
                token={{ balance: '5408912', symbol: 'SCRT', decimals: 6 }}
                onConvert={onConvert}
                amount={amount}
                loading={loading}
                setAmount={setAmount}
              />
            </div>
          </section>
        </main>
      </PageContainer>
    </BaseContainer>
  );
});

export default BuyCrypto;

import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { divDecimals } from 'utils';
import './style.scss';

const ConvertCoin = ({
  title,
  theme,
  learn_link,
  description,
  token,
  amount,
  loading,
  onConvert,
  setAmount,
}: ConvertCoinProps) => {
  const isDark = theme == 'dark';
  const setWithdrawPercentage = (n: number) => {
    const a = parseFloat(token.balance);
    if (isNaN(a) || !a) {
      return;
    }
    setAmount(parseFloat(divDecimals(a * n, token.decimals)));
  };

  return (
    <div className={`${theme} convert-wrapper`}>
      <h2>{title}</h2>
      <p className="description">{description}</p>
      <p className="convert-learn-more">
        <a href={learn_link}>Click here to learn more</a>
      </p>
      <section className="contenas">
        <div className="row">
          <p>Available</p>
          <p>{`${divDecimals(token.balance,token.decimals)} ${token.symbol}`}</p>
        </div>
        <Input
          inverted={isDark}
          className="convert-input"
          type="number"
          size="big"
          value={amount}
          onChange={e => {
            if (isNaN(parseFloat(e.target.value)) || isNaN(parseFloat(token.balance)) || !token.balance) {
              return;
            }

            setAmount(parseFloat(divDecimals(e.target.value, token.decimals)));
          }}
        />
        <div className="row">
          <Button inverted={isDark} basic onClick={() => setWithdrawPercentage(0.25)}>
            25%
          </Button>
          <Button inverted={isDark} basic onClick={() => setWithdrawPercentage(0.5)}>
            50%
          </Button>
          <Button inverted={isDark} basic onClick={() => setWithdrawPercentage(0.75)}>
            75%
          </Button>
          <Button inverted={isDark} basic onClick={() => setWithdrawPercentage(1)}>
            100%
          </Button>
        </div>
        <Button loading={loading} inverted={isDark} secondary={!isDark} onClick={onConvert}>
          {title}
        </Button>
      </section>
    </div>
  );
};

export default ConvertCoin;

interface ConvertCoinProps {
  title: string;
  description: string;
  theme: string;
  learn_link: string;
  loading: boolean;
  token: {
    balance: string;
    symbol: string;
    decimals: number;
  };
  amount: number;
  setAmount: (n: number) => void;
  onConvert: () => void;
}

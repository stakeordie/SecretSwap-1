import { unlockJsx } from 'components/Header/utils';
import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { formatWithSixDecimals, unlockToken } from 'utils';
import './style.scss';

const FEE = 0.04;

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  balance: string;
}

const ConvertCoin = ({
  title,
  theme,
  learn_link,
  description,
  token,
  amount,
  loading,
  style,
  createVK,
  onSubmit,
  setAmount,
}: ConvertCoinProps) => {
  const isDark = theme == 'dark';

  const setWithdrawPercentage = (n: number) => {
    const a = parseFloat(token.balance);
    if (isNaN(a) || !a) {
      return;
    }
    let amount_formatted = parseFloat(formatWithSixDecimals(a * n));

    if (token.symbol == 'SCRT' && n == 1) {
      //take out the fee
      setAmount((amount_formatted - FEE).toFixed(6));
    } else {
      setAmount(amount_formatted.toFixed(token.decimals));
    }
  };

  return (
    <div style={style} className={`${theme} convert-wrapper`}>
      <h2>{title}</h2>
      <p className="description">{description}</p>
      <p className="convert-learn-more">
        <a href={learn_link}>Click here to learn more</a>
      </p>
      <section className="contenas">
        <div className="row">
          <p>Available</p>
          {token.balance == unlockToken || !token.balance ? (
            <p>
              {unlockJsx({ onClick: createVK })} {token.symbol}
            </p>
          ) : (
            <p>{`${token.balance} ${token.symbol}`}</p>
          )}
        </div>
        <Input
          inverted={isDark}
          placeholder="0"
          className="convert-input"
          type="number"
          size="large"
          value={amount}
          onChange={e => {
            // if(e.target.value)
            // if (isNaN(parseFloat(e.target.value)) || isNaN(parseFloat(token.balance)) || !token.balance) {
            //   return;
            // }

            setAmount(e.target.value);
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
        <Button loading={loading} inverted={isDark} secondary={!isDark} onClick={onSubmit}>
          {title}
        </Button>
      </section>
    </div>
  );
};

export default ConvertCoin;

interface ConvertCoinProps {
  title: string;
  description: string | JSX.Element;
  theme: string;
  learn_link: string;
  loading: boolean;
  token:Token;
  amount: string;
  style?: {};
  createVK?: () => void;
  setAmount: (n: string) => void;
  onSubmit: () => void;
}

import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { StakeCard } from '../components/StakeCard';

import { NFTCard } from '../components/NFTCard'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NFT Mint & Stake</title>
        <meta name="description" content="NFT Mint and Staking DApp" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            NFT Mint & Stake
          </div>
          <ConnectButton />
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.grid}>
          <NFTCard />
          <StakeCard />
        </div>
      </main>
    </div>
  );
};

export default Home;

import { useReadContract, useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { abi } from '../abi/myNFTABI.json'
import { MintButton } from '../components/MintButton'
import styles from '../styles/components/NFTCard.module.css'

const CONTRACT_ADDRESS = '0xa4E57E6E5794cF6a2D5b05F64ebC16B9740E5760'

export function NFTCard() {
  const { address, isConnected } = useAccount()

  const { data: CurrentPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getCurrentPrice',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  const { data: RemainingMints } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getRemainingMints',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>MyNFT Collection</h2>
      <div className={styles.info}>
        <p>合约地址: {CONTRACT_ADDRESS}</p>
        {isConnected ? (
          <>
            <p>价格: {CurrentPrice ? (Number(CurrentPrice) / 1e18).toString() : '-'} ETH</p>
            <p>剩余mint次数: {RemainingMints?.toString()}</p>
            <MintButton />
          </>
        ) : (
          <>
            <p>请连接钱包查看更多信息</p>
            <ConnectButton />
          </>
        )}
      </div>
    </div>
  )
}
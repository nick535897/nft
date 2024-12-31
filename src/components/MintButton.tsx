import { useWriteContract, useAccount, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import { abi } from '../abi/myNFTABI.json' 
import styles from '../styles/components/MintButton.module.css'

const CONTRACT_ADDRESS = '0xa4E57E6E5794cF6a2D5b05F64ebC16B9740E5760'

export function MintButton() {
    const { address, isConnected } = useAccount()
    const { writeContract, isPending, isError } = useWriteContract()

    const { data: currentPrice } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getCurrentPrice',
      args: [address || '0x0000000000000000000000000000000000000000'],
    })
  
    const handleMint = async () => {
      if (!isConnected) {
        alert('请先连接钱包')
        return
      }
  
      try {
        console.log('准备Mint...')
        console.log('当前价格:', currentPrice)
        
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: abi,
          functionName: 'mintNFT',
          args: [address],
          value: currentPrice ? BigInt(currentPrice.toString()) : undefined
        })
      } catch (error) {
        console.error('Mint失败:', error)
        alert(`Mint失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
  
    return (
      <button 
        onClick={handleMint}
        disabled={!isConnected || isPending}
        className={`${styles.mintButton} ${isPending ? styles.loading : ''}`}
      >
        {isPending ? 'Minting...' : 'Mint NFT'}
      </button>
    )
}
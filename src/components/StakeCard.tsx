import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { Dialog, DialogTitle } from '@headlessui/react'
import { abi as stakingABI } from '../abi/nftStakingABI.json'
import { abi as nftABI } from '../abi/myNFTABI.json'
import styles from '../styles/components/StakeCard.module.css'

const NFT_CONTRACT = '0xa4E57E6E5794cF6a2D5b05F64ebC16B9740E5760'
const STAKING_CONTRACT = '0xB4b2F9294bA4c0A0Bc96ab322C14CcC11D0534AF'

export function StakeCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTokenId, setSelectedTokenId] = useState<number>()
    const [error, setError] = useState<string>('')
    const { address, isConnected } = useAccount()
    const { writeContract, isPending } = useWriteContract()

    // 检查授权
    const { data: isApproved } = useReadContract({
        address: NFT_CONTRACT,
        abi: nftABI,
        functionName: 'isApprovedForAll',
        args: [address || '0x0000000000000000000000000000000000000000', STAKING_CONTRACT],
    })

    // 授权函数
    const handleApprove = async () => {
        try {
            setError('')
            await writeContract({
                address: NFT_CONTRACT,
                abi: nftABI,
                functionName: 'setApprovalForAll',
                args: [STAKING_CONTRACT, true],
            })
        } catch (error) {
            console.error('授权失败:', error)
            setError('授权失败，请重试')
        }
    }

    // 质押函数
    const handleStake = async (tokenId: number) => {
        try {
            setError('')
            if (!isApproved) {
                await handleApprove()
            }
            await writeContract({
                address: STAKING_CONTRACT,
                abi: stakingABI,
                functionName: 'stake',
                args: [tokenId],
            })
            setIsOpen(false)
        } catch (error) {
            console.error('质押失败:', error)
            setError('质押失败，请确保已授权并重试')
        }
    }

    // 获取用户NFT余额
    const { data = [] as bigint[] } = useReadContract<typeof nftABI, 'tokensOfOwner', bigint[]>({
        address: NFT_CONTRACT,
        abi: nftABI,
        functionName: 'tokensOfOwner',
        args: [address || '0x0000000000000000000000000000000000000000'],
    })

    const balance = data as bigint[]



    return (
        <div className={styles.card}>
            <h2 className={styles.title}>NFT Staking</h2>
            <button
                onClick={() => setIsOpen(true)}
                className={styles.stakeButton}
                disabled={!isConnected}
            >
                质押 NFT
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className={styles.dialog}
            >
                <div className={styles.dialogPanel}>
                    <DialogTitle className={styles.dialogTitle}>选择要质押的 NFT</DialogTitle>
                    <div className={styles.nftGrid}>
                        {balance?.map((tokenId: bigint) => (
                            <div
                                key={tokenId.toString()}
                                className={`${styles.nftItem} ${selectedTokenId === Number(tokenId) ? styles.selected : ''
                                    }`}
                                onClick={() => setSelectedTokenId(Number(tokenId))}
                            >
                                TokenID: {tokenId.toString()}
                            </div>
                        ))}
                    </div>
                    <div className={styles.dialogActions}>
                        <button
                            onClick={() => selectedTokenId && handleStake(selectedTokenId)}
                            disabled={!selectedTokenId || isPending}
                            className={styles.confirmButton}
                        >
                            {isPending ? '质押中...' : '确认质押'}
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
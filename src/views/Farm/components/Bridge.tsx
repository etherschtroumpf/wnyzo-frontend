import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { Contract } from 'web3-eth-contract'

import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import { AddIcon, RemoveIcon } from '../../../components/icons'
import IconButton from '../../../components/IconButton'
import Label from '../../../components/Label'
import Value from '../../../components/Value'

import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'

import { getBalanceNumber } from '../../../utils/formatBalance'

import BridgeModal from './BridgeModal'

import imageUniswap from '../../../assets/img/logo.png'

interface StakeProps {
  tokenContract: Contract
  pid: number
  tokenName: string
}

const Stake: React.FC<StakeProps> = ({ tokenContract, pid, tokenName }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useAllowance(tokenContract)
  const { onApprove } = useApprove(tokenContract)

  const tokenBalance = useTokenBalance(tokenContract.options.address)

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const [onPresentWithdraw] = useModal(
    <BridgeModal
      max={tokenBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon><img src={imageUniswap} height="50" style={{ marginTop: -4 }} /></CardIcon>
            <Value value={getBalanceNumber(tokenBalance)} />
            <Label text={`${tokenName} Tokens Staked`} />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                variant={'secondary'}
                onClick={handleApprove}
                text={`Approve ${tokenName}`}
              />
            ) : (
              <>
                <Button
                    disabled={tokenBalance.eq(new BigNumber(0))}
                    text="Bridge"
                    border
                    variant={'secondary'}
                    onClick={onPresentWithdraw}
                />
                <StyledActionSpacer />
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Stake

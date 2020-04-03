import React from 'react';
import styled from 'styled-components';
import { UnsupportedChainIdError } from '@web3-react/core';
import { Activity } from 'react-feather';
import { observer } from 'mobx-react';
import { shortenAddress } from 'utils/address';
import WalletModal from 'components/WalletModal';
import { Spinner } from 'theme';
import Circle from 'assets/images/circle.svg';
import {
    injected,
    isChainIdSupported,
    web3ContextNames,
} from 'provider/connectors';
import Identicon from '../Identicon';
import { useStores } from '../../contexts/storesContext';
import Web3PillBox from '../Web3PillBox';

const ConnectButton = styled.div`
    height: 38px;
    width: 154px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 0.9rem;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 1px;

    cursor: pointer;
    user-select: none;
    
    padding: 0.5rem;
    border-image: initial;
    background: var(--blue-text);
    color: var(--white);
    border: 1px solid var(--active-button-border);
    box-sizing: border-box;
    border-radius: 6px;
    &:hover{
        cursor: pointer;
        background: var(--blue-onHover);
        border: 1px solid var(--blue-onHover-border);
    }

`;

const Web3StatusGeneric = styled.button`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    font-size: 0.9rem;
    align-items: center;
    padding: 0.5rem;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    :focus {
        outline: none;
    }
`;

const WarningIcon = styled.img`
    width: 22px;
    height: 26px;
    margin-right: 0px;
    color: var(--warning);
`;

const Web3StatusError = styled(Web3StatusGeneric)`
    background-color: var(--panel);
    border: 1px solid var(--warning);
    color: ${({ theme }) => theme.white};
    font-weight: 500;
`;

const Text = styled.p`
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0.5rem 0 0.25rem;
    font-size: 0.83rem;
`;



const NetworkIcon = styled(Activity)`
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
`;

const SpinnerWrapper = styled(Spinner)`
    margin: 0 0.25rem 0 0.25rem;
`;

const Web3ConnectStatus = observer(() => {
    const {
        root: { modalStore, transactionStore, providerStore },
    } = useStores();
    const {
        chainId,
        active,
        connector,
        error,
    } = providerStore.getActiveWeb3React();
    const { account, chainId: injectedChainId } = providerStore.getWeb3React(
        web3ContextNames.injected
    );

    const contextNetwork = providerStore.getWeb3React(web3ContextNames.backup);

    if (!chainId) {
        throw new Error('No chain ID specified');
    }

    let pending = undefined;
    let confirmed = undefined;
    let hasPendingTransactions = false;

    if (account && isChainIdSupported(injectedChainId)) {
        pending = transactionStore.getPendingTransactions(account);
        confirmed = transactionStore.getConfirmedTransactions(account);
        hasPendingTransactions = !!pending.length;
    }

    const toggleWalletModal = () => {
        modalStore.toggleWalletModal();
    };

    // handle the logo we want to show with the account
    function getStatusIcon() {
        if (connector === injected) {
            return <Identicon />;
        }
    }

    function getWeb3Status() {
        console.log('[GetWeb3Status]', {
            account,
            isChainIdSupported: isChainIdSupported(injectedChainId),
            error,
        });
        // Wrong network
        if (account && !isChainIdSupported(injectedChainId)) {
            return (
                <Web3StatusError onClick={toggleWalletModal}>
                    <WarningIcon src="WarningSign.svg" />
                    <Text>Wrong Network</Text>
                </Web3StatusError>
            );
        } else if (account) {
            return (
                <Web3PillBox onClick={toggleWalletModal}>
                    {hasPendingTransactions && (
                        <SpinnerWrapper src={Circle} alt="loader" />
                    )}
                    {getStatusIcon()}
                    {shortenAddress(account)}
                </Web3PillBox>
            );
        } else if (error) {
            return (
                <Web3StatusError onClick={toggleWalletModal}>
                    <NetworkIcon />
                    <Text>
                        {error instanceof UnsupportedChainIdError
                            ? 'Wrong Network'
                            : 'Error'}
                    </Text>
                </Web3StatusError>
            );
        } else {
            return (
                <ConnectButton
                    onClick={toggleWalletModal}
                    active={true}
                    >
                    Connect Wallet
                </ConnectButton>
                
            );
        }
    }

    if (!contextNetwork.active && !active) {
        return null;
    }

    return (
        <>
            {getWeb3Status()}
            <WalletModal
                pendingTransactions={pending}
                confirmedTransactions={confirmed}
            />
        </>
    );
});

export default Web3ConnectStatus;

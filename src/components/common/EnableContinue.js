import React from 'react';
import styled from 'styled-components';
import store from '../../stores/Root';

const ContentWrapper = styled.div`
    height: 200px;
    padding: 6px 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const CircleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    border-radius: 24px;
    border: 1px solid var(--panel-icon-2);
    margin-bottom: 16px;
`;

const Checkbox = styled.img`
    height: 13px;
    width: 18px;
`;

const Info = styled.div`
    //font-family: SF Pro Text;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.4px;
    color: var(--panel-text);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 8px;
`;

const Status = styled.div`
    // font-family: SF Pro Text;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.4px;
    color: var(--turquois-text);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 27px;
`;

const EnableButton = styled.div`
    background-color: #536dfe;
    border: 1px solid #304ffe;
    border-radius: 4px;
    color: white;
    text-align: center;
    height: 34px;
    line-height: 34px;
    text-transform: uppercase;
    cursor: pointer;
`;

const EnableContinue = ({ tokenType }) => {
    const Button = ({ tokenType }) => {
        if (tokenType === 'TKN') {
            return (
                <EnableButton
                    onClick={() => {
                        store.tradingStore.enableTKNState = 4;
                    }}
                >
                    Continue
                </EnableButton>
            );
        } else if (tokenType === 'DXD') {
            return (
                <EnableButton
                    onClick={() => {
                        store.tradingStore.enableDXDState = 4;
                    }}
                >
                    Continue
                </EnableButton>
            );
        }
    };

    return (
        <ContentWrapper>
            <CircleContainer>
                <CheckboxContainer>
                    <Checkbox src="checkbox_758AFE.svg" />
                </CheckboxContainer>
            </CircleContainer>
            <Info>Enable {tokenType} for trading</Info>
            <Status>Confirmed</Status>
            <Button tokenType={tokenType}>Continue</Button>
        </ContentWrapper>
    );
};

export default EnableContinue;

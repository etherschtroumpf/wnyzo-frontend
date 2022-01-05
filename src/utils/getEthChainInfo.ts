export const getEthChainInfo = () => {
    let chainId: number = 4002;
    let rpcUrl: string = 'https://rpc.testnet.fantom.network/';
    let ethscanType: string = 'testnet.';
    const href = window.location.href;
    if (/\/\/farm.lto.network/.test(href)) {
         chainId = 250;
         rpcUrl = 'https://rpc.ftm.tools/';
         ethscanType = '';
    }
    return {
        chainId,
        rpcUrl,
        ethscanType
    }
};

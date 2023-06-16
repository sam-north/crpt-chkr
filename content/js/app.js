let finalBalanceInBTC, finalBTCBalanceInUSD, finalBalanceInETH, finalETHBalanceInUSD, finalBalanceUSD, nowDate;

function get(){
    finalBalanceInBTC, finalBTCBalanceInUSD, finalBalanceInETH, finalETHBalanceInUSD, finalBalanceUSD, nowDate;

    function fetchBTCBalances() {
        const addresses = vars.btcAddresses;
        const btcExchangeRateUrl = `https://blockchain.info/ticker`;
        const apiAddressBalancesUrl = `https://blockchain.info/multiaddr?active=${addresses.join("|")}`;
    
        function getWalletAmountsInBTC(latestUSDExchangeRate){
            fetch(apiAddressBalancesUrl)
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
            })
            .then(json => {
                finalBalanceInBTC = `0.${json.wallet.final_balance}`;
                finalBTCBalanceInUSD = (+finalBalanceInBTC * +latestUSDExchangeRate).toFixed(2);
    
                document.getElementById('btc-total-usd').textContent= `${finalBalanceInBTC} | $${finalBTCBalanceInUSD}`;
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            });
        }
    
        function calculateTotalAmount(){
            fetch(btcExchangeRateUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                getWalletAmountsInBTC(json["USD"].last);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        calculateTotalAmount();
    }
    fetchBTCBalances();
    
    function fetchETHBalances(){
        const addresses = vars.ethAddresses;
        var apiKey = vars.etherscanApiKey;
        const ethExchangeRateUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKey}`;
        const apiAddressBalancesUrl = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${addresses.join(",")}&tag=latest&apikey=${apiKey}`;
    
        function getWalletAmountsInETH(latestUSDExchangeRate){
            fetch(apiAddressBalancesUrl)
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
            })
            .then(json => {
                let weibalance;
                for (let i = 0; i < json.result.length; i++) {
                    const account = json.result[i];
                    if (i === 0) weibalance = +account.balance;
                    else weibalance += +account.balance;
                }
                finalBalanceInETH = +weibalance / +1000000000000000000;
                finalETHBalanceInUSD = (+finalBalanceInETH * +latestUSDExchangeRate).toFixed(2);
    
                document.getElementById('eth-total-usd').textContent= `${finalBalanceInETH} | $${finalETHBalanceInUSD}`;
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            });
        }
    
        function calculateTotalAmount(){
            fetch(ethExchangeRateUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                getWalletAmountsInETH(json["result"].ethusd);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        calculateTotalAmount();
    
    }
    fetchETHBalances();

    function padLeftIfLessThanX(value, digitsToPad, characterToPad){
        if (digitsToPad == null || digitsToPad == undefined)
            digitsToPad = +2 - `${value}`.length;
        if (characterToPad == null || characterToPad == undefined)
            characterToPad = `0`;

        if (+digitsToPad > +0) {
            var paddedDigits = '';
            for (let i = 0; i < digitsToPad; i++)
                paddedDigits += `${characterToPad}`;
            return `${paddedDigits}${value}`;
        }
        return `${value}`;
    }
    
    let usdTotalInterfal = setInterval(() => {
        if (finalBTCBalanceInUSD && finalETHBalanceInUSD){
            finalBalanceUSD = (+finalBTCBalanceInUSD + +finalETHBalanceInUSD).toFixed(2);
            nowDate = new Date();
            document.getElementById('total-usd').textContent= `$${finalBalanceUSD}`;

            dformat = [padLeftIfLessThanX(nowDate.getMonth()+1),
                padLeftIfLessThanX(nowDate.getDate()),
                nowDate.getFullYear()].join('/')+' '+
               [padLeftIfLessThanX(nowDate.getHours()),
                padLeftIfLessThanX(nowDate.getMinutes()),
                padLeftIfLessThanX(nowDate.getSeconds())].join(':');
            document.getElementById('updated-time').textContent= `${dformat}`;
            clearInterval(usdTotalInterfal);
        }
    }, 1000);
}


get();
let refreshInterval = setInterval(() => {
    get();
}, 60 * 1000);
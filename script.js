const cryptoList = document.getElementById('crypto-list');
const searchInput = document.getElementById('search-input');
const refreshBtn = document.getElementById('refresh-btn');

let allCoins = []; // Global store for search filtering

// 1. Function to Fetch Data from CoinGecko API
async function fetchMarketData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        const data = await response.json();
        allCoins = data;
        displayCoins(allCoins);
    } catch (error) {
        cryptoList.innerHTML = `<div class="loading" style="color:red">Error fetching data. API limit might be reached. Try again in 1 minute.</div>`;
    }
}

// 2. Function to Render Coins to the UI
function displayCoins(coins) {
    cryptoList.innerHTML = ''; // Clear current list

    if (coins.length === 0) {
        cryptoList.innerHTML = `<div class="loading">No coins found matching your search.</div>`;
        return;
    }

    coins.forEach(coin => {
        const isUp = coin.price_change_percentage_24h > 0;
        
        const card = document.createElement('div');
        card.className = 'coin-card';
        card.innerHTML = `
            <img src="${coin.image}" alt="${coin.name}" class="coin-icon">
            <div class="coin-name">${coin.name}</div>
            <div class="coin-symbol">${coin.symbol}</div>
            <div class="price">₹${coin.current_price.toLocaleString('en-IN')}</div>
            <div class="change ${isUp ? 'up' : 'down'}">
                ${isUp ? '▲' : '▼'} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </div>
        `;
        cryptoList.appendChild(card);
    });
}

// 3. Search Logic
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCoins = allCoins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm) || 
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    displayCoins(filteredCoins);
});

// 4. Manual Refresh
refreshBtn.addEventListener('click', () => {
    cryptoList.innerHTML = `<div class="loading">Updating Prices...</div>`;
    fetchMarketData();
});

// Initial Load
fetchMarketData();

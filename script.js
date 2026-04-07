const cryptoList = document.getElementById('crypto-list');
const searchInput = document.getElementById('search-input');
const refreshBtn = document.getElementById('refresh-btn');
const modal = document.getElementById('coin-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');

let allCoins = [];

// 1. Fetch Data from API
async function fetchMarketData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        const data = await response.json();
        allCoins = data;
        displayCoins(allCoins);
    } catch (error) {
        cryptoList.innerHTML = `<div class="loading" style="color:red">API LIMIT REACHED. PLEASE WAIT 1 MINUTE.</div>`;
    }
}

// 2. Render Grid
function displayCoins(coins) {
    cryptoList.innerHTML = ''; 

    coins.forEach(coin => {
        const isUp = coin.price_change_percentage_24h > 0;
        const card = document.createElement('div');
        card.className = 'coin-card';
        
        card.onclick = () => showCoinDetails(coin);

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

// 3. Modal Details
function showCoinDetails(coin) {
    modalDetails.innerHTML = `
        <div class="detail-header">
            <img src="${coin.image}" width="60">
            <div>
                <h2 style="font-family: 'Cinzel', serif; color: #d4af37;">${coin.name}</h2>
                <p style="color: #a0a0a0; font-size: 0.8rem;">Market Rank #${coin.market_cap_rank}</p>
            </div>
        </div>
        <div class="detail-grid">
            <div class="detail-item">
                <label>Current Value</label>
                <span>₹${coin.current_price.toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-item">
                <label>24h High</label>
                <span style="color: #00ff88;">₹${coin.high_24h.toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-item">
                <label>24h Low</label>
                <span style="color: #ff3366;">₹${coin.low_24h.toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-item">
                <label>Market Cap</label>
                <span>₹${(coin.market_cap / 10000000).toFixed(2)} Cr</span>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

// 4. Search and Close Logic
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allCoins.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || c.symbol.toLowerCase().includes(searchTerm)
    );
    displayCoins(filtered);
});

refreshBtn.onclick = fetchMarketData;
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; }

// Init
fetchMarketData();

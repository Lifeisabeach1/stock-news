const stockApiKey = '0AAP7L2NZU5XXB02'; 
const stockApiUrl = 'https://www.alphavantage.co/query';


const newsApiKey = '0AAP7L2NZU5XXB02'; 

document.querySelector('.search-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const query = document.getElementById('query').value.trim();
    if (query) {
        await fetchStockPrice(query);
        await fetchNews(query);
    }
});

async function fetchStockPrice(symbol) {
    const url = `${stockApiUrl}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${stockApiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data['Global Quote']) {
            displayStockPrice(data['Global Quote']);
        } else {
            throw new Error('Stock data not found');
        }
    } catch (error) {
        console.error('Error fetching stock price:', error);
        alert('Error fetching stock price. Please try again later.');
        
        const stockPriceContainer = document.querySelector('.stock-price-container');
        stockPriceContainer.innerHTML = '<p>Error fetching stock price. Please try again later.</p>';
    }
}

function displayStockPrice(stockData) {
    const stockPriceContainer = document.querySelector('.stock-price-container');
    stockPriceContainer.innerHTML = '';

    if (!stockData || !stockData['05. price']) {
        stockPriceContainer.innerHTML = '<p>No stock price data found.</p>';
        return;
    }

    const priceElement = document.createElement('div');
    priceElement.classList.add('stock-price');
    priceElement.innerHTML = `
        <p>Stock: ${stockData['01. symbol']}</p>
        <p>Price: $${parseFloat(stockData['05. price']).toFixed(2)}</p>
        <p>Change: ${parseFloat(stockData['10. change percent']).toFixed(2)}%</p>
    `;
    stockPriceContainer.appendChild(priceElement);
}

async function fetchNews(query) {
   
    const url = `${stockApiUrl}?function=NEWS_SENTIMENT&tickers=${encodeURIComponent(query)}&apikey=${newsApiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.feed) {  
            displayNews(data.feed);
        } else {
            throw new Error('News data not found');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        alert('Error fetching news. Please try again later.');
        
        const newsContainer = document.querySelector('.news-container');
        newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
    }
}

function displayNews(articles) {
    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = '';

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p>No articles found.</p>';
        return;
    }

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');

        articleElement.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.summary || ''}</p> <!-- Using 'summary' as Alpha Vantage might return this -->
            <a href="${article.url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(articleElement);
    });
}
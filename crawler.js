const axios = require('axios'); // For making HTTP requests  
const cheerio = require('cheerio'); // For parsing HTML  
const async = require('async'); // For handling asynchronous operations  

// Patterns to identify product URLs  
const productPatterns = [  
    /\/product\//i,  
    /\/item\//i,  
    /\/p\//i,  
    /\/products\//i,  
    /\/shop\/.+/i,  
];  

// Function to fetch product URLs from a given domain  
async function fetchProductUrls(domain) {  
    const productUrls = new Set(); // Use a Set to ensure uniqueness  
    const baseUrl = `http://${domain}`;  

    try {  
        const response = await axios.get(baseUrl);  
        const $ = cheerio.load(response.data);  

        // Find all anchor tags  
        $('a').each((_, element) => {  
            const href = $(element).attr('href');  
            if (href) {  
                const absoluteUrl = new URL(href, baseUrl).href;  
                // Check if the URL matches any product patterns  
                if (productPatterns.some(pattern => pattern.test(absoluteUrl))) {  
                    productUrls.add(absoluteUrl);  
                    console.log(`Found product URL: ${absoluteUrl}`); // Log found URL  
                }  
            }  
        });  
    } catch (error) {  
        console.error(`Error fetching URLs from ${domain}:`, error.message);  
    }  

    return Array.from(productUrls); // Return as an array  
}  

// Function to crawl multiple domains  
async function crawlDomains(domains) {  
    const results = {};  

    await async.eachLimit(domains, 5, async (domain) => {  
        console.log(`Crawling ${domain}...`);  
        const urls = await fetchProductUrls(domain);  
        results[domain] = urls;  
    });  

    return results;  
}  

// Function to verify URLs  
async function verifyUrls(urls) {  
    for (const url of urls) {  
        try {  
            const response = await axios.get(url);  
            // Check if the response is valid and contains expected content  
            if (response.status === 200 && response.data.includes('product')) {  
                console.log(`Valid product URL: ${url}`);  
            } else {  
                console.log(`Invalid product URL: ${url}`);  
            }  
        } catch (error) {  
            console.log(`Error accessing URL ${url}: ${error.message}`);  
        }  
    }  
}  

// Example usage  
const domains = [  
    "www.amazon.com",  
    "www.ebay.com",  
    "www.walmart.com",  
    "www.target.com",  
    "www.etsy.com",  
    "www.overstock.com",  
    "www.shopify.com"  
]; // Replace with actual e-commerce domains  

crawlDomains(domains).then(results => {  
    console.log(JSON.stringify(results, null, 2)); // Pretty print the results  
    // Verify the URLs found  
    for (const [domain, urls] of Object.entries(results)) {  
        console.log(`Verifying URLs for ${domain}`);  
        verifyUrls(urls);  
    }  
}).catch(error => {  
    console.error("Error during crawling:", error);  
});
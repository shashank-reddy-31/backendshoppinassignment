## Overview  

This project is a web crawler designed to discover and list all product URLs across various e-commerce websites. The crawler intelligently identifies product pages based on different URL patterns and provides a comprehensive output of found product URLs. It is built using Node.js and leverages libraries like Axios for HTTP requests and Cheerio for HTML parsing.  

## Features  

- **URL Discovery**: Identifies product URLs using specified patterns.  
- **Scalability**: Capable of crawling multiple domains simultaneously.  
- **Performance**: Executes requests in parallel to minimize runtime.  
- **Logging**: Provides detailed logs of found URLs and verification results.  
- **Validation**: Verifies that the gathered URLs lead to valid product pages.  

## Requirements  

- Node.js (version 12 or higher)  
- npm (Node package manager)  

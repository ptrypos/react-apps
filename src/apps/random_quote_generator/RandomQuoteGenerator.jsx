import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import './RandomQuoteGenerator.css'

function RandomQuoteGenerator() {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const generateQuote = async () => {
        setIsLoading(true);
        setError(null)

        try {
            const response = await fetch("https://dummyjson.com/quotes/random");
            
            if (!response.ok) {
                throw new Error("Couldn't fetch a quote right now.")
            }

            const data = await response.json();
            setQuote(data.quote);
            setAuthor(data.author);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false)
        }        
    }

    useEffect(() => {
        generateQuote();
    }, [])

    return (
        <div>
            <nav className='nav-bar'>
                <Link to='/' className='back-button'>
                    ← Back to Dashboard
                </Link>
                <h2 className='nav-title'>Random Quote Generator</h2>
                
                <div className='nav-spacer'></div>
            </nav>

            <div className='quote-workspace'>
                {error && <p className='err-message'>Error: {error}</p>}

                {!error && (
                    <div>
                        <p className='quote-data'>{quote}</p>
                        <p className='quote-data'>{author ? `- ${author}` : ''}</p>
                    </div>
                )}
                <button className='generate-btn' onClick={generateQuote} disabled={isLoading}>{isLoading ? "Fetching quote..." : "Generate New Quote"}</button>
            </div>
        </div>
    );
}

export default RandomQuoteGenerator;
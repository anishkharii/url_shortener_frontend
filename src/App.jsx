import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Clipboard, ClipboardCheck, X} from 'lucide-react'
import "./App.css";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clipboardButton, setClipboardButton] = useState(false);

  useEffect(() => {
    setError(false);
  }, [originalUrl]);
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      const res = await response.json();
      if (response.status === 400) {
        setError("Invalid URL");
        setLoading(false);
        return;
      }

      setShortUrl(res.short_url);
      setShowResult(true);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setClipboardButton(true);
    navigator.vibrate(200);
  };

  return (
    <div className="App min-h-screen flex flex-col items-center justify-center p-5 text-gray-800 relative">
      <header className="flex flex-col items-center mb-5">
        <h1 className="text-4xl font-serif font-bold text-blue-600">
          URL Shortener
        </h1>
        <p className="text-gray-600">A small microservice to shorten URLs</p>
      </header>

      <div className="form__container w-full max-w-md bg-white shadow-md p-6 rounded-lg">
        <form onSubmit={handleLinkSubmit} className="flex flex-col space-y-4">
          <input
            className="w-full p-3 rounded-md border border-gray-300"
            onChange={(e) => setOriginalUrl(e.target.value)}
            type="text"
            name="url"
            placeholder="Enter URL"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Shorten it!
          </button>
        </form>
      </div>

      {loading && <div className="loading text-blue-500 mt-4">Loading...</div>}
      {error && <div className="error text-red-500 mt-4">{error}</div>}

      <AnimatePresence>
        {showResult && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`result_page w-full max-w-md bg-white shadow-md p-8 rounded-lg mt-4 flex flex-col items-center absolute transition-transform duration-300 `}
          >
            <button
              onClick={() => setShowResult(false)}
              className="self-end text-red-500 font-bold"
            >
              <X/>
            </button>
            <div className="result__container flex flex-col items-left space-y-4 mt-4">
              <input
                type="text"
                name="originalurl"
                value={originalUrl}
                readOnly
                className="w-full p-3 rounded-md border border-gray-300"
              />
              <h3 className=" font-bold">Short URL:</h3>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">

                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="w-[20rem] p-3 rounded-md "
                />
                <button onClick={handleCopy} className=" bg-blue-600 text-white px-2">{
                  clipboardButton? <ClipboardCheck/>:<Clipboard/>
                }</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

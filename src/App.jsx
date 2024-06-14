import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, ClipboardCheck, X, History,Copy } from "lucide-react";
import "./App.css";

function App() {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copyUrl, setCopyUrl] = useState(false);

  useEffect(() => {
    const savedUrls = JSON.parse(localStorage.getItem("urls")) || [];
    setUrls(savedUrls);
  }, []);

  useEffect(() => {
    setError(false);
  }, [originalUrl]);
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (response.status === 400) {
        setError("Invalid URL");
        setLoading(false);
        return;
      }

      const res = await response.json();
      const timeStamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const urlObject = {
        ...res,
        created_at: timeStamp,
      };
      const updatedUrls = [urlObject, ...urls];
      setUrls(updatedUrls);
      localStorage.setItem("urls", JSON.stringify(updatedUrls));

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
    setCopyUrl(true);
    navigator.vibrate(100);

    setTimeout(() => {
      setCopyUrl(false);
    }, 3000);
  };

  return (
    <div className="App min-h-screen flex flex-col items-center justify-center p-5 text-gray-800 relative">
      <header className="flex items-center justify-around gap-5 mb-5 md:mb-10 ">
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-4xl font-serif font-bold text-blue-600">
            URL Shortener
          </h1>
          <p className="text-gray-600">A small microservice to shorten URLs</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition ease-in-out duration-300 " onClick={() => {
              setShowHistory(true);
              setShowResult(false);
            }}>
          <History
            
            className="text-gray-600 text-3xl "
          />
          <span className="text-gray-600 text-[12px]"> History</span>
        </div>
      </header>

      <div className="form__container w-full max-w-md bg-white shadow-md p-6 rounded-lg ">
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
        {showHistory && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`history_page w-[350px]  max-h-[80vh] text-[12px] lg:text-[15px] lg:w-[450px] overflow-hidden bg-white shadow-lg p-8 rounded-lg mt-4 flex flex-col items-center absolute transition-transform duration-300 `}
          >
            <button
              onClick={() => setShowHistory(false)}
              className="self-end text-red-500 font-bold"
            >
              <X />
            </button>
            <div className="history__container flex flex-col items-left">
              <h3 className=" font-bold text-lg">History</h3>
              <ul className="w-full flex flex-col gap-2 overflow-y-scroll h-[60vh]" style={{scrollBehavior:"smooth",transition:"scroll 1s ease-out"}}>
                {urls.map((url, index) => (
                  <li
                    key={index}
                    className="w-full p-3 rounded-md border border-gray-300 flex flex-col hover:bg-gray-100 transition ease-in-out duration-300"     
                  >
                      <p onClick={()=>{ window.open(url.original_url, "_blank")}} className="cursor-pointer hover:underline">{url.original_url}</p>
                      <p className="text-blue-600 flex gap-2 items-center justify-left"><span className="cursor-pointer hover:underline transition ease-in-out duration-300" onClick={() => window.open(url.short_url, "_blank")}>{url.short_url}</span>
                      <button onClick={handleCopy}>
                      <Copy className="cursor-pointer size-5 hover:text-blue-800 transition ease-in-out duration-300"/>
                      </button>
                      </p>
                      <p className="text-gray-500 text-sm mt-2 text-left">{url.created_at}</p>
                    
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

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
              <X />
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
                <button
                  onClick={handleCopy}
                  className=" bg-blue-600 text-white px-2"
                >
                  {copyUrl===true ? <ClipboardCheck/> : <Clipboard/>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

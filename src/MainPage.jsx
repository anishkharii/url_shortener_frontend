import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import { Card } from "./components/ui/card";
import Header from "./Header";
import { Loader2 } from "lucide-react";
import ShortenDialog from "./ShortenDialog";
import { useState } from "react";

const MainPage = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urlList, setUrlList] = useState(() => {
    const items = JSON.parse(localStorage.getItem("urlList"));
    return items || [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuChange = (value) => {
    setOpenMenu(value);
    setUrl("");
    setShortUrl("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.status === "false") {
        setError(data.message);
        console.log(error);
        return;
      }
      
      const newUrlData = {
        id: data.data.short_id,
        original_url: url,
        shorten_url: import.meta.env.VITE_BACKEND_URL + "/" + data.data.short_id,
        short_id: data.data.short_id,
        createdAt: new Date().toDateString(),
      };
  
      setUrlList((prevList) => {
        const updatedList = [newUrlData, ...prevList];
        localStorage.setItem("urlList", JSON.stringify(updatedList));
        return updatedList;
      });

      setShortUrl(import.meta.env.VITE_BACKEND_URL + "/" + data.data.short_id);
      
      setOpenMenu(true);
      
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" flex items-center justify-center h-screen bg-gradient-to-r from-[rgb(250,241,254)] via-white to-[rgb(245,248,255)]">
      <Card className="flex flex-col items-center justify-center gap-5 m-2 px-3 py-1 md:px-10 md:py-5 rounded-lg shadow-md shadow-black/10">
        <Header urlList={urlList} />
        <form className="flex flex-col items-center justify-center w-full max-w-80 gap-4">
          <Input
            type="url"
            placeholder="Paste your URL"
            name="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            autoFocus
            autoComplete="off"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-500"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Shortening..." : "Shorten"}
          </Button>
        </form>
        <p className="text-destructive text-sm font-bold">{error}</p>
      </Card>

      <ShortenDialog
        openMenu={openMenu}
        handleMenuChange={handleMenuChange}
        url={url}
        shortUrl={shortUrl}
      />
    </div>
  );
};

export default MainPage;

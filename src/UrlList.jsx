import { useEffect, useState } from "react";
import Header from "./Header";
import { BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UrlList = () => {
    const navigate = useNavigate();
  const [urlList, setUrlList] = useState([]);
  const [historyUrlList, setHistoryUrlList] = useState(()=>{
    const items = JSON.parse(localStorage.getItem("urlList"));
    return items || [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/`);
        const data = await res.json();
        if (data.status === "false") {
          console.log(data.message);
          return;
        }
        setUrlList(data.data);
      } catch (err) {
        setIsError(true);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  if(isLoading){
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }
  if(isError){
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-screen">
        <p>Something went wrong</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2 items-center justify-center" style={{"backgroundImage": "linear-gradient(137deg, rgba(231,223,245,1) 0%, rgba(255,251,251,1) 50%, rgba(255,222,255,1) 100%)"}}>
      {!isLoading && !isError && urlList.length === 0 && <p>No URLs found</p>}
      <Header urlList={historyUrlList} setUrlList={setHistoryUrlList}/>
      <div className="flex flex-col gap-2 max-w-4xl">
        {urlList.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-[#fbfbfb] md:gap-5 border border-slate-300 px-5 md:px-10 py-2 rounded-md w-full text-xs md:text-sm"
          >
            <div className="flex flex-col items-start justify-start">
              <p className=" w-[300px]">
                <b className="font-semibold">Original URL:</b>{" "}
                <a
                  href={item.original_url}
                  className="hover:underline text-blue-600 line-clamp-1"
                >
                  {item.original_url}
                </a>
              </p>
              <p>
                <b className="font-semibold">Short URL:</b>{" "}
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}/${item.short_id}`}
                  className="hover:underline text-blue-600 line-clamp-2"
                >
                  {import.meta.env.VITE_BACKEND_URL}/{item.short_id}
                </a>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <BarChart className="cursor-pointer" onClick={()=>navigate(`/urls/${item.short_id}`)}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlList;

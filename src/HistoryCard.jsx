/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { BarChart, Copy, CopyCheck, Trash2 } from "lucide-react";
import { useState } from "react";

const HistoryCard = ({ item, setUrlList }) => {
    const navigate = useNavigate();
  const [copy, setCopy] = useState(false);
  const handleCopy = ()=>{
    navigator.clipboard.writeText(item.shorten_url);
    setCopy(true);
    setInterval(() => {
      setCopy(false);
    }, 5000);
  }
  const handleDelete = ()=>{
    setUrlList((prevList) => {
      const updatedList = prevList.filter((url) => url.id !== item.id);
      localStorage.setItem("urlList", JSON.stringify(updatedList));
      return updatedList;
    })
  }
  return (
    <Card key={item.id} className="rounded-md my-4 px-2 md:px-5 py-2 grid grid-cols-10">
      <Trash2 className="absolute text-red-500 right-5 cursor-pointer" size={15} onClick={handleDelete}/>
      <div className="flex flex-col items-start justify-center col-span-8 gap-1 overflow-clip">
        <a
          href={item.original_url}
          className="text-md hover:underline transition-all text-gray-600 line-clamp-1"
        >
          {item.original_url}
        </a>
        <div className="grid grid-cols-10 items-center gap-2 md:gap-5">
          <Input
            readOnly
            value={item.shorten_url}
            className="  hover:underline text-primary transition-all line-clamp-1 col-span-8"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {copy ? (
                  <CopyCheck className="cursor-pointer" size={16} onClick={handleCopy} />
                ) : (
                  <Copy className="cursor-pointer" size={16} onClick={handleCopy}/>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{copy ? "Copied" : "Copy"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">{item.createdAt}</p>
      </div>
      <div className=" col-span-2 flex items-center justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <BarChart className="cursor-pointer" onClick={()=>navigate(`/url/${item.id}`)}/>
            </TooltipTrigger>
            <TooltipContent>
              <p className="">View Stats</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default HistoryCard;

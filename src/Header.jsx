/* eslint-disable react/prop-types */
import { History} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

import { ScrollArea } from "./components/ui/scroll-area"
import HistoryCard from "./HistoryCard";
import { useNavigate } from "react-router-dom";


const Header = ({urlList, setUrlList}) => {
    const navigate = useNavigate();

  return (
    <header className="flex items-center justify-center gap-8 p-4">
      <div className="flex items-start justify-center flex-col cursor-pointer" onClick={()=>navigate('/')}>
        <h1 className="scroll-m-20 text-2xl text-blue-600 font-extrabold tracking-tight md:text-3xl lg:text-4xl">
          URL Shortener
        </h1>
        <p className="text-gray-600 text-sm">
          A small microservice to shorten URLs
        </p>
      </div>
      <Dialog>
        <DialogTrigger className="flex flex-col items-center justify-center transition-all hover:underline">
          <History />
          <p className="text-sm text-gray-500">History</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <ScrollArea className="h-[350px] w-full px-0 md:px-3">

            {urlList.length>0 ?urlList.map((item) => (
              <HistoryCard item={item} key={item.id} setUrlList={setUrlList}/>
            )) : <p>No history</p>}
            </ScrollArea>
          </DialogDescription>
          <DialogFooter>
            <DialogDescription></DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;

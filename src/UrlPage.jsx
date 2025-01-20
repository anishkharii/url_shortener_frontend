/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { MapPin, Globe, Loader2, Trash2, AlertCircle } from "lucide-react";
import Header from "./Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./components/ui/alert"
import { ScrollArea } from "./components/ui/scroll-area";


const URLPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  //write search params
  const [searchParams, setSearchParams] = useSearchParams();
  const passkey = searchParams.get("passkey");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState({
    code: "",
    message: "",
  });
  const [urlList, setUrlList] = useState(()=>{
    const items = JSON.parse(localStorage.getItem("urlList"));
    return items || [];
  });
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/url/analytics/${id}`);
        const result = await res.json();

        if (result.status === "false") {
          const err = new Error(result.message);
          err.code = 404;
          throw err;
        }
        setData(result.data);
      } catch (err) {
        setError({
          code: err.code,
          message: err.message
        });
        
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleDelete = async () => {
   
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/url/${id}?passkey=${passkey}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.status === "false") {
        const err = new Error(result.message);
        err.code = 403;
        throw err;
      }

      setUrlList((prevList) => {
        const updatedList = prevList.filter((item) => item.short_id !== id);
        localStorage.setItem("urlList", JSON.stringify(updatedList));
        return updatedList;
      });
      navigate('/');
    } catch (err) {
      setError({
        code: err.code,
        message: err.message
      });
    }
    finally{
      setTimeout(()=>{
        
        setError({
          code: "",
          message: "",
        });
      },5000);
    }
  };


  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if(error.code===404){
    return <div className="text-center py-10 text-gray-500">No data available.</div>;
  }
  if (!data) {
    return <div className="text-center py-10 text-gray-500">No data available.</div>;
  }

  const {
    short_id,
    original_url,
    clicksHistory,
    createdAt,
    totalClicks,
  } = data;

  return (
    <div className=" h-auto flex flex-col items-center justify-center " style={{"backgroundImage": "linear-gradient(137deg, rgba(231,223,245,1) 0%, rgba(255,251,251,1) 50%, rgba(255,222,255,1) 100%)"}}>
    {
      error.code===403 &&
      <Alert className='absolute bg-white max-w-96 left-1/2 top-10 -translate-x-1/2 -translate-y-1/2' variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message}
      </AlertDescription>
    </Alert>
    }
    
      <Header urlList={urlList} setUrlList={setUrlList}/>
      <div className="max-w-4xl w-screen p-4 mx-auto">

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">URL Details</h1>

            <AlertDialog>
              <AlertDialogTrigger>
                <Trash2 className="cursor-pointer text-red-500" size={20} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Do you really want to delete this URL?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the URL from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 md:flex-row px-10 justify-between">
          <div className="space-y-2">
            <div>
              <span className="font-bold">Short URL:</span>
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/${short_id}`}
                target="_blank"
                className="text-blue-500 hover:underline line-clamp-2"
              >
                {`${import.meta.env.VITE_BACKEND_URL}/${short_id}`}
              </a>
            </div>
            <div>
              <span className="font-bold">Original URL:</span>{" "}
              <a
                href={original_url}
                target="_blank"
                className="text-blue-500 hover:underline line-clamp-2"
              >
                {original_url}
              </a>
            </div>
            <div>
              <span className="font-bold">Total Clicks:</span> {totalClicks}
            </div>
            <div>
              <span className="font-bold">Created At:</span>{" "}
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            {imageLoading && (
              <div className="w-40 h-40 rounded-md flex items-center justify-center bg-gray-50 ">
                <Loader2 className="animate-spin" size={32} />
              </div>
            )}
            <img
              src={` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                import.meta.env.VITE_BACKEND_URL
              }/${short_id}`}
              alt="QR Code"
              className={`${imageLoading ? "hidden" : ""}`}
              onLoad={() => setImageLoading(false)}
            />
          </div>
        </CardContent>
      </Card>

      <Card >
        <CardHeader>
          <h2 className="text-xl font-semibold">Clicks History</h2>
        </CardHeader>
        <CardContent>
          {clicksHistory.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead className="text-center">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clicksHistory.map((click, index) => {
                  const {
                    timestamp = null,
                    userAgent = null,
                    ip = "N/A",
                    location = null,
                  } = click || {};

                  const {
                    browser = "Unknown",
                    browserVersion = "",
                    os = "Unknown",
                    osVersion = "",
                  } = (Array.isArray(userAgent) && userAgent[0]) || {};

                  const {
                    city = "",
                    country = "Unknown",
                    region = "",
                    ll = [0,0],
                  } = (Array.isArray(location) && location[0]) || {};

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{`${browser} ${browserVersion}`}</TableCell>
                      <TableCell>{`${os} ${osVersion}`}</TableCell>
                      <TableCell>{ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                            <span>{`${city}, ${region}, ${country}`}</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <Globe className="w-4 h-4 ml-2" />
                            <span>{`[${ll.join(", ")}]`}</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No clicks history available.</p>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default URLPage;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { MapPin, Globe, Loader2 } from "lucide-react";
import Header from "./Header";

const URLPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(null);
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
          throw new Error(result.message);
        }
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
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
    <div className="p-6 max-w-4xl mx-auto ">
        <Header urlList={urlList}/>
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-semibold">URL Details</h1>
        </CardHeader>
        <CardContent className='flex flex-col gap-5 md:flex-row px-10 justify-between'>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Short URL:</span> 
              <a href={`${import.meta.env.VITE_BACKEND_URL}/${short_id}`} target="_blank" className="text-blue-500 hover:underline line-clamp-2">
              {`${import.meta.env.VITE_BACKEND_URL}/${short_id}`}
              </a>
            </div>
            <div>
              <span className="font-medium">Original URL:</span>{" "}
              <a href={original_url} target="_blank" className="text-blue-500 hover:underline line-clamp-2">
                {original_url}
              </a>
            </div>
            <div>
              <span className="font-medium">Total Clicks:</span> {totalClicks}
            </div>
            <div>
              <span className="font-medium">Created At:</span> {new Date(createdAt).toLocaleString()}
            </div>
          </div>
          <div>
          {imageLoading &&

            <div className="w-40 h-40 rounded-md flex items-center justify-center bg-gray-50 ">
                <Loader2 className="animate-spin" size={32} />
            </div>
          }
            <img src={` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${import.meta.env.VITE_BACKEND_URL}/${short_id}`} alt="QR Code"
                className={`${imageLoading ? "hidden" : ""}`}
                onLoad={() => setImageLoading(false)}
             />
          </div>
        </CardContent>
      </Card>

      <Card>
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
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clicksHistory.map((click, index) => {
                  const { timestamp, userAgent, ip, location } = click;
                  const { browser, browserVersion, os, osVersion } = userAgent[0];
                  const { city, country, region, ll } = location[0];

                  return (
                    <TableRow key={index}>
                      <TableCell>{new Date(timestamp).toLocaleString()}</TableCell>
                      <TableCell>{`${browser} ${browserVersion}`}</TableCell>
                      <TableCell>{`${os} ${osVersion}`}</TableCell>
                      <TableCell>{ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{`${city}, ${region}, ${country}`}</span>
                          <Globe className="w-4 h-4 ml-2" />
                          <span>{`[${ll.join(", ")}]`}</span>
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
  );
};

export default URLPage;

/* eslint-disable react/prop-types */

import {Label} from "./components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

const ShortenDialog = ({openMenu, handleMenuChange, url, shortUrl}) => {
    const [isCopy, setIsCopy] = useState(false);
  return (
    <Dialog open={openMenu} onOpenChange={handleMenuChange}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Sortened URL</DialogTitle>
            <DialogDescription>
              Click the copy button to copy the URL
            </DialogDescription>
          </DialogHeader>
            <div>
              <Label>Original URL</Label>
              <Input disabled value={url} />
              <Label>Shortened URL</Label>
              <div className="flex items-center justify-between gap-2 md:gap-5">

              <Input readOnly value={shortUrl} autofocus/>
              <Button onClick={()=>{
                navigator.clipboard.writeText(shortUrl);
                setIsCopy(true);
                setInterval(() => {
                  setIsCopy(false);
                },5000)
              }}>
                {
                  isCopy ? <CopyCheck/>:<Copy/>
                }
              </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant='secondary' onClick={() => handleMenuChange(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}

export default ShortenDialog
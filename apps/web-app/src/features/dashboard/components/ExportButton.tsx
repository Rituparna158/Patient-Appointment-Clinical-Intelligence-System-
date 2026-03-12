import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
 
export default function ExportButton() {
 
  const [open,setOpen] = useState(false)
  const [range,setRange] = useState<string | null>(null)
 
  function chooseRange(r:string){
    setRange(r)
  }
 
  async function handleEmail(){
 
    await fetch(
      `/api/reports-analytics/report/export?range=${range}&delivery=email`
    )
 
    alert("Report will be sent to your email")
 
    setOpen(false)
    setRange(null)
  }
 
  function handleDownload(){
 
    window.open(
      `/api/reports-analytics/report/export?range=${range}&delivery=download`
    )
 
    setOpen(false)
    setRange(null)
  }
 
  return (
 
    <div className="relative">
 
      <Button
        onClick={()=>setOpen(!open)}
        className="flex gap-2"
      >
        <Download size={16}/>
        Export
      </Button>
 
      {open && (
 
        <div className="absolute right-0 mt-2 bg-white border rounded shadow w-48 p-2 space-y-2">
 
          {!range && (
 
            <>
              <button onClick={()=>chooseRange("today")} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                Today
              </button>
 
              <button onClick={()=>chooseRange("week")} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                Weekly
              </button>
 
              <button onClick={()=>chooseRange("month")} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                Monthly
              </button>
 
              <button onClick={()=>chooseRange("year")} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                Yearly
              </button>
            </>
 
          )}
 
          {range && (
 
            <>
              <button
                onClick={handleDownload}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Download here
              </button>
 
              <button
                onClick={handleEmail}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Email report
              </button>
            </>
 
          )}
 
        </div>
 
      )}
 
    </div>
  )
}
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Download } from "lucide-react"
import { useState } from "react"
 
export default function ExportButton() {
  const { toast } = useToast()
  const [open,setOpen] = useState(false)
  const [range,setRange] = useState<string | null>(null)
 
  function chooseRange(r:string){
    setRange(r)
  }
 
  async function handleEmail(){
 
    await fetch(
      `/api/reports-analytics/report/export?range=${range}&delivery=email`
    )

    toast({
        title: 'Email sent',
        description: 'Check your email......',
      });
 
    setOpen(false)
    setRange(null)
  }
 
  function handleDownload(){
 
    window.open(
      `/api/reports-analytics/report/export?range=${range}&delivery=download`, "_blank"

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
 
        <div className="date-filter-list">
 
          {!range && (
 
            <>
              <button
                type="button"
                onClick={() => chooseRange("today")}
                className="date-filter"
              >
                Today
              </button>
              
              <button
                type="button"
                onClick={() => chooseRange("week")}
                className="date-filter"
              >
                Weekly
              </button>
              
              <button
                type="button"
                onClick={() => chooseRange("month")}
                className="date-filter"
              >
                Monthly
              </button>
              
              <button
                type="button"
                onClick={() => chooseRange("year")}
                className="date-filter"
              >
                Yearly
              </button>
              
            </>
 
          )}
 
          {range && (
 
            <>
              <button
              type="button"
                onClick={handleDownload}
                className="export-button"
              >
                Download here
              </button>
 
              <button
              type="button"
                onClick={handleEmail}
                className="export-button"
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
import { useState } from "react"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useClinicalStore }
from "@/features/clinical/store/clinical.store"

interface Props{
open:boolean
appointmentId:string | null
onClose:()=>void
}

export default function ConsultationModal({
open,
appointmentId,
onClose
}:Props){

const {createNote}=useClinicalStore()

const [symptoms,setSymptoms]=useState("")
const [diagnosis,setDiagnosis]=useState("")
const [prescriptions,setPrescriptions]=useState("")
const [notes,setNotes]=useState("")
const [followUpDate,setFollowUpDate]=useState("")

async function handleSave(){

if(!appointmentId) return

await createNote({
appointmentId,
symptoms,
diagnosis,
prescriptions,
notes,
followUpDate
})

setSymptoms("")
setDiagnosis("")
setPrescriptions("")
setNotes("")
setFollowUpDate("")

onClose()

}

return(

<Dialog open={open} onOpenChange={onClose}>

<DialogContent>

<DialogHeader>

<DialogTitle>
Write Consultation Note
</DialogTitle>

</DialogHeader>

<div className="space-y-3">

<Input
placeholder="Symptoms"
value={symptoms}
onChange={(e)=>setSymptoms(e.target.value)}
/>

<Input
placeholder="Diagnosis"
value={diagnosis}
onChange={(e)=>setDiagnosis(e.target.value)}
/>

<Input
placeholder="Prescription"
value={prescriptions}
onChange={(e)=>setPrescriptions(e.target.value)}
/>

<Input
placeholder="Doctor Notes"
value={notes}
onChange={(e)=>setNotes(e.target.value)}
/>

<Input
type="date"
value={followUpDate}
onChange={(e)=>setFollowUpDate(e.target.value)}
/>

<Button
className="w-full"
onClick={handleSave}
>

Save Consultation

</Button>

</div>

</DialogContent>

</Dialog>

)

}
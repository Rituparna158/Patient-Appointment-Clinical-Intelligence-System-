import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
 
export default function CreateDoctor() {
    const {toast}=useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });
 
  async function handleCreate() {
    try{
        await api("/admin/create-admin", {
      method: "POST",
      body: JSON.stringify(form),
    });
 
   toast({
        title:"Admin Created",
        description:"Admin account has been created successfully."
    })

    setForm({
      email: "",
      password: "",
      full_name: "",
      phone: "",
    });
    
  }catch (err:any) {
    toast({
        variant:"destructive",
        title:"Error",
        description: err.message || "Something went wrong"
    })
  }

 }
    
 
  return (
    <DashboardLayout>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Create Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(form).map((key) => (
            <Input
              key={key}
              placeholder={key}
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          ))}
 
          <Button onClick={handleCreate}>
            Create Admin
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
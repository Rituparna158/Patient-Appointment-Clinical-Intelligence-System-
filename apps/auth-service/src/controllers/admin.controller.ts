/*import { RequestHandler } from "express";
import { createDoctorSchema } from "../validators/admin.validator";
import { createDoctorUser } from "../services/admin.service";
import { HTTP_STATUS } from "../constants/http-status";

export const createDoctor:RequestHandler=async(req,res,next)=>{
    try{
        const body=createDoctorSchema.parse(req.body);
        const doctor=await createDoctorUser(body);

        return res.status(HTTP_STATUS.CREATED).json({
            "message":"Doctor account created successfully",
            doctor:{
                id:doctor.id,
                email:doctor.email,
                full_name:doctor.full_name,
                spec
            }
        });
    }catch(err){
        next(err);
    }
}*/

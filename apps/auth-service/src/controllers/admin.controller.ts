import { RequestHandler } from 'express';
import {
  createDoctorSchema,
  createAdminSchema,
} from '../validators/admin.validator';
import { createDoctorUser, createAdminUser } from '../services/admin.service';
import { HTTP_STATUS } from '../constants/http-status';
import { listenerCount } from 'node:cluster';

const createDoctor: RequestHandler = async (req, res, next) => {
  try {
    const body = createDoctorSchema.parse(req.body);

    const { user, doctorProfile } = await createDoctorUser(body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Doctor account created successfully',
      doctor: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        specializat: doctorProfile.specialization,
        licence_no: doctorProfile.licence_no,
        consultation_fee: doctorProfile.consultation_fee,
        is_active: doctorProfile.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createAdmin: RequestHandler = async (req, res, next) => {
  try {
    const body = createAdminSchema.parse(req.body);

    const user = await createAdminUser(body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Adminr account created successfully',
      admin: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        //phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { createDoctor, createAdmin };

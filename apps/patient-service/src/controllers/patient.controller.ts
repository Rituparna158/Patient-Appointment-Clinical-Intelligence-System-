import { Request, Response } from 'express';
import * as patientService from '../services/patient.service';
import { CreatePatientProfileDTO } from '../types/patient.types';
//import {HTTP_STATUS} from '../../../auth-service/src/constants/http-status';

interface AuthService extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const createProfile = async (req: AuthService, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'UNAUTHORIZED' });
    }

    const payload: CreatePatientProfileDTO = req.body;

    const result = await patientService.createPateintProfile(userId, payload);
  } catch {}
};

const getProfile = async () => {};

const updateProfile = async () => {};

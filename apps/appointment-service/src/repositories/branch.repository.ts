import { Branch } from '../models/branch.model';

export const findBranchById = (branchId: string) =>
  Branch.findOne({
    where: { id: branchId, is_active: true },
  });

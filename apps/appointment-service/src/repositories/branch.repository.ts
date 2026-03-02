import { Branch } from '../models/branch.model';

export const findBranchById = (branchId: string) =>
  Branch.findOne({
    where: { id: branchId, is_active: true },
  });

export const findAllActiveBranches = () =>
  Branch.findAll({
    where: { is_active: true },
    attributes: ['id', 'name', 'address'],
    order: [['createdAt', 'DESC']],
  });

export const createBranch = (data: {
  name: string;
  address: string;
  phone: string;
}) =>
  Branch.create({
    name: data.name,
    address: data.address,
    phone: data.phone,
    is_active: true,
  });

export const findBranchByName = (name: string) =>
  Branch.findOne({
    where: { name },
  });

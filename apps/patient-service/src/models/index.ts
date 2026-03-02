import { Patient } from './patient.model';
import { User } from './rbac/user.model';

Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

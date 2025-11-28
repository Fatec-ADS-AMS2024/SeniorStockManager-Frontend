import User from '@/types/models/User';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<User>('User');

const UserService = {
  ...genericMethods,
};

export default UserService;

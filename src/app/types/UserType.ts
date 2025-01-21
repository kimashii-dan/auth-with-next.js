interface UserType {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  isVerified: boolean;
  isAdmin: boolean;
  __v: number;
}

export default UserType;

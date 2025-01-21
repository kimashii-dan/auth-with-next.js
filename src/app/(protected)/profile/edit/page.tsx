// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Image from "next/image";
// import "../../globals.css";
// import UserType from "@/app/types/UserType";

// export default function EditProfile() {
//   const [userData, setUserData] = useState<UserType | null>({
//     _id: "",
//     username: "",
//     email: "",
//     password: "",
//     avatar: "/default-avatar.png",
//     isVerified: false,
//     isAdmin: false,
//     __v: 0,
//   });
//   const [oldPassword, setOldPassword] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`/api/users/protected`);
//         console.log(response.data);
//         setUserData(response.data.data);
//       } catch (error: any) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (userData) {
//       setUserData({ ...userData, [name]: value });
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center gap-7 p-7 rounded-lg bg-[#2c2e31] font-roboto">
//       <div className="flex gap-4 items-center">
//         <form>
//           <label htmlFor="email">Change email</label>
//           <input
//             type="email"
//             onChange={handleInputChange}
//             value={userData?.email || ""}
//             className="p-2 rounded-md  bg-[#323437] text-[#d1d0c5] focus:outline-none"
//             autoComplete="off"
//           />
//           <label htmlFor="username">Change username</label>
//           <input
//             type="username"
//             onChange={handleInputChange}
//             value={userData?.username || ""}
//             className="p-2 rounded-md  bg-[#323437] text-[#d1d0c5] focus:outline-none"
//             autoComplete="off"
//           />
//           <label htmlFor="email">Change password</label>
//           <input
//             type="password"
//             onChange={(e) => setOldPassword(e.target.value)}
//             value={oldPassword || null}
//             className="p-2 rounded-md  bg-[#323437] text-[#d1d0c5] focus:outline-none"
//             autoComplete="off"
//           />

//           <button type="submit"></button>
//         </form>
//       </div>
//     </div>
//   );
// }

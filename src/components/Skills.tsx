// import { Card } from '../../@/components/ui/card';
// import type { AccountProps } from '@/lib/type';
// import { useAppDispatch } from '@/redux/hooks';
// import { setUser } from '@/redux/slices/userSlice';
// import { addSkills, fetchUser } from '@/services/userService';
// import React, { useState } from 'react';
// import { toast } from 'react-hot-toast';

// const Skills: React.FC<AccountProps> = async({user, isYourAccount}) => {
//     const dispatch = useAppDispatch();
//   const [skills, setSkills] = useState('');
//   const addSkillsHandler = () => {
//     if(!skills.trim()) {
//         toast.error("Skills can't be empty.");
//         return;
//     }
//     await addSkills(skills);
//     setSkills('');
//     const updatedUser = await fetchUser();
//     dispatch(setUser(updatedUser));
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if(e.key === 'Enter') {
//       addSkillsHandler();
//     }
//   }

//   const removeSkillHandler = (skillToRemove: string) => {
//     if(confirm(`Are you sure you want to remove ${skillToRemove}?`)) {
//         console.log("Removing skill", skillToRemove);
//     }
//   }
//   return (
//     <div className='max-w-[5xl] mx-auto px-4 py-6'>
//       <Card className='shadow-lg border-2 overflow-hidden'></Card>
//     </div>
//   )
// }

// export default Skills;

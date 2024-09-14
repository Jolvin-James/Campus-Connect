import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const profileImgRef = useRef(null);

	const isLoading = false;
	const isMyProfile = true;

	const user = {
		_id: "1",
		fullName: "John Doe",
		username: "johndoe",
		profileImg: "/avatars/boy2.png",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		link: "https://youtube.com/@asaprogrammer_",
		following: ["1", "2", "3"],
		followers: ["1", "2", "3"],
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
				{/* HEADER */}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-4 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
								</div>
							</div>

							{/* USER AVATAR */}
							<div className='flex justify-left relative'>
								<div className='avatar left-4 -top-1 '>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
								<input
									type='file'
									hidden
                                    accept='image/*'
									ref={profileImgRef}
									onChange={handleImgChange}
								/>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => alert("Followed successfully")}
									>
										Follow
									</button>
								)}
								{profileImg && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={() => alert("Profile updated successfully")}
									>
										Update
									</button>
								)}
							</div>

							<div className='flex flex-col gap-3 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center'>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													youtube.com/@asaprogrammer_
												</a>
											</>
										</div>
									)}
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							{/* Divider Line */}
							<hr className='border-gray-700 my-4' />
						</>
					)}

					<Posts />
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
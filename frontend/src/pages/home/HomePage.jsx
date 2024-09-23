import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	const [showProfileReminder, setShowProfileReminder] = useState(false);
	const navigate = useNavigate();

	// Fetch authenticated user data
	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		},
	});

	// Check if the profile is incomplete (profileImg and bio are empty) and if user has just logged in
	useEffect(() => {
		const justLoggedIn = localStorage.getItem("justLoggedIn");

		if (authUser && justLoggedIn && (!authUser.profileImg || !authUser.bio)) {
			setShowProfileReminder(true); // Show modal if profile is incomplete
			// Remove the "justLoggedIn" flag so it doesn't trigger again
			localStorage.removeItem("justLoggedIn");
		}
	}, [authUser]);

	const handleGoToProfile = () => {
		navigate(`/profile/${authUser?.username}`); // Navigate to profile page
	};

	const handleCancel = () => {
		setShowProfileReminder(false); // Hide the modal
	};

	return (
		<>
			{/* Show reminder modal if the profile is incomplete */}
			{showProfileReminder && (
					<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
						<div className="bg-base-200 p-8 rounded-lg shadow-lg max-w-lg w-full transition-transform transform scale-100">
						<h3 className="text-2xl font-bold text-base-content mb-4 text-center">
							Complete Your Profile
						</h3>
						<p className="text-lg text-base-content text-center mb-8">
							Please take a moment to complete your profile details to enhance your experience.
						</p>
						<div className="flex justify-between gap-4">
							<button
							className="btn bg-transparent border border-base-content text-base-content flex-grow text-lg hover:bg-primary hover:text-white transition-colors duration-200"
							onClick={handleGoToProfile}
							>
							Go to Profile
							</button>
							<button
							className="btn bg-transparent border border-base-content text-base-content flex-grow text-lg hover:bg-primary hover:text-white transition-colors duration-200"
							onClick={handleCancel}
							>
							Cancel
							</button>
						</div>
						</div>
					</div>
			)}


			<div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
				{/* Header */}
				<div className="flex w-full border-b border-gray-700">
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For You
						{feedType === "forYou" && (
							<div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
						)}
					</div>
				</div>

				{/* CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts />
			</div>
		</>
	);
};

export default HomePage;

import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";
import { POSTS } from "../../utils/db/dummy";
import { FaArrowLeft } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import useFollow from "../../hooks/useFollow";

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null); 
  const [feedType, setFeedType] = useState("posts");
  const profileImgRef = useRef(null);

  const { username } = useParams();
  const queryClient = useQueryClient();
  const {follow, isPending } = useFollow();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          profileImg,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMyProfile = authUser && user && authUser._id === user?._id;
  const amIFollowing = authUser?.following.includes(user?._id);

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

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
        {/* HEADER */}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-4 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>

              {/* USER AVATAR */}
              <div className="flex justify-left relative">
                <div className="avatar left-4 -top-1 ">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                      alt="Profile"
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={handleImgChange}
                />
              </div>

              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "UnFollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {profileImg && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => updateProfile()}
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">@{user?.username}</span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center">
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href={user.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        youtube.com/@asaprogrammer_
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">{user?.following.length}</span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">{user?.followers.length}</span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              {/* Divider Line */}
              <hr className="border-gray-700 my-4" />
            </>
          )}

          <Posts />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HexColorPicker } from "react-colorful";
import BrushIcon from "@mui/icons-material/Brush";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GetUserData from "../constants/getuser";
import { userURL } from "../constants/backurl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import MakeApiRequest from "../constants/getreview";
import ReviewCard from "../components/reviewcard";
import SessionTimeout from "../components/sessiontimeout";
import GetBookmarks from "../constants/getbookmarks";
import QuestionCard from "../components/questioncard";

export default function Profile() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("reviews");
  const { data: session } = useSession();
  const [hovered, setHovered] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [putData, setPutData] = useState(null);
  const [colorBg, setColorBg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [bookmarkQuestion, setBookmarkQuestion] = useState([]);
  const [bookmarkReview, setBookmarkReview] = useState([]);

  const handleColorClick = () => setColorPickerOpen(true);
  const closeColorPicker = () => setColorPickerOpen(false);
  const openEditDialog = () => setEditOpen(true);
  const closeEditDialog = () => setEditOpen(false);
  const [profileImage, setProfileImage] = useState({
    user_id: "",
    img_id: "",
    img_link: "",
    img_delete_hash: "",
  });

  useEffect(() => {
    if (session) {
      async function FetchData() {
        const userData = await GetUserData(session.user.email, "email");
        // console.log('userData: ', userData);
        setPutData({
          user_id: userData.id,
          user_name: userData.username,
          user_type: "student",
          description: userData.desc,
          profile_link: userData.profile_link,
          profile_color: userData.pf_color,
          follower_count: userData.follower_count,
          following_count: userData.following_count,
          following: userData.following,
          follower: userData.follower,
        });
        setColorBg(userData.pf_color);
        setProfileImage({ ...profileImage, user_id: userData.id });
      }
      FetchData().then();
    }
  }, [session]);

  const fetchReviews = async () => {
    setReviews(await MakeApiRequest("latest"));
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(questionURL + "?mode=latest");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const getFilteredReviews = () => {
    return reviews.filter((review) => review.username === putData.user_name);
  };

  // console.log("Reviews: ", reviews);
  const getFilteredQuestions = () => {
    return questions.filter(
      (question) => question.username === putData.user_name
    );
  };
  // console.log("Questions: ", questions);

  const fetchBookmarkQuestions = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkQuestion(
      response.filter((bookmark) => bookmark.data_type === "qa")
    );
    // console.log('Received bookmarks questions:', bookmarkQuestion);
  };

  const fetchBookmarkReviews = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkReview(
      response.filter((bookmark) => bookmark.data_type === "review")
    );
    // console.log('Received bookmarks reviews:', bookmarkReview);
  };

  useEffect(() => {
    if (session) {
      fetchReviews();
      fetchQuestions();
      fetchBookmarkQuestions();
      fetchBookmarkReviews();
    }
  }, [session]);

  if (!session) return SessionTimeout();

  const idToken = session.idToken || session.accessToken;
  const email = session.email;

  async function putProfile() {
    try {
      const putDataSubset = {
        user_id: putData.user_id,
        user_name: putData.user_name,
        user_type: putData.user_type,
        description: putData.description,
        profile_color: putData.profile_color,
      };

      const response = await fetch(userURL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
          email: email,
        },
        body: JSON.stringify(putDataSubset),
      });
      if (!email || !idToken) {
        // console.log("ID Token or email is missing.");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        // console.log("Success:", data);
      } else {
        // console.log("Error:", response.status, response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        const filteredReviews = getFilteredReviews();
        return (
          <div className="flex flex-col maw-w-6xl w-full space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((item, index) => {
                const isBookmarked = bookmarkReview.some(
                  (bookmark) => bookmark.object_id == item.reviews_id
                );
                return (
                  <ReviewCard item={item} key={index} bookmark={isBookmarked} />
                );
              })
            ) : (
              <p className="text-green-400 text-center">No Reviews currently</p>
            )}
          </div>
        );
      case "posts":
        const filteredQuestions = getFilteredQuestions();
        return (
          <div className="flex flex-col maw-w-6xl w-full space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item, index) => {
                const isBookmarked = bookmarkQuestion.some(
                  (bookmark) => bookmark.object_id === item.questions_id
                );
                return (
                  <QuestionCard
                    item={item}
                    key={index}
                    bookmark={isBookmarked}
                    page="profile"
                  />
                );
              })
            ) : (
              <p className="text-green-400 text-center">No Q&A currently</p>
            )}
          </div>
        );
      default:
        return <p>Select a section to view its content.</p>;
    }
  };

  if (!putData) return SessionTimeout();

  const handleFollow = () => {
    const currentUser = {
      username: session.user.name,
      desc: session.user.description || "",
    };

    const isFollowing = putData.follower.some(
      (follower) => follower.username === currentUser.username
    );

    let updatedFollowers;

    if (isFollowing) {
      updatedFollowers = putData.follower.filter(
        (follower) => follower.username !== currentUser.username
      );
    } else {
      updatedFollowers = [...putData.follower, currentUser];
    }

    setPutData({
      ...putData,
      follower: updatedFollowers,
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        try {
          const imgurResponse = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Image }),
          });

          const imgurData = await imgurResponse.json();
          // console.log("Full Imgur API response:", imgurData);

          if (imgurResponse.ok) {
            const newProfileImage = {
              user_id: String(putData.user_id),
              img_id: imgurData.data.id,
              img_link: imgurData.data.link,
              img_delete_hash: imgurData.data.deletehash,
            };

            // console.log(
            //   "Image uploaded successfully:",
            //   newProfileImage.img_link
            // );

            if (!putData.profile_link) {
              await postImage(newProfileImage);
            } else {
              await putImage(newProfileImage);
            }
            window.location.reload();
          } else {
            console.error("Imgur upload failed:", imgurData.error);
          }
        } catch (error) {
          console.error("Error uploading to Imgur:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  async function putImage(imageData) {
    const response = await fetch(userURL + "/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
        email,
      },
      body: JSON.stringify(imageData),
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("Profile updated successfully:", data);
    } else {
      // console.log("Error updating profile:", response.status, response.text());
    }
  }

  async function postImage(imageData) {
    const response = await fetch(userURL + "/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
        email,
      },
      body: JSON.stringify(imageData),
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("Profile posted successfully:", data);
    } else {
      // console.log("Error posting profile:", response.status, response.text());
    }
  }

  // console.log('Patch Data:', putData);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      {/* Profile Header */}
      <div className="w-full p-6 rounded-md text-center text-black dark:text-white relative">
        {/* Profile Background */}
        <div
          className="w-100 h-48 -mx-6"
          style={{ background: colorBg }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleColorClick}
        >
          {hovered && (
            <div className="w-full h-48 inset-0 bg-black bg-opacity-30 flex items-center justify-end pr-4 cursor-pointer">
              <BrushIcon className="text-white text-3xl mt-36" />
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div
          className="absolute top-40 left-1/2 transform -translate-x-1/2"
          onMouseEnter={() => setHoveredProfile(true)}
          onMouseLeave={() => setHoveredProfile(false)}
        >
          {/* Image */}
          <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
            {putData.profile_link ? (
              <Image
                src={putData.profile_link}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="border-gray-500 border-2"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-300 border-2 border-gray-500"></div>
            )}
          </div>

          {/* Overlay */}
          {hoveredProfile && (
            <div
              className="absolute top-0 left-1/2 w-[100px] h-[100px] rounded-full flex items-center justify-center transform -translate-x-1/2 bg-black bg-opacity-50 cursor-pointer"
              onClick={handleImageClick}
            >
              <CameraAltIcon className="text-white text-3xl" />
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-16 mb-24">
          <h1 className="text-2xl font-semibold">{putData.user_name}</h1>
          <p className="text-gray-400">@{putData.user_id}</p>
          <p className="text-gray-500">{putData.description}</p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Following Count */}
            <Popup
              trigger={
                <div className="text-center cursor-pointer">
                  <span className="block">{putData.following_count}</span>
                  <span className="text-gray-500">Following</span>
                </div>
              }
              modal
              closeOnDocumentClick
            >
              {(close) => (
                <div className="h-96 w-96 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Following</h2>
                  {putData.following.length > 0 ? (
                    <ul>
                      {putData.following.map((followedUser, index) => (
                        <li
                          key={index}
                          className="py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
                          onClick={() => {
                            router.push(`/user/${followedUser.follow_id}`);
                          }}
                        >
                          <div className="flex items-center space-x-4 ml-28 transform -translate-x-1/2">
                            {/* Profile Image */}
                            {followedUser.profile_link ? (
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-500">
                                <Image
                                  src={followedUser.profile_link}
                                  alt="Profile"
                                  width={100}
                                  height={100}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-[5.5rem] h-16 rounded-full bg-gray-300 border-2 border-gray-500"></div>
                            )}

                            {/* Username and Description */}
                            <div className="flex flex-col">
                              <p className="font-medium">
                                {followedUser.username}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {followedUser.desc}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">{`This account doesn't follow anyone.`}</p>
                  )}
                </div>
              )}
            </Popup>
            {/* Follower Count */}
            <Popup
              trigger={
                <div
                  className="text-center cursor-pointer"
                  onClick={handleFollow}
                >
                  <span className="block">{putData.follower_count}</span>
                  <span className="text-gray-500">Follower</span>
                </div>
              }
              modal
              closeOnDocumentClick
            >
              {(close) => (
                <div className="h-96 w-96 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Followers</h2>
                  {putData.follower.length > 0 ? (
                    <ul>
                      {putData.follower.map((followeredUser, index) => (
                        <li
                          key={index}
                          className="py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
                          onClick={() => {
                            router.push(`/user/${followeredUser.follow_id}`);
                          }}
                        >
                          <div className="flex items-center space-x-4 ml-28 transform -translate-x-1/2">
                            {/* Profile Image */}
                            {followeredUser.profile_link ? (
                              <div className="w-[5.5rem] h-16 rounded-full overflow-hidden border-2 border-gray-500">
                                <Image
                                  src={followeredUser.profile_link}
                                  alt="Profile"
                                  width={100}
                                  height={100}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-[5.5rem] h-16 rounded-full bg-gray-300 border-2 border-gray-500"></div>
                            )}

                            {/* Username and Description */}
                            <div className="flex flex-col">
                              <p className="font-medium">
                                {followeredUser.username}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {followeredUser.desc}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      This account has no follower.
                    </p>
                  )}
                </div>
              )}
            </Popup>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-end -mt-40 mr-12">
            <button
              className="bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
              onClick={openEditDialog}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Color Picker Dialog */}
      <Dialog
        open={colorPickerOpen}
        PaperProps={{
          style: {
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        }}
        onClose={() => {
          putProfile();
          closeColorPicker();
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Background Color</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <HexColorPicker
              color={colorBg}
              onChange={(color) => {
                setColorBg(color);
                setPutData({ ...putData, profile_color: color });
              }}
              className="mx-auto"
            />
            <TextField
              fullWidth
              value={colorBg}
              onChange={(e) => {
                const newColor = e.target.value;
                setColorBg(newColor);
                setPutData({ ...putData, profile_color: newColor });
              }}
              variant="outlined"
              size="small"
              margin="dense"
              InputProps={{
                startAdornment: (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: colorBg,
                      marginRight: 8,
                    }}
                  />
                ),
                style: {
                  backgroundColor: theme === "dark" ? "#333333" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#000000",
                },
              }}
              InputLabelProps={{
                style: {
                  color: theme === "dark" ? "#bbbbbb" : "#000000",
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEditDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={putData.user_name}
            onChange={(e) =>
              setPutData({
                ...putData,
                user_name: e.target.value,
              })
            }
            margin="normal"
            InputProps={{
              style: {
                backgroundColor: theme === "dark" ? "#333333" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === "dark" ? "#bbbbbb" : "#000000",
              },
            }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={putData.description}
            onChange={(e) =>
              setPutData({
                ...putData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
            InputProps={{
              style: {
                backgroundColor: theme === "dark" ? "#333333" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === "dark" ? "#bbbbbb" : "#000000",
              },
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                putProfile();
                closeEditDialog();
              }}
              className="mt-4 bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tab Navigation */}
      <div className="flex justify-around w-3/4 mt-6 border-b-2 border-gray-200">
        {["Reviews", "Posts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`relative pb-2 px-4 ${
              activeTab === tab.toLowerCase()
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full max-w-6xl mt-4 flex justify-center">
        {renderContent()}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { setCredentials } from "../slices/AuthSlice";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import ProfileCard from "../components/ProfileCard";
import { CiCircleRemove } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditPage, setEditPage] = useState(false);
  const [image, setImage] = useState("");
  const [isProfileRemoved, setisProfileRemoved] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // To hold the image preview

  const { userInfo } = useSelector((state) => state.auth);
  console.log("userInfo From ProfileSxcrren", userInfo);
  const defaultAvatar = "../../public/placeHolderProfile.jpg";
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const [updateUserApiCall, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo]);


  const handleCancelClick = () => {
    setEditPage(false);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };

      reader.readAsDataURL(file); 
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ums-profile");
    formData.append("cloud_name", "duxddwvek");
    formData.append("folder", "ums-profile");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/duxddwvek/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Image upload failed, no URL returned.");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleRemoveSelectedImage = () => {
    setImage(""); 
    setImagePreview(null); 
  };

  const handleRemoveProfileImage = () => {
    setisProfileRemoved(!isProfileRemoved);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      toast.error("Email should end with @gmail.com.");
    } else if (name.trim().length < 3) {
      toast.error("Name should be at least 3 characters.");
    }else if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name should only contain letters and spaces.");
    }else if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
    } else {
      try {
        console.log("on from profilescreen submit");
        let image_url = isProfileRemoved ? "null" : userInfo.profileImage || "";
        console.log("image from profilescreen submit", image);
        if (image) {
          image_url = await uploadImage(image);
          if (!image_url) {
            return;
          }
          console.log("Image URL from Cloudinary:", image_url);
        }

        const res = await updateUserApiCall({
          _id: userInfo._id,
          name,
          email,
          ...(password && { password }),
          profileImage: image_url,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        toast.success("Profile Updated");
        setEditPage(false);
        setisProfileRemoved(false);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      {isEditPage ? (
        <>
          <h3 className="text-center">Update Profile</h3>

          <Form.Group className="my-2 text-center" controlId="profileImage">
            <Form.Label>Profile Image</Form.Label>
            <div className="d-flex flex-column align-items-center">
              <img
                src={
                  imagePreview ||
                  (!isProfileRemoved &&
                    userInfo.profileImage &&
                    userInfo.profileImage != "null") ||
                  defaultAvatar
                }
                alt="Profile Preview"
                className="rounded-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  cursor: "pointer",
                  marginBottom: "10px",
                  background: "gray",
                  border: "solid 1px gray",
                }}
                onClick={() => fileInputRef.current.click()}
              />
              <div className="flex justify-between w-10">
                <CiCircleRemove
                  onClick={handleRemoveSelectedImage}
                  style={{ cursor: "pointer", color: "blue" }}
                />

                <MdDelete
                  style={{
                    cursor: "pointer",
                    color: isProfileRemoved ? "black" : "red",
                  }}
                  onClick={handleRemoveProfileImage}
                />
              </div>

              <input
                type="file"
                accept="image/*" 
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e)}
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current.click()}
                className="mt-2"
              >
                Change Image
              </Button>
            </div>
          </Form.Group>

          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirm password">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {isLoading && <Loader />}

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>

            <Button
              onClick={handleCancelClick}
              type="button"
              variant="primary"
              className="mt-3 ms-3"
            >
              cancel
            </Button>
          </Form>
        </>
      ) : (
        <ProfileCard setEditPage={setEditPage} />
      )}
    </FormContainer>
  );
};

export default ProfileScreen;

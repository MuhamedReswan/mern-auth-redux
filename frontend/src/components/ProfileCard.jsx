import React from "react";
import { Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProfileCard = ({ setEditPage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log("userInfo from profile card", userInfo);
  const defaultAvatar = "../../public/placeHolderProfile.jpg";

  const handleEditProfile = () => {
    setEditPage(true); 
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <Card className="text-center" style={{ width: "650px" }}>
        <Card.Body>
          <div className="flex justify-center text-center mb-3">
            <img
              src={
                userInfo.profileImage && userInfo.profileImage !== "null"
                  ? userInfo.profileImage
                  : defaultAvatar
              }
              alt="Profile Preview"
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                background: "gray",
                border: "solid 1px gray",
              }}
            />
          </div>
          <Card.Title>
            <h1>
              <span className="card-datas">{userInfo.name}</span>
            </h1>
          </Card.Title>
          <Card.Text>
            <h6>
              <span className="card-datas">{userInfo.email}</span>
            </h6>
          </Card.Text>
          <Button variant="primary" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileCard;

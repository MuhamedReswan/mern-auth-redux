import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/AuthSlice";
import { useUpdateUserMutation } from "../slices/usersApiSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateUserApiCall, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo]);
  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !email.trim() ||
      !name.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill all fields.");
    } else if (!email.endsWith("@gmail.com")) {
      toast.error("Email should end with @gmail.com.");
    } else if (name.trim().length < 3) {
      toast.error("Name should be at least 3 characters.");
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password
      )
    ) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character."
      );
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
    } else {
      try {
        const res = await updateUserApiCall({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        toast.success("Profile Update");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <FormContainer>
      <h1>Update Profile</h1>

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
          <Form.Label> Confirm Password</Form.Label>
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
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;

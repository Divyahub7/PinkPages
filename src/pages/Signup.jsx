import React from "react";
import { Signup as SignupComponent } from "../components";
import { Helmet } from "react-helmet-async";

function Signup() {
  return (
    <div className="py-8">
      <Helmet>
        <title>Sign Up | PinkPages</title>
      </Helmet>
      <SignupComponent />
    </div>
  );
}

export default Signup;

import React from "react";
import { Login as LoginComponent } from "../components";
import { Helmet } from "react-helmet-async";

function Login() {
  return (
    <div className="py-8">
      <Helmet>
        <title>Login | PinkPages</title>
      </Helmet>
      <LoginComponent />
    </div>
  );
}

export default Login;

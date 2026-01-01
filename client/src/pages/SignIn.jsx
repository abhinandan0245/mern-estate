import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link , useNavigate} from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData , setFormData] = useState({})
 const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData , 
      [e.target.id] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       dispatch(signInStart());
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <--- important
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      dispatch(signInFailure(data.message || "Signin failed"));
      return;
    }

    // `data` should be user object with `role`
    dispatch(signInSuccess(data));

    // Redirect based on role
    if (data.role === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/user");
    }

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
   
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text3xl text-center font-semibold my-7">SignIn</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          type="email"
          name=""
          id="email"
          onChange={handleChange}
          className="border p-3 rounded-lg "
          placeholder="email"
        />
        <input
          type="password"
          name=""
          id="password"
          onChange={handleChange}
          className="border p-3 rounded-lg "
          placeholder="password"
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "SignIn"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't Have an Account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

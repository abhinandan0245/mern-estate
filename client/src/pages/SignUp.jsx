import React from 'react'
import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text3xl text-center font-semibold my-7">SignUp</h1>

      <form className="flex flex-col gap-4">
        <input
          type="text"
          name=""
          id="username"
          className="border p-3 rounded-lg "
          placeholder="username"
        />
        <input
          type="email"
          name=""
          id="email"
          className="border p-3 rounded-lg "
          placeholder="email"
        />
        <input
          type="password"
          name=""
          id="password"
          className="border p-3 rounded-lg "
          placeholder="password"
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          SignUp
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an Account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-500'>Sign In</span>
        </Link>
      </div>
    </div>
  );
}

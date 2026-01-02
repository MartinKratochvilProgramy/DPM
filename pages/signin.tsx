import React from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import picture from '../src/app/favicon.ico';

const signin = () => {
  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="max-w-[400px] mb-24 bg-white rounded-md pt-10 shadow-2xl">
        <div className="px-4 flex flex-col items-center">
          <Image
            src={picture} // Relative path to the image inside the 'public' folder
            alt="My Image"
            width={60} // Set the desired width of the image
            // height={200} // Set the desired height of the image
            className="mb-5"
          />
          <h1 className="text-2xl mb-4 dark:text-black">Welcome</h1>
          <h3 className="mb-2 text-sm text-gray-600">
            Sign in to continue to Daily Portfolio Management
          </h3>
          <div className="mb-1 px-6 sm:px-0 max-w-sm">
            <button
              type="button"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleSignIn}
              className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-2 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
        <div
          className="text-gray-400 text-sm py-3 border-t w-full flex justify-center"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await signIn();
          }}
        >
          Don&apos;t have an account?&nbsp;
          <a className="text-blue-400 cursor-pointer underline-offset-2 transition duration-500 border-b border-transparent hover:text-[#4285F4]/90 hover:border-[#4285F4]/90">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default signin;

// export async function getServerSideProps (context: any) {
//   const session = await getSession(context)
//   const apiEndpoint = 'http://localhost:3000/api/providers'
//   const response = await fetch(apiEndpoint)
//   const providers = await response.json()

//   return {
//     props: {
//       session,
//       providers
//     }
//   }
// }

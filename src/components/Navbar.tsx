import React from 'react'
import { useTheme } from 'next-themes'
import { signIn, signOut, useSession } from 'next-auth/react'
import './Navbar.css'

export const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  function toggleTheme () {
    if (
      theme === 'light'
    ) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <nav
      className='border-gray-200 px-1 sm:px-4 bg-gray-900 p-3 flex flex-row xs:flex-col-reverse sm:flex-row justify-between items-center sm:items-center w-auto order-1'
      id='navbar-search'
    >
      <div className='flex w-full sm:w-auto py-1 justify-start items-center text-white space-x-2 md:space-x-4'>
        {(session != null) &&
          <div className='pb-[2px]'>
            {session?.user?.name}
          </div>
        }
        <div className='bg-gray-900 dark:text-gray-100'
          onClick={toggleTheme}>
          <div className='flex items-center justify-center space-x-2'>
            <label className='flex items-center h-5 p-1 duration-300 ease-in-out bg-gray-400 rounded-full cursor-pointer w-9 dark:bg-gray-600'>
              <div className='w-4 h-4 duration-300 ease-in-out transform bg-white rounded-full shadow-md toggle-dot dark:translate-x-3'>
              </div>
            </label>
            <input id='toggle' type='checkbox' className='hidden' />
          </div>
        </div>
      </div>

      <ul
        className='flex flex-row justify-end items-center w-full sm:w-auto py-0 sm:py-1 border-gray-100 space-x-1 md:space-x-4 mt-0 border-0 bg-gray-900'
      >
        {(session != null)
          ? <li>
            <a
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => { await signOut() }}
              className='cursor-pointer text-md text-gray-300 hover:text-gray-900 hover:bg-gray-100 hover:text px-[6px] py-1 rounded-lg border-solid border-gray-300 hover:border-gray-100 border-[1px] transition duration-300 ease-in-out'
            >
              Log Out
            </a>
          </li>
          : <>
            <li>
              <a
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => { await signIn() }}
                className='cursor-pointer underline-appear text-md text-gray-300 hover:text-gray-50 transition duration-500 ease-in-out'
              >
                Sign In
              </a>
            </li>
            <li>
              <a
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => { await signIn() }}
                className='cursor-pointer text-md text-gray-300 hover:text-gray-900 hover:bg-gray-100 hover:text px-[6px] py-1 rounded-lg border-solid border-gray-300 hover:border-gray-100 border-[1px] transition duration-300 ease-in-out'
              >
                Sign Up
              </a>
            </li>
          </>
        }

      </ul>
    </nav>
  )
}

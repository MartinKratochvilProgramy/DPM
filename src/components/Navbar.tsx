import React, { useContext } from 'react'
import { CurrencyContext } from '@/pages/_app'
import { useTheme } from 'next-themes'
import { useUser } from '@auth0/nextjs-auth0/client'
import './Navbar.css'

export const Navbar = () => {
  // Const {theme, setTheme} = useContext(ThemeContext);
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const { currency } = useContext(CurrencyContext)

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
      className='border-gray-200 px-0 sm:px-4 bg-gray-900 p-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center w-auto order-1'
      id='navbar-search'
    >
      <div className='flex w-full sm:w-auto py-1 justify-start items-center text-white space-x-4'>
        <div className='pb-[2px]'>
          {user?.name} {(user != null) && currency}
        </div>
        <div className='bg-gray-900 dark:text-gray-100'
          onClick={toggleTheme}>
          <div className='flex items-center justify-center space-x-2'>
            <label className='flex items-center h-5 p-1 duration-300 ease-in-out bg-gray-400 rounded-full cursor-pointer w-9 dark:bg-gray-600'>
              <div
                className='w-4 h-4 duration-300 ease-in-out transform bg-white rounded-full shadow-md toggle-dot dark:translate-x-3'>
              </div>
            </label>
            <input id='toggle' type='checkbox' className='hidden' />
          </div>
        </div>
      </div>

      <ul
        className='flex flex-row justify-around items-center w-full sm:w-auto p-0 sm:p-1 border-gray-100 space-x-0 md:space-x-4 mt-0 border-0 bg-gray-900'
      >
        {(user != null)
          ? <li>
            <a href='/api/auth/logout' className='text-md text-gray-300 hover:text-gray-900 hover:bg-gray-100 hover:text px-[6px] py-1 rounded-lg border-solid border-gray-300 hover:border-gray-100 border-[1px] transition duration-300 ease-in-out'>
				Log Out
            </a>
          </li>
          : <>
            <li>
              <a href='/api/auth/login' className='underline-appear text-md text-gray-300 hover:text-gray-50 transition duration-500 ease-in-out'>
				Sign In
              </a>
            </li>
            <li>
              <a
                href='https://daily-portfolio-management.uk.auth0.com/authorize?response_type=code&client_id=elo1qQEI4scV6b6sK20yCHwEGz56NCb1&redirect_uri=http://localhost:3000/api/auth/callback&scope=openid%20profile%20email&screen_hint=signup'
                className='text-md text-gray-300 hover:text-gray-900 hover:bg-gray-100 hover:text px-[6px] py-1 rounded-lg border-solid border-gray-300 hover:border-gray-100 border-[1px] transition duration-300 ease-in-out'>
				Sign Up
              </a>
            </li>
          </>
        }

      </ul>
    </nav>
  )
}

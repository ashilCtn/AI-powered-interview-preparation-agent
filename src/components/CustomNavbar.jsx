import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const CustomNavBar = ({ title, variant, onAuthClick }) => {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const config = {
        landing: {
            text: 'Sign In',
            action: onAuthClick,
        },
        dashboard: {
            text: 'Logout',
            action: () => {
                logout()
                navigate('/')
            },
        },
        session: {
            text: 'Go Back',
            action: () => navigate('/dashboard'),
        },
    }

    const button = config[variant]


    return (
        <div className="flex items-center justify-between w-full px-6 py-4 shadow-sm bg-white">
            <h1 className="text-xl font-bold text-stone-900">{title}</h1>

            <button
                onClick={button.action}
                className="text-white bg-black px-6 py-2 rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
                {button.text}
            </button>
        </div>
    )
}

export default CustomNavBar
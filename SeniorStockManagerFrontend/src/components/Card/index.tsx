import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";


export default function Card(){
const { theme } = useContext(ThemeContext);
    return(
<div className="flex flex-col items-center justify-center min-h-screen">

    <div className="relative w-64 h-64 bg-purple-900 rounded-lg shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-75 background-image: url('your-image-url-here');"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <p className="text-lg font-medium">Create Chatbot</p>
        </div>
    </div>

    <div className="p-4 text-center text-gray-500">
        <p>Inspired by <a href="https://galichat.com" className="text-blue-500 underline">galichat.com</a></p>
    </div>
</div>
    );
}
import { useContext, JSX } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

interface CardProps {
    text: string;
    subText: string;
    icon: JSX.Element;
    page: string;
}

export default function Card({ text, subText, icon, page }: CardProps) {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    return (
        <div 
            className="relative w-64 h-40 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(page)}
        >
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-gray-800">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-2">
                    {icon}
                </div>
                <p className="text-lg font-medium">{text}</p>
                <p className="text-sm text-gray-500">{subText}</p> 
            </div>
        </div>
    );
}

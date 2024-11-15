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
            className="w-64 h-40 bg-surface rounded-lg shadow-md border border-surface cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(page)}
        >
            <div className="bg-primary h-11" />
            
            <div className="z-10 flex flex-col items-center justify-center h-full text-textPrimary">
                <div className="flex items-center justify-center w-12 h-12 bg-surface rounded-full mb-2  text-textSecondary">
                    {icon}
                </div>
                <p className="text-lg font-medium">{text}</p>
                <p className="text-sm text-textSecondary">{subText}</p> 
            </div>
        </div>
    );
}

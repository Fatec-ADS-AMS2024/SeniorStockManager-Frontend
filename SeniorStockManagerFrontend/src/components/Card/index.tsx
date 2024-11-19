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
        <div className="w-64 h-40 bg-surface rounded-lg shadow-md border border-background cursor-pointer hover:shadow-lg transit" onClick={() => navigate(page)} >
            <div className="h-1/4 relative ">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-2 text-textSecondary absolute top-3 left-3 bg-background">
                    {icon}
                </div>
            </div>
            <div className="flex justify-center items-center h-3/4 border-t">
                <div className="z-10 flex flex-col items-center justify-center text-textPrimary">
                    <p className="text-lg font-medium">{text}</p>
                    <p className="text-sm text-textSecondary">{subText}</p> 
                </div>
            </div>
        </div>
    );
}

import Breadcrumb from "../Breadcrumb";
import PageTitle from "../PageTitle";

interface Breadcrumb_PageTitleProps {
    title: string;
}

export default function Breadcrumb_PageTitle({title} : Breadcrumb_PageTitleProps){
    return (
        <div className="bg-neutral p-5">
            <PageTitle title={title}/>
            <Breadcrumb/>
        </div>
    )
}
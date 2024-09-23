import SearchInput from "./SearchInput";
import Conversations from "./Conversations";

const Sidebar1 = () => {
    return (
        <div className="flex flex-col bg-transparent backdrop-blur-lg rounded-lg shadow-lg p-4 w-full">
            <SearchInput />
            <div className="divider mb-4"></div>
            <Conversations />
        </div>
    );
};

export default Sidebar1;

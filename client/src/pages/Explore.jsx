import Sidebar from "../components/Sidebar/Sidebar";

function Explore() {
  return (
    <div className="flex text-white bg-black">
    <Sidebar/>
    <div className="w-full  items-center flex flex-col h-screen" >
        <div className="w-full h-[60px]  p-1 my-12 " >
            <h1 className="text-4xl border-b-2 mx-12 border-b-gray-400 py-2 " >See other Snippets</h1>

        </div>
    </div>
    </div>
  );
}

export default Explore;

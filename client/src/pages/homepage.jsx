import Sidebar from "../components/Sidebar/Sidebar";

function Home() {
  return (
    <div className="flex text-white bg-black">
    <Sidebar/>
    <div className="w-full  items-center flex flex-col h-screen" >
        <div className="w-full  p-1 my-12 " >
          <div className="w-full items-center justify-around flex" >
            <h1 className="text-4xl" > My Collections</h1>
            <button className="text-xl rounded-md bg-cyan-700 hover:bg-cyan-500 hover:scale-[1.02]  p-2" >Add Snippet!</button>
            </div>
        </div>
    </div>
    </div>
  );
}

export default Home;

import Sidebar from "../components/Sidebar/Sidebar";
import SnipCard from "../components/snipCard";
import data from '../components/practice.json';



function Home() {
  
  return (
    <div className="flex text-white bg-black">
    <Sidebar/>
    <div className="w-full  items-center flex flex-col h-screen" >
        <div className="w-full  p-1 my-12 " >
          <div className="w-full items-center justify-around flex" >
            <h1 className="text-4xl" > My Collections</h1>
            <button className="text-xl rounded-md bg-cyan-950 hover:bg-cyan-500 hover:text-black transition-all duration-100 hover:scale-[1.02]  p-1" >Add Snippet!</button>
            </div>
        </div>
        <div className="grid w-full px-3 grid-cols-3 justify-around gap-4" >
        {data.posts.map(post => (
            <SnipCard key={post._id} post={post} />          
      ))}
        </div>
        
    </div>
    </div>
  );
}

export default Home;

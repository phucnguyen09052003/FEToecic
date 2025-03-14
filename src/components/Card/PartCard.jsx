function PartCard(props)
{
    const percent = (props.learned/props.number)*100;

    return (
        <>
        <div className="cursor-pointer w-96 border-b mt-1 border-black">
          
            <div className="items-center text-xl p-2  flex justify-between ">
                Part {props.id}: {props.title}
                <div className="relative w-12 h-12 flex items-center zjustify-center">

            <div className="w-full max-w-sm">
            <div className="flex items-center">
            <div className="text-sm font-semibold text-gray-700 text-center">
        {percent}%
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
    
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
            </div>
    </div>
      

    </div>
           
 
           
         
            </div>
        </div>
        </>
    );
} export default PartCard;
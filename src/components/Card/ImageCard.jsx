const ImageCard = (props) =>{
    return(
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <img class="w-full h-48 object-cover" src={props.img} alt="Card image"/>
        <div class="p-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">{props.title}</h3>
          <p class="text-gray-600">{props.description}.</p>
        </div>
      </div>
    );

} ;
export default ImageCard;

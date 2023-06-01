import React from "react"

export default function key(props)
{
   function getTyped()
   {
      if(props.typed == 1)
      {
         return "typed-animation";
      }
      
      return "";
   }

   return (
      <div
         className={getTyped()}
         onClick={props.trigger}
      >
         <div
            style={{
               backgroundColor: props.color,
               border: "2px solid " + ((props.color == "black") ? "gray" : props.color),

               transition: "all .5s ease",
               WebkitTransition: "all .5s ease",
               MozTransition: "all .5s ease",
            }}
            className="key unselectable"
            id={props.value}>{props.value.toUpperCase()}
         </div>
      </div>
   );
}
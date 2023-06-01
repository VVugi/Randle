import React from "react"

export default function Square(props)
{
   function getClass()
   {
      if(props.wrong != undefined)
      {
         if(props.wrong % 2 == 0) //Dumbest solution but it works
         {
            return "square wrong1 unselectable";
         }

         return "square wrong2 unselectable";
      }
      
      if(props.animation != undefined)
      {
         return "square-no-animation unselectable";
      }

      return "square unselectable";
   }

   function getTyped()
   {
      if(props.typed == 1)
      {
         return "typed-animation";
      }
      
      return "";
   }

   return (
      <div className={getTyped()}>
         <div
            style={{
               backgroundColor: props.color,
               border: "2px solid " + props.color,

               transition: "all .5s ease",
               WebkitTransition: "all .5s ease",
               MozTransition: "all .5s ease",

               width: props.width,
               height: props.width,

               fontSize: props.fontSize,
            }}
            className={getClass()}
            id={props.value}
         >   
            {String.fromCharCode(props.value)}
         </div>
      </div>
   );
}
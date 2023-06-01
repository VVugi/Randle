import { useEffect, useState, Fragment} from 'react';
import './App.css';
import Square from "./components/Square";
import Key from "./components/Key";

import {TbQuestionCircle, TbInfoCircle, TbChartBar, TbLetterX, TbHeart} from "react-icons/tb";
 
function App()
{
   const [width, setWidth] = useState(window.innerWidth);

   function handleWindowSizeChange()
   {
      setWidth(window.innerWidth);
   }

   useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      
      return () => {
         window.removeEventListener('resize', handleWindowSizeChange);
      }
   }, []);

   const [keys1, setKeys1] = useState([
      {key: "Q", color: "black"},
      {key: "W", color: "black"},
      {key: "E", color: "black"},
      {key: "R", color: "black"},
      {key: "T", color: "black"},
      {key: "Y", color: "black"},
      {key: "U", color: "black"},
      {key: "I", color: "black"},
      {key: "O", color: "black"},
      {key: "P", color: "black"}
   ]);

   const [keys2, setKeys2] = useState([
      {key: "A", color: "black"},
      {key: "S", color: "black"},
      {key: "D", color: "black"},
      {key: "F", color: "black"},
      {key: "G", color: "black"},
      {key: "H", color: "black"},
      {key: "J", color: "black"},
      {key: "K", color: "black"},
      {key: "L", color: "black"}
   ]);

   const [keys3, setKeys3] = useState([
      {key: "↵", color: "black"},
      {key: "Z", color: "black"},
      {key: "X", color: "black"},
      {key: "C", color: "black"},
      {key: "V", color: "black"},
      {key: "B", color: "black"},
      {key: "N", color: "black"},
      {key: "M", color: "black"},
      {key: "←", color: "black"}
   ]);

   const example1 = ["c", "u", "t", "e"];
   const example2 = ["b", "r", "i", "g", "h", "t"];
   const example3 = ["p", "e", "a", "c", "h"];

   const [copyButton, setCopyButton] = useState("Share Results");

   const [banner, setBanner] = useState({visible: false, message: "asleepyLoves", time: 1000});

   const [showResultsScreen, setShowResultsScreen] = useState({show: false, button: false});
   const [showHowToScreen, setShowHowToScreen] = useState(false);
   const [showInfoScreen, setShowInfoScreen] = useState(false);

   const [mainWidth, setMainWidth] = useState("");
   const [wordData, setWordData] = useState();

   const [squaresData, setSquaresData] = useState([]);
   const [squares, setSquares] = useState([]);
   const [row, setRow] = useState(1);
   const [col, setCol] = useState(1);

   const[stats, setStats]= useState();

   useEffect(() => {
      getLocalWord();
   }, [0]);

   async function getLocalWord()
   {
      const localWordData = await JSON.parse(localStorage.getItem("wordData"));
      const localStats = await JSON.parse(localStorage.getItem("stats"));

      if(localStats == null)
      {
         let newStats = {
            streak: 0,
            record: 0,
            graphs: []
         };

         setStats(newStats);
      }
      else
      {
         setStats(localStats);
      }

      
      if(localWordData != null && localWordData.date && localWordData.date.length > 10)
      {
         var date = new Date();
         var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
         
         let changeTime = new Date(localWordData.date);
         changeTime.setDate(changeTime.getDate() + 1);

         let currentTime = new Date(now_utc);

         if(changeTime > currentTime)
         {
            if(width <= 768)
            {
               setMainWidth(90 + "vw");
            }
            else
            {
               setMainWidth((50 + (60 * localWordData.word.length)) + "px");
            }
            
            setRow(localWordData.attempt);
            setWordData(localWordData);
    
            const attempts = localWordData.attempts.map(word => word).join('');
    
            let newSquaresData = [];
    
            let tempRow = 1;
            let tempCol = 1;
    
            for(let i = 1; i <= (localWordData.word.length * (localWordData.word.length + 1)); i++)
            {
               if(attempts[i - 1] != undefined)
               {
                  newSquaresData.push({row: tempRow, col: tempCol, value: attempts[i - 1].charCodeAt()});
               }
               else
               {
                  newSquaresData.push({row: tempRow, col: tempCol, value: ""});
               }
    
               if(i % localWordData.word.length == 0)
               {
                  tempRow++;
                  tempCol = 0;
               }
    
               tempCol++;
            }
    
            setSquaresData(newSquaresData);
         }
         else
         {
            getOnlineWord();
         }
      }
      else
      {
         getOnlineWord();
      }
   }

   async function getOnlineWord()
   {
      const response = await fetch('https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=' + import.meta.env.VITE_API_KEY)
      const data = await response.json();
   
      if(data.statusCode || data.message == "API rate limit exceeded")
      {
         console.clear(); // Dirty solution whatevs security first
      }

      let newWordInfo = {
         date: data.publishDate,
         word: data.word,
         attempt: 1,
         attempts: [],
         finished: false,
         definitions: data.definitions
      };
 
      localStorage.setItem("wordData", JSON.stringify(newWordInfo));
 
      if(width <= 768)
      {
         setMainWidth(90 + "vw");
      }
      else
      {
         setMainWidth((50 + (60 * newWordInfo.word.length)) + "px");
      }

      setWordData(newWordInfo);
 
      let newSquaresData = [];
 
      let tempRow = 1;
      let tempCol = 1;
     
      for(let i = 1; i <= (newWordInfo.word.length * (newWordInfo.word.length + 1)); i++)
      {
         newSquaresData.push({row: tempRow, col: tempCol, value: ""});
 
         if(i % newWordInfo.word.length == 0)
         {
            tempRow++;
            tempCol = 0;
         }
 
         tempCol++;
      }
 
      setSquaresData(newSquaresData);
   }

   useEffect(() => {
      if(stats != undefined)
      {
         let newStats = {
            streak: stats.streak,
            record: stats.record,
            graphs: stats.graphs
         };
   
         localStorage.setItem("stats", JSON.stringify(newStats));
      }
   }, [stats])

   useEffect(() => {
      if(wordData != null)
      {
         let realResultLetters = [];
         let resultLetters = [];
 
         for(let i = 0; i < wordData.word.length; i++)
         {
            realResultLetters.push({id: i + 1, value: wordData.word[i].charCodeAt() - 32});
            resultLetters.push({id: i + 1, value: wordData.word[i].charCodeAt() - 32});
         }

         let foundLetters = [];
         let currentRow = 1;

         setSquares(squaresData.map(square => {
            if(square.row != currentRow && currentRow < row)
            {
               currentRow++;
               resultLetters = [];
 
               for(let i = 0; i < wordData.word.length; i++)
               {
                  resultLetters.push({id: i + 1, value: wordData.word[i].charCodeAt() - 32});
               }

               foundLetters = [];
            }

            const colorInfo = getColor(square, resultLetters, realResultLetters, currentRow);

            if(colorInfo.info != undefined)
            {
               foundLetters.push(colorInfo.info);
            }

            resultLetters = resultLetters.filter(letter => !foundLetters.find(foundLetter => foundLetter.id == letter.id));

            return <Square
               color={colorInfo.color}
               key={square.row + "-" + square.col}
               value={square.value}
               wrong={square.wrong}
               typed={square.typed}
               width={(width <= 768) ? ((90 - ((wordData.word.length + 1) * 2)) / wordData.word.length) + "vw" : "50px"}
               fontSize={(width <= 768) ? ((90 - (2 * wordData.word.length)) / wordData.word.length) / 1.5 + "vw" : "25px"}
            />
         }));
      }
   }, [squaresData]);

   function colorKey(color, key)
   {
      let found1 = keys1.find(key1 => key1.key.charCodeAt() == key);
      let found2 = keys1.find(key2 => key2.key.charCodeAt() == key);
      let found3 = keys1.find(key3 => key3.key.charCodeAt() == key);

      if(found1)
      {
         return {
            ...found1,
            color: color
         };
      }
      else if(found2)
      {
         return {
            ...found2,
            color: color
         };
      }
      else if(found3)
      {
         return {
            ...found3,
            color: color
         };
      }
   }

   function getColor(square, resultLetters, realResultLetters, currentRow)
   {
      let foundGreenLetter = realResultLetters.find(letter => letter.value == square.value && letter.id == square.col && square.row < row);
      let foundYellowLetter = resultLetters.filter(letter => letter.value == square.value && square.row < row);

      if(foundGreenLetter)
      {
         return {color: "#067800", info: foundGreenLetter};
      }
      else if(foundYellowLetter[0])
      {
         const specialCase = squaresData.filter(squareData => squareData.row == currentRow && foundYellowLetter.find(foundYellow => foundYellow.value == squareData.value && foundYellow.id == squareData.col));

         if(specialCase != undefined)
         {
            const remaining = [];

            for(let i = 0; i < specialCase.length; i++)
            {
               foundYellowLetter = foundYellowLetter.filter(letter => letter.id != specialCase[i].col)
            }

            foundYellowLetter.forEach(yellowLetter => {
               remaining.push(yellowLetter);
            });
            
            if(remaining.length > 0)
            {
               return {color: "#b8b800", info: remaining[0]}
            }

            return {color: "grey"};
         }

         return {color: "#b8b800", info: foundYellowLetter[0]};
      }
      else if(square.row < row || square.row < row)
      {
         return {color: "grey"};
      }
      else 
      {
         return "black"
      }
   }

   useEffect(() => {
      async function handleKeyDown(e)
      {
         setBanner({
            ...banner,
            visible: false
         });

         if(wordData.finished == false)
         {
            let newSquares;
   
            if(e.keyCode == 13 && col == wordData.word.length + 1)
            {
               const wordAttemptArray = squaresData.filter(square => square.value != "" && square.row == row);
               let wordAttempt = "";
   
               for(let i = 0; i < wordAttemptArray.length; i++)
               {
                  wordAttempt += String.fromCharCode(wordAttemptArray[i].value)
               }

               if(wordAttempt == wordData.word.toUpperCase())
               {
                  let newAttempts = wordData.attempts;
                  newAttempts.push(wordAttempt);

                  let newInfo = {
                     ...wordData,
                     attempts: newAttempts,
                     attempt: row + 1,
                     finished: true
                  };

                  let foundStat = false;
                  let newGraphs = stats.graphs;

                  newGraphs = newGraphs.map(graph => {
                     if(graph.quantity == wordData.word.length)
                     {
                        foundStat = true;

                        return {
                           ...graph,
                           won: graph.won + 1
                        }
                     }

                     return graph;
                  });

                  if(!foundStat)
                  {
                     newGraphs.push({
                        quantity: wordData.word.length,
                        won: 1,
                        lost: 0,
                     });
                  }

                  setStats(stats => {
                     return {
                        streak: stats.streak + 1,
                        record: stats.streak == stats.record ? stats.streak + 1 : stats.record,
                        graphs: newGraphs
                     }
                  });

                  setRow(row + 1);
                  setCol(1);

                  localStorage.setItem("wordData", JSON.stringify(newInfo));

                  setWordData(newInfo);
                  setSquaresData(squaresData.map(square => {return square}));

                  setShowResultsScreen({show: true, button: false});
               }
               else
               {
                  const response = await fetch(`https://api.wordnik.com/v4/word.json/${wordAttempt}/examples?includeDuplicates=false&useCanonical=false&limit=5&api_key=${import.meta.env.VITE_API_KEY}`);
                  const data = await response.json();
      
                  if(data.statusCode || data.message == "API rate limit exceeded")
                  {
                     console.clear(); // Same solution

                     if(data.statusCode == 404)
                     {
                        setBanner({visible: true, message: "Not in word list", time: 2000});
                     }
                     else
                     {
                        setBanner({visible: true, message: "API reached its limit, wait a few minutes", time: 2000});
                     }

                     setSquaresData(squaresData.map(square => {
                        if(square.row == row)
                        {
                           return {...square, wrong: square.wrong == undefined ? 1 : square.wrong + 1};
                        }
                        
                        return square
                     }));
                  }
                  else
                  {
                     let newAttempts = wordData.attempts;
                     newAttempts.push(wordAttempt);
      
                     let newInfo = {
                        ...wordData,
                        attempts: newAttempts,
                        attempt: row + 1,
                        finished: false
                     };
                     
                     setWordData(newInfo);
                     localStorage.setItem("wordData", JSON.stringify(newInfo));
      
                     setRow(row + 1);
                     setCol(1);
      
                     setSquaresData(squaresData.map(square => {return square}));

                     if(row == wordData.word.length + 1)
                     {
                        setBanner({visible: true, message: wordData.word.toUpperCase(), time: 5000});

                        let newInfo = {
                           ...wordData,
                           attempt: row + 1,
                           finished: true
                        };

                        setWordData(newInfo);
                        localStorage.setItem("wordData", JSON.stringify(newInfo));

                        let foundStat = false;
                        let newGraphs = stats.graphs;

                        newGraphs = newGraphs.map(graph => {
                           if(graph.quantity == wordData.word.length)
                           {
                              foundStat = true;

                              return {
                                 ...graph,
                                 lost: graph.lost + 1
                              }
                           }

                           return graph;
                        });

                        if(!foundStat)
                        {
                           newGraphs.push({
                              quantity: wordData.word.length,
                              won: 0,
                              lost: 1,
                           });
                        }

                        setStats(stats => {
                           return {
                              streak: 0,
                              record: stats.record,
                              graphs: newGraphs
                           }
                        });

                         setShowResultsScreen({show: true, button: false});
                     }
                  }
               }
            }
            else if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode == 8)
            {
               newSquares = squaresData.map(square => {
                  let tempCol = col;
                  
                  if(e.keyCode == 8)
                  {
                     tempCol = col - 1;
                  }
                  
                  if(square.row == row && square.col == tempCol)
                  {
                     if(e.keyCode == 8)
                     {
                        setCol(col - 1);
      
                        return {...square, value: "", typed: false};
                     }
                     else
                     {
                        setCol(col + 1);
                        
                        return {...square, value: e.keyCode, typed: true};
                     }
                  }
                  else
                  {
                     return square;
                  }
               });
   
               setSquaresData(newSquares);
            }
         }
      }

      window.addEventListener('keydown', handleKeyDown);

      return function cleanup()
      {
         window.removeEventListener('keydown', handleKeyDown);
      }
   }, [squaresData]);

   useEffect(() => {
      if(squares != [])
      {
         squares.forEach(square => {
            if(square.props.color != undefined)
            {
               setKeys1(keys1 => keys1.map(key => {
                  if(key.key.charCodeAt() == square.props.value && ((key.color == "black" && square.props.color == "grey") || (key.color == "black" && square.props.color == "#b8b800") || (key.color == "black" && square.props.color == "#067800") || (key.color == "grey" && square.props.color == "#b8b800") || (key.color == "grey" && square.props.color == "#067800")|| (key.color == "#b8b800" && square.props.color == "#067800")))
                  {
                     return {
                        key: key.key,
                        color: square.props.color
                     };
                  }

                  return key;
               }));

               setKeys2(keys2 => keys2.map(key => {
                  if(key.key.charCodeAt() == square.props.value && ((key.color == "black" && square.props.color == "grey") || (key.color == "black" && square.props.color == "#b8b800") || (key.color == "black" && square.props.color == "#067800") || (key.color == "grey" && square.props.color == "#b8b800") || (key.color == "grey" && square.props.color == "#067800")|| (key.color == "#b8b800" && square.props.color == "#067800")))
                  {
                     return {
                        key: key.key,
                        color: square.props.color
                     };
                  }

                  return key;
               }));

               setKeys3(keys3 => keys3.map(key => {
                  if(key.key.charCodeAt() == square.props.value && ((key.color == "black" && square.props.color == "grey") || (key.color == "black" && square.props.color == "#b8b800") || (key.color == "black" && square.props.color == "#067800") || (key.color == "grey" && square.props.color == "#b8b800") || (key.color == "grey" && square.props.color == "#067800")|| (key.color == "#b8b800" && square.props.color == "#067800")))
                  {
                     return {
                        key: key.key,
                        color: square.props.color
                     };
                  }

                  return key;
               }));
            }
         });
      }
   }, [squares]);

   function orderStats(a, b)
   {
      if(a > b)
      {
         return 1;
      }

      return -1;
   }

   function copyResult()
   {
      const emojis = (squares.map(square => {
         switch(square.props.color)
         {
            case "#067800":
               return "🟩";
            
            case "#b8b800":
               return "🟨";

            default:
               return "⬜";
         }
      }));

      const firstRandle = new Date('2023-06-01T03:00:00.000Z');
      const today = new Date();

      const milliseconds = 1000 * 60 * 60 * 24;

      const utc1 = Date.UTC(firstRandle.getFullYear(), firstRandle.getMonth(), firstRandle.getDate(), firstRandle.getHours(), firstRandle.getMinutes(), firstRandle.getSeconds());
      const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());

      const id = Math.ceil((utc2 - utc1) / milliseconds);

      let copy = "Randle #" + id + " " + wordData.attempts.length + "/" + wordData.word.length + "\n";

      for(let i = 1; i < emojis.length + 1; i++)
      {
         copy += emojis[i - 1];

         if(i % wordData.word.length == 0)
         {
            copy += "\n"

            if(i % wordData.attempts.length == 0)
            {
               break;
            }
         }
      }

      navigator.clipboard.writeText(copy);
      setCopyButton("Copied to clipboard!");
   }

   function triggerKey(keyCode)
   {
      keyCode = keyCode == 8592 ? 8 : keyCode;
      keyCode = keyCode == 8629 ? 13 : keyCode;

      window.dispatchEvent(new KeyboardEvent('keydown', {
         key: "b",
         keyCode: keyCode,
         code: "KeyE",
         which: keyCode,
         shiftKey: false,
         ctrlKey: false,
         metaKey: false
     }));
   }

   return (
      <main>
         <div className="full-area">
            <div className="nav">
               <div className="nav-container info-buttons">
               {showHowToScreen ?
                     <TbLetterX style={{cursor: "pointer"}} onClick={() => setShowHowToScreen(false)}/>
                     :
                     <TbQuestionCircle style={{cursor: "pointer"}} onClick={() => {
                        setShowResultsScreen({show: false, button: false});
                        setShowInfoScreen(false);
                        setShowHowToScreen(true);
                     }} />
                  }
                  
                  {showInfoScreen ?
                     <TbLetterX style={{cursor: "pointer"}} onClick={() => setShowInfoScreen(false)}/>
                     :
                     <TbInfoCircle style={{cursor: "pointer"}} onClick={() => {
                        setShowResultsScreen({show: false, button: false});
                        setShowInfoScreen(true);
                        setShowHowToScreen(false);
                     }} />
                  }
               </div>

               <h1 className="title">Randle</h1>

               <div className="nav-container stats-button">
                  {((wordData != undefined && wordData.finished) && showResultsScreen.show) || (showResultsScreen.show && showResultsScreen.button) ?
                     <TbLetterX style={{cursor: "pointer"}} onClick={() => setShowResultsScreen({show: false, button: true})}/>
                     :
                     <TbChartBar style={{cursor: "pointer"}} onClick={() => {
                        setShowResultsScreen({show: true, button: true})
                        setShowInfoScreen(false);
                        setShowHowToScreen(false);
                        setCopyButton("Share Results");
                     }} />
                  }
               </div>
            </div>

            <div
               className="banner"
               style={{
                  opacity: banner.visible ? 1 : 0,
                  transition: "all 1s ease",
                  WebkitTransition: "all 1s ease",
                  MozTransition: "all 1s ease"
               }}
            >
               {banner.message}
            </div>

            <div style={{width: mainWidth, gap: (width <= 768) ? "1vw" : "10px"}} className="game-area">
               {squares}
            </div>

            <div className="key-container">
               <div className="key-row">
                  {keys1.map(key => <Key trigger={() => triggerKey(key.key.charCodeAt())} key={key.key.charCodeAt()} value={key.key} color={key.color} />)}
               </div>

               <div className="key-row">
                  {keys2.map(key => <Key trigger={() => triggerKey(key.key.charCodeAt())} key={key.key.charCodeAt()} value={key.key} color={key.color} />)}
               </div>

               <div className="key-row">
                  {keys3.map(key => <Key trigger={() => triggerKey(key.key.charCodeAt())} key={key.key.charCodeAt()} value={key.key} color={key.color} />)}
               </div>
            </div>

            {showResultsScreen.show && wordData != undefined &&
               <div
                  className="results"
                  style={{
                     width: mainWidth,
                     animation: showResultsScreen.button ? "regular-initialize 0.5s 1" : "delayed-initialize 1.5s 1",
                     transition: "all 2s ease",
                     WebkitTransition: "all 2s ease",
                     MozTransition: "all 2s ease"
                  }}
               >
                  <div className="transparent-background stats">
                     <div className="transparent-background streak-container">
                        <h2 className="transparent-background">Current Streak:</h2>
                        <span className="transparent-background">{stats.streak}</span>
                     </div>

                     <div className="transparent-background streak-container">
                        <h2 className="transparent-background">Max Streak:</h2>
                        <span className="transparent-background">{stats.record}</span>
                     </div>
                  </div>

                  {wordData.finished &&
                     <div className="word-info">
                        <h2 className="transparent-background">{wordData.word[0].toUpperCase() + wordData.word.substring(1)}: {wordData.definitions.map((definition, i) => <span key={i} className="transparent-background italic">{definition.text + " "}</span>)}</h2>
                        
                        {(wordData.attempts[wordData.attempts.length - 1] == wordData.word.toUpperCase()) &&
                           <input style={{cursor: "pointer"}} type="button" onClick={() => copyResult()} value={copyButton} className="transparent-background share-button" />
                        }
                     </div>
                  }

                  {/* {((graph.won / (graph.won + graph.lost)) * 100).toFixed(2)} */}

                  <div className="graphs">
                     {stats.graphs.sort((a, b) => orderStats(a.quantity, b.quantity)).map(graph => {
                        return (
                           <Fragment key={graph.quantity}>
                              {graph.quantity} letter words W/L:
                              
                              <div className="transparent-background bar-container">
                                 <div
                                    style={{
                                       width: `${((graph.won / (graph.won + graph.lost)) * 100).toFixed(2)}%`,
                                    }}
                                    className="green-bar"
                                 >
                                    {graph.won == 0 ? "" : graph.won + " "}
                                 </div>

                                 <div
                                    style={{
                                       width: `${((graph.lost / (graph.won + graph.lost)) * 100).toFixed(2)}%`
                                    }}
                                    className="red-bar"
                                 >
                                    {graph.lost == 0 ? "" : graph.lost + " "}
                                 </div>
                              </div>
                           </Fragment>
                        )
                     })}
                  </div>
               </div>
            }

            {showInfoScreen &&
               <div
                  className="info"
                  style={{
                     width: mainWidth,
                     animation: "regular-initialize 0.5s 1",
                     transition: "all 2s ease",
                     WebkitTransition: "all 2s ease",
                     MozTransition: "all 2s ease"
                  }}
               >
                  <div className="info-text">
                     <h2>Powered by the Wordnik API</h2>
                     
                     <br></br>
                     
                     <h3 style={{margin: 0}}>Notes:</h3>
                     <ul>
                        <li>This game was initially built as a personal project, any bugs will be eventually fixed</li>
                        <li>I'm currently trying to raise the petition limit, please be patient!</li>
                     </ul>

                     <span className="hint">asleepyLoves</span>
                  </div>
               </div>
            }

            {showHowToScreen &&
               <div
                  className="info"
                  style={{
                     width: mainWidth,
                     animation: "regular-initialize 0.5s 1",
                     transition: "all 2s ease",
                     WebkitTransition: "all 2s ease",
                     MozTransition: "all 2s ease"
                  }}
               >
                  <div className="info-text">
                     <h2>How to play</h2>
                     <h3>Type in your guesses and the color of the tiles will change accordingly:</h3>
                     
                     <h4>If the letter exists in the word and is in the <span className="transparent-background italic">right</span> spot <span style={{color: "green", backgroundColor: "transparent"}}>it will be green</span></h4>

                     <div className="example">
                        {example1.map((letter, i) => <Square key={i} color={i == 1 ? "green" : "grey"} value={letter.charCodeAt() - 32} animation={true} isMobile={(width <= 768)} />)}
                     </div>
                     
                     <h4>If the letter exists in the word but is in the <span className="transparent-background italic">wrong</span> spot <span style={{color: "yellow", backgroundColor: "transparent"}}>it will be yellow</span></h4>

                     <div className="example">
                        {example2.map((letter, i) => <Square key={i} color={i == 1 ? "#b8b800" : "grey"} value={letter.charCodeAt() - 32} animation={true} isMobile={(width <= 768)} />)}
                     </div>

                     <h4>Grey letters don't exist in the word</h4>
                     
                     <div className="example">
                        {example3.map((letter, i) => <Square key={i} color="grey" value={letter.charCodeAt() - 32} animation={true} isMobile={(width <= 768)} />)}
                     </div>
                  </div>
               </div>
            }
         </div>
      </main>
   );
}

export default App
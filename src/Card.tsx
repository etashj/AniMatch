import { useEffect, useCallback, useRef } from 'react'; 
import type { RefObject } from 'react'; 
import { motion, useAnimation } from "motion/react";
import { useQuery, gql } from '@apollo/client';

type Props = {
  id: number, 
  idList: number[], 
  animeQueue: RefObject<number[]>, 
  mangaQueue: RefObject<number[]>, 
  animeHistory: RefObject<number[]>,
  mangaHistory: RefObject<number[]>,
  idRemFunc: (idToRem:number)=>void,
  idAddFunc: (idToAdd:number)=>void, 
  hideMature: boolean, 
  hideEcchi: boolean, 
  mode: boolean
}

/*
type hehe = {
  title_en: string, 
  title_romanji: string, 
  title_native: string, 
  popularity: number, 
  avg_score: number, 
  mean_score: number, 
  coverURL: string, 
  bannerURL: string, 
  mature: boolean, 
  ecchi: boolean, 
  length: number, // chapters OR episodes
  genres: string[], 
  tags: string[], 
  endDate: number, // null/NaN for ongoing media
  type: string, 
  constraintRef: any,
}
*/

type Tag = {
  name: string; 
  __typename: string
};

function formatNumber(num: number) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

export default function Card( {
    id, idList, idRemFunc, animeHistory, animeQueue, mangaHistory, mangaQueue, idAddFunc, hideEcchi, hideMature, mode
  } : Props) {
  const animControls = useAnimation();
  const randomDeg = Math.floor(Math.random() * 20) - 10; // -5 to 5 deg
  const hasSwipedRef = useRef(false);


  const FETCH_DATA = gql`
    query fetchData($mediaId: Int) {
      Media(id: $mediaId) {
        title {
          english
          native
          romaji
        }
        coverImage {
          large
        }
        bannerImage

        endDate {
          year
        }

        genres
        tags {
          name
        }

        stats {
          scoreDistribution {
            amount
            score
          }
        }

        type
        
        popularity
        averageScore
        chapters
        episodes
        isAdult

        recommendations {
          nodes {
            id
          }
        }

        siteUrl
        description
      }
    }
  `; 

  const { loading, error, data } = useQuery(FETCH_DATA, {variables:{mediaId:id}});
  //console.log(data); 
  
  const addRec = useCallback (() => {
    console.log("Unfiltered: " + data.Media.recommendations.nodes.length);
    let recs: number[] = data.Media.recommendations.nodes.map( (node: {__typename:string, id:number}) => node.id );
    if (mode) {
      recs = recs.filter( (id) =>  !((mangaHistory.current.includes(id)) || (mangaQueue.current.includes(id)))  );
    } else {
      recs = recs.filter( (id) =>  !((animeHistory.current.includes(id)) || (animeQueue.current.includes(id)))  );
    }
    console.log("Filtered: "+recs.length);
    if (mode) mangaQueue.current.unshift(...recs)
    else animeQueue.current.unshift(...recs);
  }, [mode, data, animeHistory, animeQueue, mangaQueue, mangaHistory]);

  const offScreen = useCallback( (activeDir: string, sign: number) => {
    if (activeDir == 'x') { 
      animControls.start( { x:window.innerWidth*sign, opacity:0 } );
      if (sign>0) addRec();
    }
    else if (activeDir == 'y') {
      animControls.start( { y:window.innerWidth*sign, opacity:0 } ); 
    }
    
    if (mode) mangaHistory.current.push(id);
    else animeHistory.current.push(id);

    setTimeout(()=>{idRemFunc(id);}, 150);  
    
    if (mode) {
      if (mangaQueue.current.length>0) idAddFunc(mangaQueue.current.pop()!);
    } else {
      if (animeQueue.current.length>0) idAddFunc(animeQueue.current.pop()!);
    }
  }, [animControls, idAddFunc, animeQueue, mangaQueue, animeHistory, mangaHistory, mode, id, addRec, idRemFunc]);


  useEffect(() => {
    // Only allow key control for the top card
    if (id !== idList[idList.length - 1]) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        offScreen('x', -1);
      } else if (e.key === 'ArrowRight') {
        offScreen('x', 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, idList, offScreen]);

  useEffect(() => {
    if (id !== idList[idList.length - 1]) return; // Only top card can auto-swipe
    if (loading) return;                         // Wait until data finishes loading
    if (hasSwipedRef.current) return;            // Prevent double swiping

    if (data==null || data?.Media == null) {
      console.warn("Media not found or null. Skipping:", id);
      if (error != null && error.cause!=null){ console.log( error.cause.message );
      if (error.cause.message == 'Load failed') { setTimeout( ()=>{offScreen('x', -1);}, 20000 );  return; }
      }
      hasSwipedRef.current = true;
      offScreen('x', -1);
    } else if (data.Media.isAdult && hideMature) {
      console.warn("Mature content skipped:", id);
      hasSwipedRef.current = true;
      offScreen('x', -1);
    } else if (
      hideEcchi &&
      data.Media.genres.map((genre: string) => genre.toLowerCase()).includes('ecchi')
    ) {
      console.warn("Ecchi content skipped:", id);
      hasSwipedRef.current = true;
      offScreen('x', -1);
    } else if ((data.Media.type.toLowerCase()=='anime' && mode==true)||(data.Media.type.toLowerCase()=='manga' && mode==false))  {
      console.warn("Skipped Incorrect type ", id);
      if (mode) { mangaHistory.current.unshift(id); }
      else { animeHistory.current.unshift(id); }
      hasSwipedRef.current = true;
      offScreen('x', -1);
    }

    localStorage.setItem('manga-queue', JSON.stringify(mangaQueue.current));
    localStorage.setItem('anime-queue', JSON.stringify(animeQueue.current));
    localStorage.setItem('manga-history', JSON.stringify(mangaHistory.current));
    localStorage.setItem('anime-history', JSON.stringify(animeHistory.current));
  }, [id, idList, loading, data, error, hideEcchi, hideMature, offScreen, mode, animeHistory, mangaHistory, animeQueue, mangaQueue]);


  if (!loading && !error)
  return (
    <>
      <motion.div 
                animate = {animControls}
                drag  
                onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 200 ) {
                        offScreen('x', Math.sign(info.offset.x)); 
                        //console.log("Swiped to the " + ((info.offset.x > 0) ? "right" : "left"));

                    } else {
                        // Animate to be offscreen
                    }
                }}
                dragConstraints={{ top: 10, right: 0, bottom: 10, left: 0 }}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
                dragElastic={1}
                whileDrag={{ cursor: "grabbing" }}
               className='w-3/5 max-sm:w-1/2  min-w-[240px] dark:text-zinc-200 bg-zinc-200 dark:bg-[#141112] ring-zinc-400 dark:ring-zinc-800 ring-3 px-2 py-2 rounded-3xl max-h-7/8 absolute shadow-xl dark:shadow-black-900/30 shadow-black-900 hover:scale-105 transition duration-50 overflow-clip flex flex-col select-none'
                style={{ transform: `rotate(${randomDeg}deg)`, touchAction: "none" }}>
        <div>
          <img src={data.Media.bannerImage} className="object-cover scale-110 sticky pointer-events-none "></img>
          <img src={data.Media.coverImage.large} className={`absolute w-1/4 rounded-2xl ring-5 ring-zinc-200/100 dark:ring-[#141112]/100 inset-shadow-md inset-shadow-zinc-200 pointer-events-none ${data.Media.bannerImage==null ? "top-5" : "top-25"} left-19/32 max-w-[125px]`}></img>
          <br></br>
          <a target="_blank" rel="noopener noreferrer" href={data.Media.siteUrl} ><h2  className="select-none text-left font-header sm:text-4xl text-2xl text-[#1D2126] dark:text-zinc-200 mx-3 self-start max-w-5/9">{data.Media.title.english == null ? data.Media.title.romaji : data.Media.title.english}</h2></a>
          <h2 className="text-left font-header sm:text-lg text-lg text-[#1D2126] dark:text-zinc-200 mx-3  self-start max-w-5/9">{data.Media.title.native}</h2>
          <p className = "text-left max-w-5/9 text-[#1D2126] dark:text-zinc-200 mx-3 self-start ">{(data.Media.type) + " • " + (data.Media.endDate.year==null ? "Ongoing" : data.Media.endDate.year) + (data.Media.endDate.year==null ? "" : " • " + (data.Media.chapters==null ? data.Media.episodes+" episodes" : data.Media.chapters + " chapters"))}</p>
          <p className = "text-left max-w-5/9 text-[#1D2126] dark:text-zinc-200 mx-3 self-start ">{"Avg: "+ (data.Media.averageScore) + "% • " + formatNumber(data.Media.popularity)+ " on List"}</p>
        </div>
        <div className="m-3 text-left text-[#1D2126] dark:text-zinc-200 max-w-5/9 max-sm:text-sm overflow-y-auto">
          <p dangerouslySetInnerHTML={{ __html: data.Media.description}}></p>
        </div>


        <div className={`flex flex-col flex-nowrap absolute w-13/32 left-19/32 ${data.Media.bannerImage==null ? 'top-55' : 'top-73'} max-h-1/2 `}>
          <div className='mb-2 flex flex-row flex-wrap'>
              {data.Media.genres.map((genre: string) => (
                <div key={genre} className="px-1 m-0.5 bg-zinc-300 dark:bg-[#1D2126] rounded-sm text-lg max-sm:text-sm">
                  {genre}
                </div>
              ))}
          </div>

          <div className='flex flex-row flex-wrap overflow-y-auto'>
              {data.Media.tags.map((tag: Tag) => (
                <div key={tag.name} className="px-1 m-0.5 bg-zinc-300 dark:bg-[#1D2126] rounded-sm text-sm text-zinc-500 max-sm:text-xs">
                  {tag.name}
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

